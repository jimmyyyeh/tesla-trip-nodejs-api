import express from 'express';
import administrativeDistrict from './administrative-district.route';
import car from './car.route';
import charger from './charger.route';
import product from './product.route';
import qrcode from './qrcode.route';
import trip from './trip.route';
import tripRate from './trip-rate.route';
import user from './user.route';

const router = express.Router();

// 註冊router, 同fastapi app.include_router
router.use('/', user);
router.use('/administrative-district', administrativeDistrict);
router.use('/car', car);
router.use('/super-charger', charger);
router.use('/product', product);
router.use('/qrcode', qrcode);
router.use('/trip', trip);
router.use('/tripRate', tripRate);

export default router;
