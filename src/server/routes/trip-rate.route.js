const express = require('express');
const validation = require('express-joi-validation');

const controller = require('../controllers/trip-rate.controller');
const payloadSchema = require('../../config/payload-schema');
const { MiddlewareError } = require('../../utils/errors');

const router = express.Router();
const validator = validation.createValidator({});

router.route('/')
  .put(validator.body(payloadSchema.updateTripRate), controller.updateTripRate)
  .all(
    MiddlewareError.methodNotAllow,
  );

module.exports = { router };
