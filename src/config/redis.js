const { createClient } = require('redis');
const { config } = require('../config/config');

const client = createClient({ url: `redis://${config.redis_host}:${config.redis_port}` });

module.exports = { client };
