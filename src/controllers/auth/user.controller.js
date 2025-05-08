// @Dependencies
const { v4: uuid } = require('uuid');
const bcrypt = require('bcryptjs');

// @Models
const UserModel = require('../../models/mongodb/auth/User.model');
const TokenModel = require('../../models/mongodb/auth/JwtToken.model');
// now `new TokenModel(...)` will work

require('dotenv').config()
// @Helper Functions
const {
    jwtManager: { generateToken },
    successResponse,
    errorResponse,
} = require('../../utils/helperFunctions');

// @Constants
const {
    errorCode: { ER_DUP_ENTRY, DATA_NOT_FOUND, INVALID_PASSWORD, OTP_EXPIRED, OTP_DID_NOT_MATCH, USER_NOT_FOUND },
} = require('../../constants');
const transporter = require('../../libs/emailHandler');


const user = {};

user.signUp = async (req, res, next) => {
    let { FullName, email, password } = req.body;
    email = email.toLowerCase();


    try {

        let data = await UserModel.findOne({ email });
        if (data) throw errorResponse(ER_DUP_ENTRY);
        const hashedPassword = await bcrypt.hash(password, 10);

        // save to the mongoDB
        const userData = {
            userID: `user-${uuid()}`,
            FullName,
            email,
            password: hashedPassword,
        };


        const result = new UserModel(userData);
        await result.save();

        const jwtDTO = { id: result.userID };
        const token = await generateToken(jwtDTO);
        res.cookie("token", token);


        return successResponse({
            res,
            code: 200,
            message: 'Sign Up succeed.',
            data: {
                userID: result.userID,
                FullName,
                email,

            },
        });
    } catch (e) {
        next(e);
    }
};
user.signIn = async (req, res, next) => {
    const { email: rawEmail, password } = req.body;
    const email = rawEmail.toLowerCase();
    const existing = await UserModel.findOne({ email }).lean();
    if (!existing) {
        throw new errorResponse(DATA_NOT_FOUND);
    }
    const matches = await bcrypt.compare(password, existing.password);
    if (!matches) {
        throw new errorResponse(INVALID_PASSWORD);
    }

    const jwtDTO = { id: existing.userID };
    const token = await generateToken(jwtDTO);


    res.cookie("token", token);
    return successResponse({
        res,
        code: 200,
        message: 'Login succeed.',
        data: {
            userID: existing.userID,
            name: existing.fullname,
            email: existing.email,
        },
    });
}

user.logout = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return next(errorResponse(DATA_NOT_FOUND));
        }

        res.clearCookie("token");

        return successResponse({
            res,
            code: 200,
            message: "Logged out successfully.",
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

user.sendVerifyOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email })

        if (user.isAccountVerified) {
            return successResponse({
                res,
                code: 200,
                message: "Account already verified!.",
                data: {
                    name: user.fullname,
                    email: user.email,
                }
            });
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        user.Otp = otp;
        user.ExpireAt = Date.now() + 2 * 60 * 1000;
        await user.save();
        const expiresAt = new Date(user.ExpireAt).toLocaleTimeString();

        const mailOptions = {
            from: process.env.SENDER_EMAIL, // your Webmail sender address
            to: user.email, // recipient's email
            subject: 'Your One-Time Password (OTP)',
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                <h2>🔐 Your OTP Code</h2>
                <p>Hello,</p>
                <p>Use the following 4-digit OTP to complete your action:</p>
                <h3 style="background: #f0f0f0; padding: 10px; width: fit-content;">${otp}</h3>
                <p>This OTP is valid until <strong>${expiresAt}</strong> (2 minutes from now).</p>
                <p>If you didn’t request this, please ignore this email.</p>
                <br/>
                <p>Thanks,<br/>The Qubitars Team</p>
              </div>
            `,
        };
        await transporter.sendMail(mailOptions);
        return successResponse({
            res,
            code: 200,
            message: "Verification Otp send on Email.",
            data: {
                email: user.email,
            }
        });
    } catch (err) {
        next(err)
    }

}
user.verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        // Find the user
        const user = await UserModel.findOne({ email });

        if (!user) {
            return next(errorResponse(USER_NOT_FOUND));
        }


        if (!user.Otp || !user.ExpireAt) {
            return next(errorResponse(DATA_NOT_FOUND));
        }


        if (Date.now() > user.ExpireAt) {
            return next(errorResponse(OTP_EXPIRED));
        }


        if (user.Otp !== otp) {
            return next(errorResponse(OTP_DID_NOT_MATCH));
        }


        user.isAccountVerified = true;
        user.Otp = '';
        user.ExpireAt = 0;
        await user.save();

        return successResponse({
            res,
            code: 200,
            message: "Account verified successfully.",
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
user.forgetPassword = async (req, res, next) => {
    try {
        const { email: rawEmail } = req.body;
        const email = rawEmail.toLowerCase();

        const user = await UserModel.findOne({ email });

        if (!user) {
            return next(errorResponse(USER_NOT_FOUND));
        }

        // Generate 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        user.Otp = otp;
        user.ExpireAt = Date.now() + 2 * 60 * 1000; // 2 minutes from now

        await user.save();
        const expiresAt = new Date(user.ExpireAt).toLocaleTimeString();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Reset Your Password - Full-AUTH',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                    <h2>🔐 Password Reset OTP</h2>
                    <p>Hello <strong>${user.email}</strong>,</p>
                    <p>Use the following OTP to reset your password:</p>
                    <h3 style="background: #f0f0f0; padding: 10px; width: fit-content;">${otp}</h3>
                    <p>This OTP is valid until <strong>${expiresAt}</strong> (2 minutes from now).</p>
                    <p>If you didn't request a password reset, you can safely ignore this email.</p>
                    <br/>
                    <p>Thanks,<br/>The Full-AUTH Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return successResponse({
            res,
            code: 200,
            message: 'OTP sent to your email for password reset.',
            data: { email: user.email }
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

        if (!user)
            return next(errorResponse(USER_NOT_FOUND));


        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;

        user.Otp = '';
        user.ExpireAt = 0;
        await user.save();

        return successResponse({
            res,
            code: 200,
            message: "Password has been reset successfully.",
            data: {
                email: user.email,
            }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = user