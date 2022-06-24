const authTools = require('../../utils/auth-tools');
const mailTools = require('../../utils/mail-tools');
const redisTools = require('../../utils/redis-tools');
const model = require('../models/models');
const dbTools = require('../../utils/db-tools');
const toolkits = require('../../utils/toolkits');

const signIn = async (request, response) => {
  const transaction = await model.sequelize.transaction();
  try {
    const dbUser = await dbTools.getUserByUsername(request.body.username, transaction);
    if (!dbUser) {
      response.send('user is not exists');
      // TODO raise
    }
    if (!authTools.decryptPwd(dbUser.password, request.body.password)) {
      response.send('user invalidate');
      // TODO raise
    }
    let results = {
      id: dbUser.id,
      username: dbUser.username,
      nickname: dbUser.nickname,
      birthday: dbUser.birthday,
      sex: dbUser.sex,
      email: dbUser.email,
      point: dbUser.point,
      is_verified: dbUser.is_verified,
      role: dbUser.role,
      charger_id: dbUser.charger_id,
    };
    results['access_token'] = authTools.generateToken(results);
    results['token_type'] = 'bearer';
    response.send(toolkits.packageResponse(results, null));
  } catch (error) {
    console.log(error);
    // TODO raise
  }
};

const signUp = async (request, response) => {
  const transaction = await model.sequelize.transaction();
  try {
    const [dbUser, created] = await dbTools.upsertUser(request.body, transaction);
    if (created) {
      const results = {
        id: dbUser.id,
        username: dbUser.username,
        nickname: dbUser.nickname,
        birthday: dbUser.birthday,
        sex: dbUser.sex,
        email: dbUser.email,
        point: dbUser.point,
        is_verified: dbUser.is_verified,
        role: dbUser.role,
        charger_id: dbUser.charger_id,
      };
      await mailTools.sendVerifyMail(dbUser.id, request.body.email);
      response.send(toolkits.packageResponse(results, null));
    } else {
      response.send('user already exists');
      // TODO raise
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    // TODO raise
  }
};

const verify = async (request, response) => {
  const id = await redisTools.getVerifyToken(request.body.token);
  if (!id) {
    response.send('token is not exists');
    // TODO raise
  }
  const transaction = await model.sequelize.transaction();
  try {
    const dbUser = await dbTools.getUserByID(id, transaction);
    if (!dbUser) {
      response.send('user is not exists');
      // TODO raise
    }
    const data = { is_verified: true };
    await dbUser.update(data, { transaction: transaction });
    await redisTools.delVerifyToken(request.body.token);
    response.send(toolkits.packageResponse(true, null));
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    // TODO raise
  }
};

const resendVerify = async (request, response) => {
  const transaction = await model.sequelize.transaction();
  try {
    const dbUser = await dbTools.getUserByUsername(request.body.username, transaction);
    if (!dbUser) {
      response.send('user is not exists');
      // TODO raise
    }
    await mailTools.sendVerifyMail(dbUser.id, dbUser.email);
    response.send(toolkits.packageResponse(true, null));
  } catch (error) {
    console.log(error);
    // TODO raise
  }
};

const requestResetPassword = async (request, response) => {
  const transaction = await model.sequelize.transaction();
  try {
    const dbUser = await dbTools.getUserByEmail(request.body.email, transaction);
    if (!dbUser) {
      response.send('user is not exists');
      // TODO raise
    }
    await mailTools.sendResetPasswordMail(dbUser.id, dbUser.email);
    response.send(toolkits.packageResponse(true, null));
  } catch (error) {
    console.log(error);
    // TODO raise
  }
};

const resetPassword = async (request, response) => {
  const transaction = await model.sequelize.transaction();
  try {
    const id = await redisTools.getResetPasswordToken(request.body.token);
    if (!id) {
      response.send('token is not exists');
      // TODO raise
    }
    const dbUser = await dbTools.getUserByID(id, transaction);
    if (dbUser.username !== request.body.username) {
      response.send('token invalidate');
      // TODO raise
    }
    const data = { password: authTools.encryptPwd(request.body.password) };
    await dbUser.update(data, { transaction: transaction });
    await transaction.commit();
    response.send(toolkits.packageResponse(true, null));
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    // TODO raise
  }
};

const getProfile = (request, response) => {
  const user = authTools.decryptToken(request.headers.authorization);
  response.send(user);
};

const updateProfile = async (request, response) => {
  const user = authTools.decryptToken(request.headers.authorization);
  const transaction = await model.sequelize.transaction();
  try {
    const dbUser = await dbTools.getUserByUsername(user.username, transaction);
    const data = {};
    if (request.body.email) {
      data['email'] = request.body.email;
    }
    if (request.body.nickname) {
      data['nickname'] = request.body.nickname;
    }
    await dbUser.update(data, { transaction: transaction });
    await transaction.commit();
    const results = {
      id: dbUser.id,
      username: dbUser.username,
      nickname: dbUser.nickname,
      birthday: dbUser.birthday,
      sex: dbUser.sex,
      email: dbUser.email,
      point: dbUser.point,
      is_verified: dbUser.is_verified,
      role: dbUser.role,
      charger_id: dbUser.charger_id,
    };
    response.send(toolkits.packageResponse(results, null));
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    // TODO raise
  }
};

module.exports = {
  signIn,
  signUp,
  verify,
  resendVerify,
  requestResetPassword,
  resetPassword,
  getProfile,
  updateProfile
};
