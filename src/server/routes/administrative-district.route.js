const express = require('express');

const router = express.Router();
const controller = require('../controllers/administrative-district.controller');

router.get('/', controller.getAdministrativeDistrict);

module.exports = { router };
