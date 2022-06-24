const Joi = require('joi');

const signIn = Joi.object({
  username: Joi.string()
    .required(),
  password: Joi.string()
    .required(),
});

const signUp = Joi.object({
  username: Joi.string()
    .required(),
  password: Joi.string()
    .required(),
  nickname: Joi.string(),
  email: Joi.string()
    .email()
    .required(),
  birthday: Joi.string()
    .regex(/^\d{4}\-\d{2}\-\d{2}$/)
    .required(),
  sex: Joi.number()
    .valid(1, 2),
});

const verify = Joi.object({
  token: Joi.string()
    .required(),
});

const resendVerify = Joi.object({
  username: Joi.string()
    .required(),
});

const requestResetPassword = Joi.object({
  email: Joi.string()
    .email()
    .required(),
});

const resetPassword = Joi.object({
  username: Joi.string()
    .required(),
  password: Joi.string()
    .required(),
  token: Joi.string()
    .required(),
});

const updateProfile = Joi.object({
  nickname: Joi.string(),
  email: Joi.string()
    .email(),
});

const createCar = Joi.object({
  model: Joi.string()
    .required(),
  spec: Joi.string()
    .required(),
  manufacture_date: Joi.string()
    .regex(/^\d{4}\-\d{2}\-\d{2}$/)
    .required(),
  file: Joi.string(),
});

const updateCar = Joi.object({
  model: Joi.string()
    .required(),
  spec: Joi.string()
    .required(),
  manufacture_date: Joi.string()
    .regex(/^\d{4}\-\d{2}\-\d{2}$/)
    .required(),
});

const createTrip = Joi.array()
  .items(Joi.object({
    car_id: Joi.number()
      .required(),
    mileage: Joi.number()
      .required(),
    consumption: Joi.number()
      .required(),
    total: Joi.number()
      .required(),
    start: Joi.string()
      .required(),
    end: Joi.string()
      .required(),
    start_battery_level: Joi.number()
      .required(),
    end_battery_level: Joi.number()
      .required(),
    is_charge: Joi.boolean()
      .required(),
    charger_id: Joi.number(),
    charge: Joi.number(),
    fee: Joi.number(),
    trip_date: Joi.string()
      .regex(/^\d{4}\-\d{2}\-\d{2}$/)
      .required(),
  }));

const updateTripRate = Joi.object({
  trip_id: Joi.number()
    .required(),
});

const encodeProduct = Joi.object({
  product_id: Joi.number()
    .required(),
});

const createProduct = Joi.object({
  name: Joi.string(),
  stock: Joi.number(),
  point: Joi.number(),
  is_launched: Joi.boolean(),
});

const updateProduct = Joi.object({
  name: Joi.string(),
  stock: Joi.string(),
  point: Joi.number(),
  is_launched: Joi.boolean(),
});

module.exports = {
  signIn,
  signUp,
  verify,
  resendVerify,
  requestResetPassword,
  resetPassword,
  updateProfile,
  createCar,
  updateCar,
  createTrip,
  updateTripRate,
  encodeProduct,
  createProduct,
  updateProduct
};
