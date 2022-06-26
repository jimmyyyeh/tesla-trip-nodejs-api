const express = require('express');

const controller = require('../controllers/car-model.controller');
const { MiddlewareError } = require('../../utils/errors');

const router = express.Router();

router.route('/')
  .get(controller.getCarModels)
  .all(
    MiddlewareError.methodNotAllow,
  );

module.exports = { router };
