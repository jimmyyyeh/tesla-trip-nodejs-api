const express = require('express');
const validation = require('express-joi-validation');

const controller = require('../controllers/qrcode.controller');
const payloadSchema = require('../../config/payload-schema');

const router = express.Router();
const validator = validation.createValidator({});

router.get('/product/:token', controller.decodeProduct);

router.post('/product', validator.body(payloadSchema.encodeProduct), controller.encodeProduct);

module.exports = { router };
