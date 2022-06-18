import Joi from 'joi';

const envVarSchema = Joi.object().keys({
  NODE_ENV: Joi.string().default('development').allow('development', 'production'),
  PORT: Joi.number().default(5000),
  VERSION: Joi.string(),
  DB_NAME: Joi.string(),
  MYSQL_PORT: Joi.number().default(3306),
  MYSQL_HOST: Joi.string().default('localhost'),
  MYSQL_USER: Joi.string(),
  MYSQL_PASSWORD: Joi.string(),
}).unknown().required();

const {error} = envVarSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  version: process.env.VERSION,
  db_name: process.env.db_name,
  mysql_port: process.env.mysql_port,
  mysql_host: process.env.mysql_host,
  mysql_user: process.env.mysql_user,
  mysql_password: process.env.mysql_password,
};

export default config;
