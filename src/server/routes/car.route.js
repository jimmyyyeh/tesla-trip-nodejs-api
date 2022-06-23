const express = require('express');
const validation = require('express-joi-validation');

const controller = require('../controllers/car.controller');
const payloadSchema = require('../../config/payload-schema');

const router = express.Router();
const validator = validation.createValidator({});

router.get('/car-model', controller.getCarModel);

router.get('/:carID?', controller.getCars);

router.post('/:carID', validator.body(payloadSchema.createCar), controller.createCar);

router.put('/:carID', validator.body(payloadSchema.updateCar), controller.updateCar);

router.delete('/:carID', controller.deleteCar);

router.get('/deduct-point/:carID', controller.getCarDeductPoint);

module.exports = { router };
