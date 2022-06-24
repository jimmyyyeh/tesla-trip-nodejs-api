const model = require('../server/models/models');
const authTools = require('./auth-tools');
const {
  Op,
  fn,
  col
} = require('sequelize');

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
  return await model.Car.create({
    user_id: userID,
    car_model_id: carModelID,
    manufacture_date: payload.manufacture_date,
    has_image: !!payload.file
  }, { transaction: transaction });
};

const deleteCar = async (userID, carID, tripIDs, transaction) => {
  await model.TripRate.destroy({
    where: { trip_id: { [Op.in]: tripIDs } },
    transaction: transaction
  });

  await model.Trip.destroy({
    where: { car_id: carID },
    transaction: transaction
  });
  const filter = [{ 'user_id': userID }, { 'id': carID }];
  await model.Car.destroy({
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

const createPointLog = async (userID, point, change, type, transaction) => {
  await model.PointLog.create({
    user_id: userID,
    point: point,
    change: change,
    type: type
  }, { transaction: transaction });
};

const getTrips = async (userID, isMyTrip, chargerID, start, end, model_, spec, page, perPage, transaction) => {
  const today = new Date();
  const tzOffSet = (new Date()).getTimezoneOffset() * 60 * 1000;
  let date = new Date(today.getTime() - 60 * 60 * 24 * 365 * 1000 - tzOffSet).toISOString();
  let tripFilter = [];
  let chargerFilter = [];
  let carModelFilter = [];

  tripFilter.push({ create_datetime: { [Op.gte]: date } });
  if (isMyTrip) {
    tripFilter.push({ user_id: userID });
  }
  if (start) {
    tripFilter.push({ start: { [Op.like]: `%${start}%` } });
  }
  if (end) {
    tripFilter.push({ end: { [Op.like]: `%${end}%` } });
  }
  if (chargerID) {
    chargerFilter.push({ id: chargerID });
  }
  if (model_) {
    carModelFilter.push({ model: { [Op.like]: `%${model_}%` } });
  }
  if (spec) {
    carModelFilter.push({ spec: { [Op.like]: `%${spec}%` } });
  }
  const tripRateCount = await model.TripRate.findAll({
    attributes: ['trip_id', [fn('COUNT', 'trip_id'), 'trip_rate_count'],],
    group: ['trip_id'],
  });

  const {
    count: tripCount,
    rows: trips
  } = await model.Trip.findAndCountAll({
    order: col('create_datetime'),
    include: [{
      model: model.SuperCharger,
      required: false,
      attributes: ['id', 'name'],
      where: chargerFilter,
    }, {
      model: model.Car,
      attributes: ['id', 'manufacture_date'],
      include: [{
        model: model.CarModel,
        attributes: ['id', 'model', 'spec'],
        where: carModelFilter
      },]
    }],
    where: { [Op.and]: tripFilter },
    limit: perPage,
    offset: (page - 1) * perPage,
    transaction: transaction
  });

  return {
    tripCount,
    trips,
    tripRateCount
  };
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
  createPointLog,
  getTrips,
};
