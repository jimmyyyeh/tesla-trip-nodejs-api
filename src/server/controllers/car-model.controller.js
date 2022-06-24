const authTools = require('../../utils/auth-tools');
const dbTools = require('../../utils/db-tools');
const model = require('../models/models');

const getCarModel = async (req, res) => {
  const user = authTools.decryptToken(req.headers.authorization);
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
    res.send(results);
  } catch (error) {
    // TODO raise
    console.log(error);
  }
};

module.exports = {
  getCarModels: getCarModel,
};
