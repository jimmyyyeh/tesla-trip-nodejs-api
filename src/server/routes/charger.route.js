const express = require('express');

const controller = require('../controllers/charger.controller')
const router = express.Router();

router.get('/', controller.getSuperCharger);

module.exports = {router};
