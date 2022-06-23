const Joi = require('joi');

const envVarSchema = Joi.object().keys({
  NODE_ENV: Joi.string().default('development').allow('development', 'production'),
  PORT: Joi.number().default(5000),
  VERSION: Joi.string(),
  DB_NAME: Joi.string(),
  MYSQL_PORT: Joi.number().default(3306),
  MYSQL_HOST: Joi.string().default('localhost'),
  MYSQL_USER: Joi.string(),
  MYSQL_PASSWORD: Joi.string(),
  SALT_ROUNDS: Joi.number(),
  SECRET_KEY: Joi.string(),
  TOKEN_EXP_TIME: Joi.number().default(60 * 15 * 100),
}).unknown().required();

const {error} = envVarSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  node_env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10),
  version: process.env.VERSION,
  db_name: process.env.DB_NAME,
  mysql_port: parseInt(process.env.MYSQL_PORT, 10),
  mysql_host: process.env.MYSQL_HOST,
  mysql_user: process.env.MYSQL_USER,
  mysql_password: process.env.MYSQL_PASSWORD,
  salt_rounds: parseInt(process.env.SALT_ROUNDS, 10),
  secret_key: process.env.SECRET_KEY,
  token_exp_time: parseInt(process.env.TOKEN_EXP_TIME),
};

module.exports = {config};
