const express = require('express');
const validation = require('express-joi-validation');

const controller = require('../controllers/product.controller');
const payloadSchema = require('../../config/payload-schema');
const { MiddlewareError } = require('../../utils/errors');

const router = express.Router();
const validator = validation.createValidator({});

router.route('/:productID?')
  .get(controller.getProducts)
  .post(validator.body(payloadSchema.createProduct), controller.createProduct)
  .put(validator.body(payloadSchema.updateProduct), controller.updateProduct)
  .delete(controller.deleteProduct)
  .all(
    MiddlewareError.methodNotAllow,
  );

router.route('/redeem-product/:token')
  .post(controller.redeemProduct)
  .all(
    MiddlewareError.methodNotAllow,
  );

module.exports = { router };
