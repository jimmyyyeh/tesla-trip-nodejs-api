const authTools = require('../../utils/auth-tools');
const dbTools = require('../../utils/db-tools');
const toolkits = require('../../utils/toolkits');
const model = require('../models/models');


const getCarModel = (req, res) => {

};

const getCars = async (req, res) => {
  const user = authTools.decryptToken(req.headers.authorization);
  const transaction = await model.sequelize.transaction();
  const carID = req.params.carID;
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
      }
      results.push(result);
    }
    res.send(results);
  } catch (error) {
    // TODO raise
    console.log(error);
  }
};

const createCar = (req, res) => {

};

const updateCar = (req, res) => {

};

const deleteCar = (req, res) => {

};

const getCarDeductPoint = (req, res) => {

};

module.exports = {
  getCarModel,
  getCars,
  createCar,
  updateCar,
  deleteCar,
  getCarDeductPoint
};
