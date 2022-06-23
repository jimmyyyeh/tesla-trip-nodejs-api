const express = require('express');
const validation = require('express-joi-validation');

const controller = require('../controllers/trip.controller');
const payloadSchema = require('../../config/payload-schema');

const router = express.Router();
const validator = validation.createValidator({});

router.get('/', controller.getTrips);

router.post('/', validator.body(payloadSchema.createTrip), controller.createTrip);

module.exports = { router };
