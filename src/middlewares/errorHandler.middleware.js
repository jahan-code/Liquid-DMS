const { errorHandlerConfig } = require('../libs/configs');

const { SERVER_SIDE_ERROR } = errorHandlerConfig;

exports.errorHandler = (err, req, res, next) => {
    // eslint-disable-line
    let message = null,
        code = null;
    if (errorHandlerConfig[err.code]) {
        message = errorHandlerConfig[err.code].message;
        code = errorHandlerConfig[err.code].code;
    } else {
        message = SERVER_SIDE_ERROR.message;
        code = SERVER_SIDE_ERROR.code;
    }

    return res.status(code).json({
        status: {
            code,
            success: false,
        },
        response: {
            message,
            error: err.message ? err.message : err,
        },
    });
};
