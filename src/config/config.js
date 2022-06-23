const Joi = require('joi');

const envVarSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .default('development')
      .allow('development', 'production'),
    PORT: Joi.number()
      .default(5000),
    VERSION: Joi.string(),
    WEB_DOMAIN: Joi.string(),
    API_DOMAIN: Joi.string(),
    DB_NAME: Joi.string(),
    MYSQL_PORT: Joi.number()
      .default(3306),
    MYSQL_HOST: Joi.string()
      .default('localhost'),
    MYSQL_USER: Joi.string(),
    MYSQL_PASSWORD: Joi.string(),
    REDIS_HOST: Joi.string(),
    REDIS_PORT: Joi.string(),
    SALT_ROUNDS: Joi.number(),
    SECRET_KEY: Joi.string(),
    TOKEN_EXP_TIME: Joi.number()
      .default(60 * 15 * 100),
    MAIL_USERNAME: Joi.string(),
    MAIL_PASSWORD: Joi.string(),
    OAUTH_CLIENT_ID: Joi.string(),
    OAUTH_PASSWORD: Joi.string(),
    OAUTH_ACCESS_TOKEN: Joi.string(),
    OAUTH_REFRESH_TOKEN: Joi.string(),
  })
  .unknown()
  .required();

const { error } = envVarSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10),
  version: process.env.VERSION,
  webDomain: process.env.WEB_DOMAIN,
  apiDomain: process.env.API_DOMAIN,
  dbName: process.env.DB_NAME,
  mysqlPort: parseInt(process.env.MYSQL_PORT, 10),
  mysqlHost: process.env.MYSQL_HOST,
  mysqlUser: process.env.MYSQL_USER,
  mysqlPassword: process.env.MYSQL_PASSWORD,
  redis_host: process.env.REDIS_HOST,
  redis_port: process.env.REDIS_PORT,
  saltRounds: parseInt(process.env.SALT_ROUNDS, 10),
  secretKey: process.env.SECRET_KEY,
  tokenExpTime: parseInt(process.env.TOKEN_EXP_TIME),
  mailUsername: process.env.MAIL_USERNAME,
  mailPassword: process.env.MAIL_PASSWORD,
  oauthClientID: process.env.OAUTH_CLIENT_ID,
  oauthPassword: process.env.OAUTH_PASSWORD,
  oauthAccessToken: process.env.OAUTH_ACCESS_TOKEN,
  oauthRefreshToken: process.env.OAUTH_REFRESH_TOKEN,
};

module.exports = { config };
