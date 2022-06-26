const express = require('express');
const validation = require('express-joi-validation');

const controller = require('../controllers/qrcode.controller');
const payloadSchema = require('../../config/payload-schema');
const { MiddlewareError } = require('../../utils/errors');

const router = express.Router();
const validator = validation.createValidator({});

router.route('/product/:token')
  .get(controller.decodeProduct)
  .all(
    MiddlewareError.methodNotAllow,
  );

router.route('/product')
  .post(validator.body(payloadSchema.encodeProduct), controller.encodeProduct)
  .all(
    MiddlewareError.methodNotAllow,
  );

module.exports = { router };
