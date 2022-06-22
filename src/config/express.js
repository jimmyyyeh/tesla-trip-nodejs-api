const bodyParser = require('body-parser');
const express = require('express');

const index = require('../server/routes/index.route');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', index.router);

module.exports = {app};
