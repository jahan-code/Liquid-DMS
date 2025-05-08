const { validationSchemas } = require('../validations');

const { errorResponse } = require('../utils/helperFunctions');

const {
    errorCode: { VALIDATION_ERROR, INVALID_ROUTE, INVALID_METHOD },
} = require('../constants');

exports.requestValidator = (req, res, next) => {
    const { method, body, files, _parsedUrl, query, baseUrl, url, originalUrl } =
        req; // eslint-disable-line
    const fullURL = _parsedUrl.pathname;
    let data = null;
    switch (method) {
        case 'POST':
            data = files && files.length ? { ...body, files } : body;
            break;
        case 'PUT':
            data = files && files.length ? { ...body, files } : body;
            break;
        case 'GET':
            data = query;
            break;
        case 'DELETE':
            data = query;
            break;
        default:
            data = {};
    }

    try {
        if (!validationSchemas[fullURL]) throw errorResponse(INVALID_ROUTE);

        if (!validationSchemas[fullURL][method])
            throw errorResponse(INVALID_METHOD);

        const { error } = validationSchemas[fullURL][method].validate(data);

        if (error) throw { ...error.details[0], code: VALIDATION_ERROR };
        else next();
    } catch (e) {
        next(e);
    }
};
