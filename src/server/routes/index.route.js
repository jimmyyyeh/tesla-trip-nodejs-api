const express = require('express');
const user = require('./user.route');
const administrativeDistrict = require('./administrative-district.route');
const car = require( './car.route');
const charger = require('./charger.route');
const product = require('./product.route');
const qrcode = require('./qrcode.route');
const trip = require('./trip.route');
const tripRate = require( './trip-rate.route');

const router = express.Router();

// 註冊router, 同fastapi app.include_router
router.use('/', user.router);
router.use('/administrative-district', administrativeDistrict.router);
router.use('/car', car.router);
router.use('/super-charger', charger.router);
router.use('/product', product.router);
router.use('/qrcode', qrcode.router);
router.use('/trip', trip.router);
router.use('/tripRate', tripRate.router);

module.exports = {router};
