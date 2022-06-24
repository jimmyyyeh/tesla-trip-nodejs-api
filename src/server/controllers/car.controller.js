const authTools = require('../../utils/auth-tools');
const dbTools = require('../../utils/db-tools');
const constant = require('../../config/constant');
const toolkits = require('../../utils/toolkits');
const model = require('../models/models');

const getCars = async (request, response) => {
  const user = authTools.decryptToken(request.headers.authorization);
  const transaction = await model.sequelize.transaction();
  const carID = request.params.carID;
  try {
    const cars = await dbTools.getCars(user.id, carID, transaction);
    let results = [];
    for (const car of cars) {
      const result = {
        id: car.id,
        car: `${car.car_model.model}-${car.car_model.spec}(${toolkits.dateToSeason(car.manufacture_date)})`,
        model: car.model,
        spec: car.spec,
        manufacture_date: car.manufacture_date,
        has_image: car.has_image
      };
      results.push(result);
    }
    response.send(results);
  } catch (error) {
    // TODO raise
    console.log(error);
  }
};

const createCar = async (request, response) => {
  const user = authTools.decryptToken(request.headers.authorization);
  const transaction = await model.sequelize.transaction();
  try {
    const carModel = await dbTools.getCarModel(request.body.model, request.body.spec, transaction);
    if (!carModel) {
      // TODO raise
    }
    const car = await dbTools.createCar(user.id, carModel.id, request.body, transaction);
    const result = {
      id: car.id,
      car: `${carModel.model}-${carModel.spec}(${toolkits.dateToSeason(car.manufacture_date)})`,
      model: car.model,
      spec: car.spec,
      manufacture_date: car.manufacture_date,
      has_image: car.has_image
    };
    if (car.has_image) {
      toolkits.saveImage(car.id, request.body.file);
    }
    await transaction.commit();
    response.send(result);
  } catch (error) {
    await transaction.rollback();
    // TODO raise
    console.log(error);
  }
};

const updateCar = async (request, response) => {
  const user = authTools.decryptToken(request.headers.authorization);
  const transaction = await model.sequelize.transaction();
  try {
    const carModel = await dbTools.getCarModel(request.body.model, request.body.spec, transaction);
    if (!carModel) {
      // TODO raise
      response.send('car model is not exists');
    }
    const car = await dbTools.getCar(user.id, carModel.id, transaction);
    if (!car) {
      // TODO raise
      response.send('car is not exists');
    }
    const data = {
      car_model_id: carModel.id,
      manufacture_date: request.body.manufacture_date,
    };
    await car.update(data, { transaction: transaction });
    const result = {
      id: car.id,
      car: `${carModel.model}-${carModel.spec}(${toolkits.dateToSeason(car.manufacture_date)})`,
      model: car.model,
      spec: car.spec,
      manufacture_date: car.manufacture_date,
      has_image: car.has_image
    };
    await transaction.commit();
    response.send(result);
  } catch (error) {
    await transaction.rollback();
    // TODO raise
    console.log(error);
  }
};

const deductUserPoint = async (userID, point, transaction) => {
  const dbUser = await dbTools.getUserByID(userID, transaction);
  let deductPoint = dbUser.point;
  if (dbUser.point < point) {
    await dbUser.update({ point: 0 }, { transaction: transaction });
  } else {
    await dbUser.update({ point: deductPoint - point }, { transaction: transaction });
    deductPoint = deductPoint - point;
  }
  await dbTools.createPointLog(
    userID, point, deductPoint, constant.pointLogType.DELETE_CAR
  );
};

const deleteCar = async (request, response) => {
  const user = authTools.decryptToken(request.headers.authorization);
  const transaction = await model.sequelize.transaction();
  const carID = request.params.carID;
  try {
    const {
      trips,
      tripRates,
      tripIDs
    } = await getDeductPointInfo(user.id, carID, transaction);
    const point = trips.length + tripRates.length * 2;
    await dbTools.deleteCar(user.id, carID, tripIDs, transaction);
    await deductUserPoint(user.id, point, transaction);
    await transaction.commit();
    response.send(true);
  } catch (error) {
    await transaction.rollback();
    // TODO raise
    console.log(error);
  }
};

const getDeductPointInfo = async (userID, carID, transaction) => {
  const trips = await dbTools.getUserTrips(carID, transaction);
  let tripIDs = [];
  for (let trip of trips) {
    tripIDs.push(trip.id);
  }
  const tripRates = await dbTools.getTripRates(tripIDs, transaction);
  return {
    trips,
    tripRates,
    tripIDs
  };
};

const getCarDeductPoint = async (request, response) => {
  const user = authTools.decryptToken(request.headers.authorization);
  const transaction = await model.sequelize.transaction();
  const carID = request.params.carID;
  try {
    const {
      trips,
      tripRates
    } = await getDeductPointInfo(user.id, carID, transaction);
    const point = trips.length + tripRates.length * 2;
    response.send({ 'total': point });
  } catch (error) {
    // TODO raise
    console.log(error);
  }

};

module.exports = {
  getCars,
  createCar,
  updateCar,
  deleteCar,
  getCarDeductPoint
};
