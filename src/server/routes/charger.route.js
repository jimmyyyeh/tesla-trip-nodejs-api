const express = require('express');

const controller = require('../controllers/charger.controller');
const { MiddlewareError } = require('../../utils/errors');
const router = express.Router();

router.route('/')
  .get(controller.getSuperCharger)
  .all(
    MiddlewareError.methodNotAllow,
  );

module.exports = { router };
