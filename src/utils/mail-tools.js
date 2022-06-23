const crypto = require('crypto');
const nodemailer = require('nodemailer');
const redisTools = require('../utils/redis-tools');
const { config } = require('../config/config');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: config.mailUsername,
    clientId: config.oauthClientID,
    clientSecret: config.oauthPassword,
    accessToken: config.oauthAccessToken,
    refreshToken: config.oauthRefreshToken,
  }
});

const sendMail = (receiver, subject, html) => {
  transporter.sendMail(
    {
      from: `Tesla Trip <${config.mailUsername}@gmail.com`,
      to: receiver,
      subject: subject,
      html: html,
    },
    function (error) {
      if (error) {
        console.log(error);
      }
    },
  );
};

const sendVerifyMail = async (id, receiver) => {
  const token = crypto.randomBytes(64)
    .toString('hex');
  await redisTools.setVerifyToken(id, token);
  const html = `
    <h1>歡迎註冊</h1>
    <body>
        <p>歡迎您註冊Tesla Trip，請點選以下連結以進行驗證:</p>
        <a href='${config.webDomain}/#/verify/${token}'>驗證連結</a>
    </body>`;
  sendMail(
    receiver,
    'Tesla Trip 驗證信件',
    html
  );
};

const sendResetPasswordMail = async (id, email) => {
  const token = crypto.randomBytes(64)
    .toString('hex');
  await redisTools.setResetPasswordToken(id, token);
  const html = `
        <h1>重設密碼</h1>
        <body>
            <p>親愛的Tesla Trip用戶您好，請點選以下連結以進行重置密碼:</p>
            <a href='${config.webDomain}/#/resetPassword/${token}'>重設密碼連結</a>
        </body>`;
  sendMail(
    email,
    'Tesla Trip 重置密碼信件',
    html
  );
};

module.exports = { sendVerifyMail , sendResetPasswordMail};
