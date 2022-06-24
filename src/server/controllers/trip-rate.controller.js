const authTools = require('../../utils/auth-tools');
const dbTools = require('../../utils/db-tools');
const model = require('../models/models');
const { col } = require('sequelize');
const toolkits = require('../../utils/toolkits');

const updateTripRate = async (request, response) => {
  const user = authTools.decryptToken(request.headers.authorization);
  const transaction = await model.sequelize.transaction();
  try {
    const trip = await dbTools.getTrip(user.id, request.body.trip_id, transaction);
    if (!trip) {
      // TODO raise
      response.send('trip does not exist');
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
    console.log(error);
    // TODO raise
    await transaction.rollback();
  }
};

module.exports = { updateTripRate };
