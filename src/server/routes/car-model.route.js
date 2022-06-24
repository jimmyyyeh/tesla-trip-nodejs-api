const express = require('express');

const controller = require('../controllers/car-model.controller');

const router = express.Router();

router.get('/', controller.getCarModels);

module.exports = { router };
