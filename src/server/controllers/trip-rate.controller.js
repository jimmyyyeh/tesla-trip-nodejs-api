const authTools = require('../../utils/auth-tools');
const dbTools = require('../../utils/db-tools');
const model = require('../models/models');
const { col } = require('sequelize');
const toolkits = require('../../utils/toolkits');
const {
  ErrorHandler,
  InternalServerError,
  NotFoundError
} = require('../../utils/errors');
const { errorCodes } = require('../../config/error-codes');

const updateTripRate = async (request, response) => {
  const user = authTools.decryptToken(response, request.headers.authorization);
  const transaction = await model.sequelize.transaction();
  try {
    const trip = await dbTools.getTrip(user.id, request.body.trip_id, transaction);
    if (!trip) {
      ErrorHandler.error(new NotFoundError(response, 'trip not exist', errorCodes.DATA_NOT_FOUND));
    }
    const tripRater = await dbTools.getUserByID(user.id, transaction);
    const tripAuthor = await dbTools.getUserByID(trip.user_id, transaction);
    const tripRate = await dbTools.getTripRate(user.id, trip.id, transaction);
    if (!tripRate) {
      await dbTools.createTripRate(trip.id, tripRater.id, transaction);
      await tripRater.update({ point: tripRater.point + 1 }, { transaction: transaction });
      if (tripRater.id !== tripAuthor.id) {
        await tripAuthor.update({ point: tripAuthor.point + 1 }, { transaction: transaction });
      }
    } else {
      await dbTools.deleteTripRate(tripRate.id, transaction);
      const point = tripRater.point > 1 ? tripRater.point - 1 : 0;
      await tripRater.update({ point: point }, { transaction: transaction });
      if (tripRater.id !== tripAuthor.id) {
        const point = tripAuthor.point > 1 ? tripAuthor.point - 1 : 0;
        await tripAuthor.update({ point: point }, { transaction: transaction });
      }
    }
    response.send(toolkits.packageResponse(true, null));
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    ErrorHandler.error(new InternalServerError(response, 'internal server error', errorCodes.INTERNAL_SERVER_ERROR));
  }
};

module.exports = { updateTripRate };
