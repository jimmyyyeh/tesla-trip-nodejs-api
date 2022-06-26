const express = require('express');
const validation = require('express-joi-validation');

const controller = require('../controllers/trip.controller');
const payloadSchema = require('../../config/payload-schema');
const { MiddlewareError } = require('../../utils/errors');

const router = express.Router();
const validator = validation.createValidator({});

router.route('/')
  .get(
    controller.getTrips
  )
  .post(validator.body(payloadSchema.createTrip), controller.createTrip)
  .all(
    MiddlewareError.methodNotAllow,
  );

module.exports = { router };
