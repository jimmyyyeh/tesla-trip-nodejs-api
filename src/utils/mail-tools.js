const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {config} = require('../config/config');

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
        function(error) {
          if (error) {
            console.log(error);
          }
        },
      );
}

const sendVerifyMail = (reciver, subject) => {
    const token = crypto.randomBytes(64).toString('hex');
    // TODO redis
    html = `
    <h1>歡迎註冊</h1>
    <body>
        <p>歡迎您註冊Tesla Trip，請點選以下連結以進行驗證:</p>
        <a href='${config.web}/#/verify/${token}'>驗證連結</a>
    </body>
    `
    sendMail(
        reciver,
        subject,
        html
    )
}

module.exports = {sendVerifyMail};

