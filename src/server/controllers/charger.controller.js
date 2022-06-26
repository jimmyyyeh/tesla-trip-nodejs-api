const authTools = require('../../utils/auth-tools');
const model = require('../models/models');
const dbTools = require('../../utils/db-tools');
const toolkits = require('../../utils/toolkits');
const {
  ErrorHandler,
  InternalServerError
} = require('../../utils/errors');
const { errorCodes } = require('../../config/error-codes');

const getSuperCharger = async (request, response) => {
  const user = authTools.decryptToken(response, request.headers.authorization);
  const transaction = await model.sequelize.transaction();
  try {
    const superChargers = await dbTools.getSuperChargers(transaction);
    let results = [];
    for (const superCharger of superChargers) {
      const result = {
        id: superCharger.id,
        name: superCharger.name,
        city: superCharger.city,
        tpc: superCharger.tpc,
        ccs2: superCharger.ccs2,
        floor: superCharger.floor,
        business_hours: superCharger.business_hours,
        park_fee: superCharger.park_fee,
        charger_fee: superCharger.charger_fee,
        version: superCharger.version
      };
      results.push(result);
    }
    response.send(toolkits.packageResponse(results, null));
  } catch (error) {
    if (response.headersSent) {
      console.log(error);
    } else {
      ErrorHandler.error(new InternalServerError(response, 'internal server error', errorCodes.INTERNAL_SERVER_ERROR));
    }
  }
};

module.exports = { getSuperCharger };
