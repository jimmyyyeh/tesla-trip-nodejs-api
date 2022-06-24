const model = require('../server/models/models');
const authTools = require('./auth-tools');
const { Op } = require('sequelize');

const upsertUser = async (payload, transaction) => {
  return await model.User.findOrCreate({
    where: { [Op.or]: [{ username: payload.username }, { email: payload.email }] },
    defaults: {
      password: authTools.encryptPwd(payload.password),
      email: payload.email,
      birthday: payload.birthday,
      nickname: payload.nickname ?? payload.username,
      sex: payload.sex,
    },
    transaction: transaction
  });
};

const getUserByUsername = async (username, transaction) => {
  return await model.User.findOne({
    where: { username: username },
    transaction: transaction
  });
};

const getUserByID = async (id, transaction) => {
  return await model.User.findOne({
    where: { id: id },
    transaction: transaction
  });
};

const getUserByEmail = async (email, transaction) => {
  return await model.User.findOne({
    where: { email: email },
    transaction: transaction
  });
};

const getAdministrativeDistricts = async (transaction) => {
  return await model.AdministrativeDistrict.findAll({ transaction: transaction });
};

const getSuperChargers = async (transaction) => {
  return await model.SuperCharger.findAll({ transaction: transaction });
};

const getCars = async (userID, carID, transaction) => {
  model.Car.hasOne(model.CarModel, {
    foreignKey: 'id',
  });

  model.CarModel.belongsTo(model.Car);

  let filter = [{ 'user_id': userID }];
  if (carID) {
    filter.push({ 'id': carID });
  }
  return await model.Car.findAll({
    include: [{
      model: model.CarModel,
      attributes: ['id', 'model', 'spec']
    }],
    where: { [Op.and]: filter },
    transaction: transaction
  });
};

const getCar = async (userID, carID, transaction) => {
  const filter = [{ 'user_id': userID }, { 'id': carID }];
  return await model.Car.findOne({
    where: { [Op.and]: filter },
    transaction: transaction
  });
};

const createCar = async (userID, carModelID, payload, transaction) => {
  return await model.Car.create(
    {
      user_id: userID,
      car_model_id: carModelID,
      manufacture_date: payload.manufacture_date,
      has_image: !!payload.file
    },
    { transaction: transaction }
  );
};

const deleteCar = async (userID, carID, transaction) => {
  const filter = [{ 'user_id': userID }, { 'id': carID }];
  return await model.Car.destroy({
    where: { [Op.and]: filter },
    transaction: transaction
  });
};

const getCarModel = async (model_, spec, transaction) => {
  const filter = [{ 'model': model_ }, { 'spec': spec }];
  return await model.CarModel.findOne({
    where: { [Op.and]: filter },
    transaction: transaction
  });
};

const getCarModels = async (transaction) => {
  return await model.CarModel.findAll({ transaction: transaction });
};

const getUserTrips = async (carID, transaction) => {
  return await model.Trip.findAll({
    where: { car_id: carID },
    transaction: transaction
  });
};

const getTripRates = async (tripIDs, transaction) => {
  return await model.TripRate.findAll({
    where: { trip_id: { [Op.in]: tripIDs } },
    transaction: transaction
  });
};

module.exports = {
  upsertUser,
  getUserByUsername,
  getUserByID,
  getUserByEmail,
  getAdministrativeDistricts,
  getSuperChargers,
  getCars,
  getCar,
  createCar,
  deleteCar,
  getCarModel,
  getCarModels,
  getUserTrips,
  getTripRates,
};
