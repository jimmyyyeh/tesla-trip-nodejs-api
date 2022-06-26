const express = require('express');

const router = express.Router();
const controller = require('../controllers/administrative-district.controller');
const { MiddlewareError } = require('../../utils/errors');

router.route('/')
  .get(controller.getAdministrativeDistrict)
  .all(
    MiddlewareError.methodNotAllow,
  );

module.exports = { router };
