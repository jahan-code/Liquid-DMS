const {
    JwtToken: JwtTokenSchema,
} = require('../../../schemas/mongoDB/Auth/jwtTeken.schema');

// @Helper Functions
// const {
//   returnSuccess,
//   errorDB,
//   returnError,
// } = require('../../../utils/helperFunctions');

class JwtToken extends JwtTokenSchema { }

module.exports = JwtToken;
