const authTools = require('../../utils/auth-tools');
const dbTools = require('../../utils/db-tools');
const model = require('../models/models');

const getAdministrativeDistrict = async (request, response) => {
  const user = authTools.decryptToken(request.headers.authorization);
  const transaction = await model.sequelize.transaction();
  try {
    const administrativeDistricts = await dbTools.getAdministrativeDistrict(transaction);
    let results = {};
    for (const administrativeDistrict of administrativeDistricts) {
      const city = administrativeDistrict.city;
      if (!results[city]) {
        results[city] = [];
      }
      const result = {
        id: administrativeDistrict.id,
        area: administrativeDistrict.area,
      };
      results[city].push(result);
    }
    response.send(results);
  } catch (error) {
    // TODO raise
    console.log(error);
  }
};

module.exports = { getAdministrativeDistrict };
