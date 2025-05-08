const Joi = require('joi');
const { routesConfig } = require('../../../libs/configs');
const { baseURL, auth, methods } = routesConfig;
const { v1 } = auth.versions;
const { GET, POST, PUT, DELETE } = methods; // eslint-disable-line

exports.user = {
    [[
        baseURL,
        auth.path,
        v1.path,
        v1.routes.user.path,
        v1.routes.user.subPaths.signUp,
    ].join('')]: {
        [POST]: Joi.object({
            fullname: Joi.string().required(),
            email: Joi.string().email({ tlds: { allow: false } }).required(),
            password: Joi.string().required()
        }),
    },
    [[
        baseURL,
        auth.path,
        v1.path,
        v1.routes.user.path,
        v1.routes.user.subPaths.signIn,
    ].join('')]: {
        [POST]: Joi.object({
            email: Joi.string().email({ tlds: { allow: false } }).required(),
            password: Joi.string().required(),
        }),
    },
    [[
        baseURL,
        auth.path,
        v1.path,
        v1.routes.user.path,
        v1.routes.user.subPaths.logout,
    ].join('')]: {
        [POST]: Joi.object({}),
    },
    [[
        baseURL,
        auth.path,
        v1.path,
        v1.routes.user.path,
        v1.routes.user.subPaths.sendVerifyOtp,
    ].join('')]: {
        [POST]: Joi.object({
            email: Joi.string().email({ tlds: { allow: false } }).required(),
        }),
    },
    [[
        baseURL,
        auth.path,
        v1.path,
        v1.routes.user.path,
        v1.routes.user.subPaths.verifyOtp,
    ].join('')]: {
        [POST]: Joi.object({
            email: Joi.string().email({ tlds: { allow: false } }).required(),
            otp: Joi.string().length(4).required(),
        }),
    },
    [[
        baseURL,
        auth.path,
        v1.path,
        v1.routes.user.path,
        v1.routes.user.subPaths.forgetPassword,
    ].join('')]: {
        [POST]: Joi.object({
            email: Joi.string().email({ tlds: { allow: false } }).required(),
        }),
    },
    [[
        baseURL,
        auth.path,
        v1.path,
        v1.routes.user.path,
        v1.routes.user.subPaths.resetPassword,
    ].join('')]: {
        [POST]: Joi.object({
            email: Joi.string().email({ tlds: { allow: false } }).required(),
            newPassword: Joi.string().required()
        }),
    },

};
