const Joi = require('joi');

const envVarSchema = Joi.object().keys({
  NODE_ENV: Joi.string().default('development').allow('development', 'production'),
  PORT: Joi.number().default(5000),
  VERSION: Joi.string(),
  WEB_DOMAIN: Joi.string(),
  API_DOMAIN: Joi.string(),
  DB_NAME: Joi.string(),
  MYSQL_PORT: Joi.number().default(3306),
  MYSQL_HOST: Joi.string().default('localhost'),
  MYSQL_USER: Joi.string(),
  MYSQL_PASSWORD: Joi.string(),
  SALT_ROUNDS: Joi.number(),
  SECRET_KEY: Joi.string(),
  TOKEN_EXP_TIME: Joi.number().default(60 * 15 * 100),
  MAIL_USERNAME: Joi.string(),
  MAIL_PASSWORD: Joi.string(),
  OAUTH_CLIENT_ID: Joi.string(),
  OAUTH_PASSWORD: Joi.string(),
  OAUTH_ACCESS_TOKEN: Joi.string(),
  OAUTH_REFRESH_TOKEN: Joi.string(),
}).unknown().required();

const {error} = envVarSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  node_env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10),
  version: process.env.VERSION,
  web_domain: process.env.WEB_DOMAIN,
  api_domain: process.env.API_DOMAIN,
  db_name: process.env.DB_NAME,
  mysql_port: parseInt(process.env.MYSQL_PORT, 10),
  mysql_host: process.env.MYSQL_HOST,
  mysql_user: process.env.MYSQL_USER,
  mysql_password: process.env.MYSQL_PASSWORD,
  salt_rounds: parseInt(process.env.SALT_ROUNDS, 10),
  secret_key: process.env.SECRET_KEY,
  token_exp_time: parseInt(process.env.TOKEN_EXP_TIME),
  mail_username: process.env.MAIL_USERNAME,
  mail_password: process.env.MAIL_PASSWORD,
  oauth_client_id: process.env.OAUTH_CLIENT_ID,
  oauth_password: process.env.OAUTH_PASSWORD,
  oauth_access_token: process.env.OAUTH_ACCESS_TOKEN,
  oauth_refresh_token: process.env.OAUTH_REFRESH_TOKEN,
};

module.exports = {config};
