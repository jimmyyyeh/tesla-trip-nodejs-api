const express = require('express');
const validation = require('express-joi-validation');

const controller = require('../controllers/user.controller');
const payloadSchema = require('../../config/payload-schema');
const {
  MiddlewareError
} = require('../../utils/errors');

const router = express.Router();
const validator = validation.createValidator({});

router.route('/sign-in')
  .post(validator.body(payloadSchema.signIn), controller.signIn)
  .all(
    MiddlewareError.methodNotAllow,
  );

router.route('/sign-up')
  .post(validator.body(payloadSchema.signUp), controller.signUp)
  .all(
    MiddlewareError.methodNotAllow,
  );

router.route('/verify')
  .post(validator.body(payloadSchema.verify), controller.verify)
  .all(
    MiddlewareError.methodNotAllow,
  );

router.route('/resend-verify')
  .post(validator.body(payloadSchema.resendVerify), controller.resendVerify)
  .all(
    MiddlewareError.methodNotAllow,
  );

router.route('/request-reset-password')
  .post(validator.body(payloadSchema.requestResetPassword), controller.requestResetPassword)
  .all(
    MiddlewareError.methodNotAllow,
  );

router.route('/reset-password')
  .post(validator.body(payloadSchema.resetPassword), controller.resetPassword)
  .all(
    MiddlewareError.methodNotAllow,
  );

router.route('/profile')
  .get(
    controller.getProfile
  )
  .put(
    validator.body(payloadSchema.updateProfile), controller.updateProfile
  )
  .all(
    MiddlewareError.methodNotAllow,
  );

module.exports = { router };
