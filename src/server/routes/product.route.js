const express = require('express');
const validation = require('express-joi-validation');

const controller = require('../controllers/product.controller');
const payloadSchema = require('../../config/payload-schema');

const router = express.Router();
const validator = validation.createValidator({});

router.get('/:productID?', controller.getProducts);

router.post('/:productID', validator.body(payloadSchema.createProduct), controller.createProduct);

router.put('/:productID', validator.body(payloadSchema.updateProduct), controller.updateProduct);

router.delete('/:productID', controller.deleteProduct);

router.post('/redeem-product/:token', controller.redeemProduct);

module.exports = { router };
