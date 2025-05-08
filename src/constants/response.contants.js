exports.responseCode = {
    SERVER_CRASHED: 500,
    INVALID_CREDENTIAL: 409,
    NOT_EXIST: 404,
    BAD_REQUEST: 400,
    AUTHENTICATION_FAILED: 401,
    AUTHORIZATION_FAILED: 403,
    // Additional HTTP Status Codes
    DUPLICATE_RESOURCE: 409, // Conflict - Resource already exists
    FORBIDDEN: 403, // Forbidden - User does not have permission to perform the operation
    UNPROCESSABLE_ENTITY: 422, // Unprocessable Entity - Invalid data or input
    TOO_MANY_REQUESTS: 429, // Too Many Requests - Rate limiting exceeded
    INTERNAL_SERVER_ERROR: 500, // Internal Server Error - Generic server error
    SERVICE_UNAVAILABLE: 503, // Service Unavailable - Server is temporarily unavailable
    GATEWAY_TIMEOUT: 504, // Gateway Timeout - Upstream server did not respond in time
};
