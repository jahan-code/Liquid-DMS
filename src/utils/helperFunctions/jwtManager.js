const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const {
  randomConstant: {
    JWT_SECRET_CODE_V1,
    JWT_EXPIRY,
    EMAIL_VERIFICATION_JWT_SECRET_CODE,
  },
} = require('../../constants');
const { promisify } = require('util');

exports.jwtManager = {
  async generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET_CODE_V1, {
      expiresIn: '7d' || JWT_EXPIRY,
    }); // eslint-disable-line
  },
  async verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SECRET_CODE_V1, (err, decoded) => {
        if (err) {
          console.log('JWT did not validate the token', err);
          return reject(err);
        } else {
          console.log('JWT validated the token:', decoded);
          return resolve(decoded); // resolved decoded token { id: 'user-123', iat: ..., exp: ... }
        }
      });
    });
  },


  generateJWTSecret(email) {
    const emailHash = crypto.createHash('md5').update(email).digest('hex');
    return emailHash + EMAIL_VERIFICATION_JWT_SECRET_CODE + emailHash;
  },

  generateVerificationToken(email) {
    const emailHash = crypto.createHash('md5').update(email).digest('hex');
    const JWTSecret =
      emailHash + EMAIL_VERIFICATION_JWT_SECRET_CODE + emailHash;
    return jwt.sign({ email }, JWTSecret, {
      expiresIn: '24h',
    });
  },

  jwtDecode: promisify(jwt.verify),
};
