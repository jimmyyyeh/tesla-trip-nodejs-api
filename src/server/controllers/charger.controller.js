const authTools = require('../../utils/auth-tools');
const model = require('../models/models');
const dbTools = require('../../utils/db-tools');

const getSuperCharger = async (request, response) => {
  const user = authTools.decryptToken(request.headers.authorization);
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
    response.send(results);
  } catch (error) {
    // TODO raise
    console.log(error);
  }
};

module.exports = { getSuperCharger };
