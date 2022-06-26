const authTools = require('../../utils/auth-tools');
const dbTools = require('../../utils/db-tools');
const model = require('../models/models');
const toolkits = require('../../utils/toolkits');
const {
  ErrorHandler,
  InternalServerError
} = require('../../utils/errors');
const { errorCodes } = require('../../config/error-codes');

const getTrips = async (request, response) => {
  const query = request.query;
  const isMyTrip = query.is_my_trip;
  const chargerID = query.charger;
  const start = query.start;
  const end = query.end;
  const model_ = query.model;
  const spec = query.spec;
  const page = query.page ? parseInt(query.page) : 1;
  const perPage = query.per_page ? parseInt(query.per_page) : 10;

  const user = authTools.decryptToken(response, request.headers.authorization);
  const transaction = await model.sequelize.transaction();
  try {
    const {
      tripCount,
      trips,
      tripRateCount
    } = await dbTools.getTrips(user.id, isMyTrip, chargerID, start, end, model_, spec, page, perPage, transaction);

    let rateCountObj = {};
    for (const count of tripRateCount) {
      rateCountObj[count.trip_id] = count.trip_rate_count;
    }
    let results = [];
    for (const trip of trips) {
      const rateCount = rateCountObj[trip.id];
      const result = {
        id: trip.id,
        mileage: trip.mileage,
        consumption: trip.consumption,
        total: trip.total,
        start: trip.start,
        end: trip.end,
        start_battery_level: trip.start_battery_level,
        end_battery_level: trip.end_battery_level,
        is_charge: trip.is_charge,
        charge: trip.charge,
        fee: trip.fee,
        trip_date: trip.trip_date,
        car: `${trip.car.car_model.model}-${trip.car.car_model.spec}(${toolkits.dateToSeason(trip.car.manufacture_date)})`,
        charger: trip.super_charger ? trip.super_charger.name : null,
        trip_rate_count: rateCount,
        is_rate: !!rateCount
      };
      results.push(result);
    }
    const pager = toolkits.makePager(page, perPage, tripCount);
    response.send(toolkits.packageResponse(results, pager));
  } catch (error) {
    if (response.headersSent) {
      console.log(error);
    } else {
      ErrorHandler.error(new InternalServerError(response, 'internal server error', errorCodes.INTERNAL_SERVER_ERROR));
    }
  }
};

const createTrip = async (request, response) => {
  const user = authTools.decryptToken(response, request.headers.authorization);
  const transaction = await model.sequelize.transaction();
  try {
    await dbTools.createTrips(user.id, request.body, transaction);
    await transaction.commit();
    response.send(toolkits.packageResponse(true, null));
  } catch (error) {
    await transaction.rollback();
    ErrorHandler.error(new InternalServerError(response, 'internal server error', errorCodes.INTERNAL_SERVER_ERROR));
  }
};

module.exports = {
  getTrips,
  createTrip
};
