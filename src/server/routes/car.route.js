const express = require('express');
const validation = require('express-joi-validation');

const controller = require('../controllers/car.controller');
const payloadSchema = require('../../config/payload-schema');

const router = express.Router();
const validator = validation.createValidator({});

router.route('/:carID?')
  .get(controller.getCars)
  .post(validator.body(payloadSchema.createCar), controller.createCar)
  .put(validator.body(payloadSchema.updateCar), controller.updateCar)
  .delete(controller.deleteCar);

router.get('/deduct-point/:carID', controller.getCarDeductPoint);

module.exports = { router };
