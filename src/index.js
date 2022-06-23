const { app } = require('./config/express');
const { config } = require('./config/config');

if (!module.parent) {
  // 同 python if __name__ == '__main__':
  app.listen(config.port, () => {
    console.log('starting server');
  });
}

module.exports = { app };
