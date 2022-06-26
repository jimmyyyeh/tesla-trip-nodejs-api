const model = require('../models/models');
const authTools = require('../../utils/auth-tools');
const mailTools = require('../../utils/mail-tools');
const redisTools = require('../../utils/redis-tools');
const dbTools = require('../../utils/db-tools');
const toolkits = require('../../utils/toolkits');
const {
  ErrorHandler,
  UnauthorizedError,
  InternalServerError,
  ResourceConflictError
} = require('../../utils/errors');
const { errorCodes } = require('../../config/error-codes');

const signIn = async (request, response) => {
  const transaction = await model.sequelize.transaction();
  try {
    const dbUser = await dbTools.getUserByUsername(request.body.username, transaction);
    if (!dbUser) {
      ErrorHandler(new UnauthorizedError(response, 'user does not exist', errorCodes.USER_NOT_EXIST));
    }
    if (!authTools.decryptPwd(dbUser.password, request.body.password)) {
      ErrorHandler(new UnauthorizedError(response, 'user invalidate', errorCodes.USER_INVALIDATE));
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
    if (response.headersSent) {
      console.log(error);
    } else {
      ErrorHandler(new InternalServerError(response, 'internal server error', errorCodes.INTERNAL_SERVER_ERROR));
    }
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
      ErrorHandler(new ResourceConflictError(response, 'user already exist', errorCodes.USER_ALREADY_EXIST));
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    ErrorHandler(new InternalServerError(response, 'internal server error', errorCodes.INTERNAL_SERVER_ERROR));
  }
};

const verify = async (request, response) => {
  const id = await redisTools.getVerifyToken(request.body.token);
  if (!id) {
    ErrorHandler(new UnauthorizedError(response, 'token not exist', errorCodes.TOKEN_MISSING));
  }
  const transaction = await model.sequelize.transaction();
  try {
    const dbUser = await dbTools.getUserByID(id, transaction);
    if (!dbUser) {
      ErrorHandler(new UnauthorizedError(response, 'user not exist', errorCodes.USER_NOT_EXIST));
    }
    const data = { is_verified: true };
    await dbUser.update(data, { transaction: transaction });
    await redisTools.delVerifyToken(request.body.token);
    response.send(toolkits.packageResponse(true, null));
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    ErrorHandler(new InternalServerError(response, 'internal server error', errorCodes.INTERNAL_SERVER_ERROR));
  }
};

const resendVerify = async (request, response) => {
  const transaction = await model.sequelize.transaction();
  try {
    const dbUser = await dbTools.getUserByUsername(request.body.username, transaction);
    if (!dbUser) {
      ErrorHandler(new UnauthorizedError(response, 'user not exist', errorCodes.USER_NOT_EXIST));
    }
    await mailTools.sendVerifyMail(dbUser.id, dbUser.email);
    response.send(toolkits.packageResponse(true, null));
  } catch (error) {
    if (response.headersSent) {
      console.log(error);
    } else {
      ErrorHandler(new InternalServerError(response, 'internal server error', errorCodes.INTERNAL_SERVER_ERROR));
    }
  }
};

const requestResetPassword = async (request, response) => {
  const transaction = await model.sequelize.transaction();
  try {
    const dbUser = await dbTools.getUserByEmail(request.body.email, transaction);
    if (!dbUser) {
      ErrorHandler(new UnauthorizedError(response, 'user not exist', errorCodes.USER_NOT_EXIST));
    }
    await mailTools.sendResetPasswordMail(dbUser.id, dbUser.email);
    response.send(toolkits.packageResponse(true, null));
  } catch (error) {
    if (response.headersSent) {
      console.log(error);
    } else {
      ErrorHandler(new InternalServerError(response, 'internal server error', errorCodes.INTERNAL_SERVER_ERROR));
    }
  }
};

const resetPassword = async (request, response) => {
  const transaction = await model.sequelize.transaction();
  try {
    const id = await redisTools.getResetPasswordToken(request.body.token);
    if (!id) {
      ErrorHandler(new UnauthorizedError(response, 'token not exist', errorCodes.TOKEN_MISSING));
    }
    const dbUser = await dbTools.getUserByID(id, transaction);
    if (dbUser.username !== request.body.username) {
      ErrorHandler(new UnauthorizedError(response, 'token invalidate', errorCodes.TOKEN_INVALIDATE));
    }
    const data = { password: authTools.encryptPwd(request.body.password) };
    await dbUser.update(data, { transaction: transaction });
    await transaction.commit();
    response.send(toolkits.packageResponse(true, null));
  } catch (error) {
    await transaction.rollback();
    ErrorHandler(new InternalServerError(response, 'internal server error', errorCodes.INTERNAL_SERVER_ERROR));
  }
};

const getProfile = (request, response) => {
  const user = authTools.decryptToken(response, request.headers.authorization);
  response.send(user);
};

const updateProfile = async (request, response) => {
  const user = authTools.decryptToken(response, request.headers.authorization);
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
    ErrorHandler(new InternalServerError(response, 'internal server error', errorCodes.INTERNAL_SERVER_ERROR));
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
