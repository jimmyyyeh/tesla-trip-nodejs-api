const bcrypt = require('bcrypt');
const config = require('../config/config')

const encryptPwd = (password) => {
    return bcrypt.hashSync(password, config.config.salt_rounds);
};

module.exports = {encryptPwd};
