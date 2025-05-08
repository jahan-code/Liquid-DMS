exports.errorResponse = (code) => {
    const error = new Error();
    error.code = code;
    error.date = new Date();
    return error;
};