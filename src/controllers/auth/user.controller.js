// @Dependencies
const { v4: uuid } = require('uuid');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// @Models
const UserModel = require('../../models/mongodb/auth/User.model');

// @Helper Functions
const {
    jwtManager: { generateToken },
    successResponse,
    errorResponse,
} = require('../../utils/helperFunctions');
const readTemplate = require('../../utils/readHTMLFile');

const transporter = require('../../libs/emailHandler');

// @Constants
const {
    errorCode: {
        ER_DUP_ENTRY,
        DATA_NOT_FOUND,
        INVALID_PASSWORD,
        OTP_EXPIRED,
        OTP_DID_NOT_MATCH,
        USER_NOT_FOUND,
    },
} = require('../../constants');

const generateOtpAndExpiry = () => ({
    otp: Math.floor(1000 + Math.random() * 9000).toString(),
    expireAt: Date.now() + 2 * 60 * 1000,
});

const setTokenCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
    });
};

const user = {};

user.signUp = async (req, res, next) => {
    let { fullname, email, password } = req.body;
    email = email.toLowerCase();

    try {
        const existing = await UserModel.findOne({ email });
        if (existing) return next(errorResponse(ER_DUP_ENTRY));

        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = {
            userID: `user-${uuid()}`,
            fullname,
            email,
            password: hashedPassword,
        };

        const newUser = new UserModel(userData);
        await newUser.save();

        const token = await generateToken({ id: newUser.userID });
        setTokenCookie(res, token);

        return successResponse({
            res,
            code: 200,
            message: 'Sign Up succeeded.',
            data: { userID: newUser.userID, fullname, email },
        });
    } catch (err) {
        next(err);
    }
};

user.signIn = async (req, res, next) => {
    const { email: rawEmail, password } = req.body;
    const email = rawEmail.toLowerCase();

    try {
        const user = await UserModel.findOne({ email }).lean();
        if (!user) return next(errorResponse(USER_NOT_FOUND));

        const matches = await bcrypt.compare(password, user.password);
        if (!matches) return next(errorResponse(INVALID_PASSWORD));

        const token = await generateToken({ id: user.userID });
        setTokenCookie(res, token);

        return successResponse({
            res,
            code: 200,
            message: 'Login succeeded.',
            data: {
                userID: user.userID,
                name: user.fullname,
                email: user.email,
            },
        });
    } catch (err) {
        next(err);
    }
};

user.logout = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return next(errorResponse(DATA_NOT_FOUND));

        res.clearCookie("token");
        return successResponse({ res, code: 200, message: "Logged out successfully.", data: {} });
    } catch (err) {
        next(err);
    }
};

user.sendVerifyOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) return next(errorResponse(USER_NOT_FOUND));
        if (user.isAccountVerified) {
            return successResponse({
                res,
                code: 200,
                message: "Account already verified!",
                data: { name: user.fullname, email: user.email },
            });
        }

        const { otp, expireAt } = generateOtpAndExpiry();
        user.Otp = otp;
        user.ExpireAt = expireAt;
        await user.save();

        const expiresAt = new Date(expireAt).toLocaleTimeString();
        const template = readTemplate('emailTemplates/verifyOtp.html');
        const html = template.replace('{{otp}}', otp).replace('{{email}}', user.email).replace('{{expiresAt}}', expiresAt);

        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Your One-Time Password (OTP)',
            html,
        });

        return successResponse({ res, code: 200, message: "Verification OTP sent.", data: { email: user.email } });
    } catch (err) {
        next(err);
    }
};

user.verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) return next(errorResponse(USER_NOT_FOUND));
        if (!user.Otp || !user.ExpireAt) return next(errorResponse(DATA_NOT_FOUND));
        if (Date.now() > user.ExpireAt) return next(errorResponse(OTP_EXPIRED));
        if (String(user.Otp) !== String(otp)) return next(errorResponse(OTP_DID_NOT_MATCH));

        user.isAccountVerified = true;
        user.Otp = '';
        user.ExpireAt = 0;
        await user.save();

        return successResponse({
            res,
            code: 200,
            message: "Account verified successfully.",
            data: { userID: user.userID, name: user.fullname, email: user.email },
        });
    } catch (err) {
        next(err);
    }
};

user.forgetPassword = async (req, res, next) => {
    try {
        const { email: rawEmail } = req.body;
        const email = rawEmail.toLowerCase();
        const user = await UserModel.findOne({ email });

        if (!user) return next(errorResponse(USER_NOT_FOUND));


        const { otp, expireAt } = generateOtpAndExpiry();
        user.Otp = otp;
        user.ExpireAt = expireAt;
        await user.save();

        const expiresAt = new Date(expireAt).toLocaleTimeString();
        const template = readTemplate('emailTemplates/resetPassword.html');
        const html = template.replace('{{otp}}', otp).replace('{{email}}', user.email).replace('{{expiresAt}}', expiresAt);

        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Reset Your Password - Full-AUTH',
            html,
        });

        return successResponse({
            res,
            code: 200,
            message: 'OTP sent to your email for password reset.',
            data: { email: user.email },
        });
    } catch (err) {
        next(err);
    }
};

user.resetPassword = async (req, res, next) => {
    try {
        const { email: rawEmail, newPassword } = req.body;
        const email = rawEmail.toLowerCase();
        const user = await UserModel.findOne({ email });

        if (!user) return next(errorResponse(USER_NOT_FOUND));

        user.password = await bcrypt.hash(newPassword, 10);
        user.Otp = '';
        user.ExpireAt = 0;
        await user.save();

        return successResponse({
            res,
            code: 200,
            message: "Password has been reset successfully.",
            data: { email: user.email },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = user;
