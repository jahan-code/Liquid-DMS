const { user, profile } = require('../validations/schemas');

exports.validationSchemas = {
    ...user,
    ...profile,
};
