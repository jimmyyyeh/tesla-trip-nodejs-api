const express = require('express');
const validation = require('express-joi-validation');

const controller = require('../controllers/user.controller');
const payloadSchema = require('../../config/payload-schema');

const router = express.Router();
const validator = validation.createValidator({});

router.post('/sign-in', validator.body(payloadSchema.signIn), controller.signIn);

router.post('/sign-up', validator.body(payloadSchema.signUp), controller.signUp);

router.post('/verify', validator.body(payloadSchema.verify), controller.verify);

router.post('/resend-verify', validator.body(payloadSchema.resendVerify), controller.resendVerify);

router.post('/request-reset-password', validator.body(payloadSchema.requestResetPassword), controller.requestResetPassword);

router.post('/reset-password', validator.body(payloadSchema.resetPassword), controller.resetPassword);

router.get('/profile', controller.getProfile);

router.put('/profile', validator.body(payloadSchema.updateProfile), controller.updateProfile);

module.exports = { router };
