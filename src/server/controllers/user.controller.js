const authTools = require('../../utils/auth-tools');
const mailTools = require('../../utils/mail-tools');
const redisTools = require('../../utils/redis-tools');
const model = require('../models/models');
const {
  getUserByUsername,
  upsertUser,
  getUserByID
} = require('../../utils/db-tools');

const signIn = async (req, res) => {
  const transaction = await model.sequelize.transaction();
  try {
    const dbUser = getUserByUsername(req.body.username, transaction);
    if (!dbUser) {
      res.send('user not exists');
      // TODO raise
    }
    if (!authTools.decryptPwd(dbUser.password, req.body.password)) {
      res.send('user invalidate');
      // TODO raise
    }
    let result = {
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
    result['access_token'] = authTools.generateToken(result);
    result['token_type'] = 'bearer';
    res.send(result);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    // TODO raise
  }
};

const signUp = async (req, res) => {
  const transaction = await model.sequelize.transaction();
  try {
    const [dbUser, created] = upsertUser(req.body, transaction);
    if (created) {
      const result = {
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
      res.send(result);
      await mailTools.sendVerifyMail(dbUser.id, req.body.email, 'Tesla Trip 驗證信件',);
    } else {
      res.send('user already exists');
      // TODO raise
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    // TODO raise
  }
};

const verify = async (req, res) => {
  const id = await redisTools.getVerifyToken(req.body.token);
  if (!id) {
    res.send('token not exists');
    // TODO raise
  }
  const transaction = await model.sequelize.transaction();
  try {
    const dbUser = getUserByID(id, transaction);
    if (!dbUser) {
      res.send('user not exists');
      // TODO raise
    }
    const data = { is_verified: true };
    await dbUser.update(data);
    await redisTools.delVerifyToken(req.body.token);
    res.send(true);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    // TODO raise
  }
};

const resendVerify = async (req, res) => {
  const transaction = await model.sequelize.transaction();
  try {
    const dbUser = getUserByUsername(req.body.username, transaction);
    if (!dbUser) {
      res.send('user not exists');
      // TODO raise
    }
    await mailTools.sendVerifyMail(dbUser.id, dbUser.email, 'Tesla Trip 驗證信件',);
    res.send(true);
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    // TODO raise
  }
};

const requestResetPassword = async (req, res) => {

};

const resetPassword = (req, res) => {

};

const getProfile = (req, res) => {
  const user = authTools.decryptToken(req.headers.authorization);
  res.send(user);
};

const updateProfile = async (req, res) => {
  const user = authTools.decryptToken(req.headers.authorization);
  const transaction = await model.sequelize.transaction();
  try {
    const dbUser = getUserByUsername(user.username, transaction);
    const data = {};
    if (req.body.email) {
      data['email'] = req.body.email;
    }
    if (req.body.nickname) {
      data['nickname'] = req.body.nickname;
    }
    await dbUser.update(data);
    await transaction.commit();
    const result = {
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
    res.send(result);
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
