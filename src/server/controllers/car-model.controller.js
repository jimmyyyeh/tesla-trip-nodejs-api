const authTools = require('../../utils/auth-tools');
const dbTools = require('../../utils/db-tools');
const model = require('../models/models');
const toolkits = require('../../utils/toolkits');
const {
  ErrorHandler,
  InternalServerError
} = require('../../utils/errors');
const { errorCodes } = require('../../config/error-codes');

const getCarModel = async (request, response) => {
  const user = authTools.decryptToken(response, request.headers.authorization);
  const transaction = await model.sequelize.transaction();
  try {
    const carModels = await dbTools.getCarModels(transaction);
    let results = [];
    for (const carModel of carModels) {
      const result = {
        id: carModel.id,
        model: carModel.model,
        spec: carModel.spec,
      };
      results.push(result);
    }
    response.send(toolkits.packageResponse(results, null));
  } catch (error) {
    if (response.headersSent) {
      console.log(error);
    } else {
      ErrorHandler(new InternalServerError(response, 'internal server error', errorCodes.INTERNAL_SERVER_ERROR)); 
    }
  }
};

module.exports = {
  getCarModels: getCarModel,
};
