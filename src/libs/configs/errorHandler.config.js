const { errorCode, responseCode } = require('../../constants');
const {
    SERVER_SIDE_ERROR,
    INVALID_ROUTE,
    INVALID_METHOD,
    ER_DUP_ENTRY,
    DB_OPERATION_FAILED,
    INTERNAL_AUTHENTICATION_ERROR,
    AUTHENTICATION_TOKEN_NOT_FOUND,
    AUTHORIZATION_ERROR,
    VALIDATION_ERROR,
    DATA_NOT_FOUND,
    INVALID_PASSWORD,
    INVALID_EMAIL,
    // USER_ALREADY_EXIST,
    CONNECTION_FAILED,
    INACTIVE_USER,
    SUBSCRIPTION_INACTIVE,
    OTP_EXPIRED,
    OTP_DID_NOT_MATCH,
    USER_ALREADY_EXIST_WITH_ANOTHER_ROLE,
    PROPERTY_ALREADY_OCCOPIED,
} = errorCode;

const {
    SERVER_CRASHED,
    INVALID_CREDENTIAL,
    NOT_EXIST,
    BAD_REQUEST,
    AUTHENTICATION_FAILED,
    AUTHORIZATION_FAILED,
    DUPLICATE_RESOURCE,
} = responseCode;

exports.errorHandlerConfig = {
    [SERVER_SIDE_ERROR]: {
        message: 'Server Side Error',
        code: SERVER_CRASHED,
    },

    [INVALID_ROUTE]: {
        message: 'Request route is not defined properly',
        code: BAD_REQUEST,
    },

    [INVALID_METHOD]: {
        message: 'Request method is not defined properly',
        code: BAD_REQUEST,
    },

    [VALIDATION_ERROR]: {
        message: 'Validation error',
        code: BAD_REQUEST,
    },

    [ER_DUP_ENTRY]: {
        message: 'Record already exist',
        code: DUPLICATE_RESOURCE,
    },

    [DB_OPERATION_FAILED]: {
        message: 'Something went wrong',
        code: BAD_REQUEST,
    },

    [INTERNAL_AUTHENTICATION_ERROR]: {
        message: 'Authentication Failed',
        code: AUTHENTICATION_FAILED,
    },

    [AUTHENTICATION_TOKEN_NOT_FOUND]: {
        message: 'Authentication token not found',
        code: AUTHENTICATION_FAILED,
    },

    [AUTHORIZATION_ERROR]: {
        message: 'Authorization failed',
        code: AUTHORIZATION_FAILED,
    },
    [DATA_NOT_FOUND]: {
        message: 'Data not found',
        code: NOT_EXIST,
    },
    [INVALID_EMAIL]: {
        message: 'Invalid Email address!',
        code: INVALID_CREDENTIAL,
    },
    [INVALID_PASSWORD]: {
        message: 'Invalid Password!',
        code: INVALID_CREDENTIAL,
    },
    [CONNECTION_FAILED]: {
        message: 'Connection with emailing server failed',
        code: BAD_REQUEST,
    },
    [INACTIVE_USER]: {
        message: 'Inactive user',
        code: BAD_REQUEST,
    },
    [SUBSCRIPTION_INACTIVE]: {
        message: 'Subscription is inactive',
        code: BAD_REQUEST,
    },
    [OTP_DID_NOT_MATCH]: {
        message: 'OTP is not matched',
        code: BAD_REQUEST,
    },
    [OTP_EXPIRED]: {
        message: 'OTP is expired',
        code: BAD_REQUEST,
    },
    [USER_ALREADY_EXIST_WITH_ANOTHER_ROLE]: {
        message: 'user already exist with another role',
        code: BAD_REQUEST,
    },
    [PROPERTY_ALREADY_OCCOPIED]: {
        message: 'This property already occupied',
        code: BAD_REQUEST,
    },
};
