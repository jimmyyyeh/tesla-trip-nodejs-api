const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { config } = require('../config/config');
const {
  ErrorHandler,
  UnauthorizedError
} = require('./errors');
const { errorCodes } = require('../config/error-codes');

const encryptPwd = (password) => {
  return bcrypt.hashSync(password, config.saltRounds);
};

const decryptPwd = (hashedPwd, password) => {
  return bcrypt.compareSync(password, hashedPwd);
};

const generateToken = (payload) => {
  return jwt.sign({
    payload,
    exp: config.tokenExpTime
  }, config.secretKey);
};

const decryptToken = (response, token) => {
  if (!token.startsWith('Bearer')) {
    ErrorHandler.error(new UnauthorizedError(response, 'token type invalidate', errorCodes.TOKEN_TYPE_INVALIDATE));
  }
  const {
    payload,
    error
  } = jwt.verify(token.replace('Bearer ', ''), config.secretKey);
  if (error) {
    ErrorHandler.error(new UnauthorizedError(response, 'token invalidate', errorCodes.TOKEN_INVALIDATE));
  } else {
    return payload;
  }
};

module.exports = {
  encryptPwd,
  decryptPwd,
  generateToken,
  decryptToken
};
