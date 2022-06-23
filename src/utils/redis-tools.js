const { client } = require('../config/redis');

const setVerifyToken = async (id, token) => {
  const key = `verify_user:${token}`;
  await client.connect();
  await client.set(key, id);
  await client.disconnect();
};

const getVerifyToken = async (token) => {
  const key = `verify_user:${token}`;
  await client.connect();
  const value = await client.get(key);
  await client.disconnect();
  return value;
};

const delVerifyToken = async (token) => {
  const key = `verify_user:${token}`;
  await client.connect();
  await client.del(key);
  await client.disconnect();
};

const setResetPasswordToken = async (id, token) => {
  const key = `reset_password:${token}`;
  await client.connect();
  await client.set(key, id);
  await client.disconnect();
};

const getResetPasswordToken = async (token) => {
  const key = `reset_password:${token}`;
  await client.connect();
  const value = await client.get(key);
  await client.disconnect();
  return value;
};

const delResetPasswordToken = async (token) => {
  const key = `reset_password:${token}`;
  await client.connect();
  await client.del(key);
  await client.disconnect();
};

module.exports = {
  setVerifyToken,
  getVerifyToken,
  delVerifyToken,
  setResetPasswordToken,
  getResetPasswordToken,
  delResetPasswordToken
};
