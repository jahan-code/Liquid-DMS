const router = require('express').Router();

const { signUp, signIn, logout, sendVerifyOtp, verifyOtp, forgetPassword, resetPassword } = require('../../../controllers/auth/user.controller');
const { routesConfig } = require('../../../libs/configs');
const { authentication } = require('../../../middlewares/authentication.middleware');

const { subPaths } = routesConfig.auth.versions.v1.routes.user;

router.post(subPaths.signUp, signUp);
router.post(subPaths.signIn, signIn)
router.post(subPaths.logout, logout)
router.post(subPaths.sendVerifyOtp, sendVerifyOtp)
router.post(subPaths.verifyOtp, verifyOtp)
router.post(subPaths.forgetPassword, forgetPassword)
router.post(subPaths.resetPassword, resetPassword)
module.exports = router;
