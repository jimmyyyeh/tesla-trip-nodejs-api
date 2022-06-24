const dateToSeason = (date) => {
  const date_ = new Date(date);
  const year = date_.getFullYear();
  const month = date_.getMonth();
  const season = Math.trunc(month % 3.1 + 1);
  return `${year}Q${season}`;
};

module.exports = { dateToSeason };
