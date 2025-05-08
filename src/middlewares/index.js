
const { requestValidator } = require('./requestValidator.middleware');
const { errorHandler } = require('./errorHandler.middleware');


module.exports = {

    requestValidator,
    errorHandler,
};
