const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {config} = require('../config/config')

const encryptPwd = (password) => {
    return bcrypt.hashSync(password, config.salt_rounds);
};

const decryptPwd = (hashedPwd, password) => {
    return bcrypt.compareSync(password, hashedPwd);
}

const generateToken = (payload) => {
    return jwt.sign({payload, exp: config.token_exp_time}, config.secret_key);
}

module.exports = {encryptPwd, decryptPwd, generateToken};
