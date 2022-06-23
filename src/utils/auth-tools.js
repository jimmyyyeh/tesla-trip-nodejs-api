const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { config } = require('../config/config');

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

const decryptToken = (token) => {
  const {
    payload,
    error
  } = jwt.verify(token, config.secretKey);
  if (error) {
    // TODO raise
    console.log(error);
    return null;
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
