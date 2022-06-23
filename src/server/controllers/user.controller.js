const authTools = require('../../utils/auth-tools');
const mailTools = require('../../utils/mail-tools');
const model = require('../models/models');

const signIn = async (req, res) => {
  const transaction = await model.sequelize.transaction();
  try {
    const dbUser = await model.User.findOne({
      where: { username: req.body.username },
      transaction: transaction
    });
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
    await transaction.commit();
    const token = authTools.generateToken(result);
    result['access_token'] = token;
    result['token_type'] = 'bearer';
    res.send(result);
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    // TODO raise
  }
};

const signUp = async (req, res) => {
  const transaction = await model.sequelize.transaction();
  try {
    const [dbUser, created] = await model.User.findOrCreate({
      where: { username: req.body.username },
      defaults: {
        password: authTools.encryptPwd(req.body.password),
        email: req.body.email,
        birthday: req.body.birthday,
        nickname: req.body.nickname ?? req.body.username,
        sex: req.body.sex,
      },
      transaction: transaction
    });
    await transaction.commit();
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
      mailTools.sendVerifyMail(
        req.body.email,
        'Tesla Trip 驗證信件'
        ,);
    } else {
      res.send('user already exists');
      // TODO raise
    }
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    // TODO raise
  }
};

const verify = (req, res) => {

};

const resendVerify = (req, res) => {

};

const requestResetPassword = (req, res) => {

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
    const dbUser = await model.User.findOne({
      where: { username: user.username }
    });
    const data = {};
    if (req.body.email) {
      data['email'] = req.body.email;
    }
    if (req.body.nickname) {
      data['nickname'] = req.body.nickname;
    }
    dbUser.update(data);
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
