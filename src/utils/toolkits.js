const fs = require('fs');
const {
  ErrorHandler,
  InternalServerError
} = require('./errors');
const { errorCodes } = require('../config/error-codes');

const dateToSeason = (date) => {
  const date_ = new Date(date);
  const year = date_.getFullYear();
  const month = date_.getMonth();
  const season = Math.trunc(month % 3.1 + 1);
  return `${year}Q${season}`;
};

const saveImage = (response, filename, string) => {
  const base64Data = string.replace(/^data:image\/(jpeg|jpg|png);base64,/, '');
  fs.mkdirSync('./src/static/image/car/', { recursive: true });
  fs.writeFile(`./src/static/image/car/${filename}.jpg`, base64Data, 'base64', (error) => {
    if (error) {
      ErrorHandler.error(new InternalServerError(response, 'internal server error', errorCodes.INTERNAL_SERVER_ERROR));
    }
  });
};

const makePager = (page, perPage, total) => {
  return {
    page: page,
    per_page: perPage,
    total: total,
    pages: Math.ceil(total / perPage),
  };
};

const packageResponse = (results, pager) => {
  if (typeof (results) === 'boolean') {
    return {
      results: { success: results },
      pager: pager,
    };
  } else {
    return {
      data: results,
      pager: pager,
    };
  }
};

module.exports = {
  saveImage,
  dateToSeason,
  makePager,
  packageResponse
};
