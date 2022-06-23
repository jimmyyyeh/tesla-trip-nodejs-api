const express = require('express');
const validation = require('express-joi-validation');

const controller = require('../controllers/trip-rate.controller');
const payloadSchema = require('../../config/payload-schema');

const router = express.Router();
const validator = validation.createValidator({});

router.put('/', validator.body(payloadSchema.updateTripRate), controller.updateTripRate);

module.exports = { router };
