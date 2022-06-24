const fs = require('fs');

const dateToSeason = (date) => {
  const date_ = new Date(date);
  const year = date_.getFullYear();
  const month = date_.getMonth();
  const season = Math.trunc(month % 3.1 + 1);
  return `${year}Q${season}`;
};

const saveImage = (filename, string) => {
  const base64Data = string.replace(/^data:image\/(jpeg|jpg|png);base64,/, '');
  fs.mkdirSync('./src/static/image/car/', { recursive: true });
  fs.writeFile(`./src/static/image/car/${filename}.jpg`, base64Data, 'base64', (error) => {
    if (error) {
      // TODO raise
      console.log(error);
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
      results: {success: results},
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
