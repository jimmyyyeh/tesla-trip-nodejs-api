import config from './config/config';
import app from './config/express';

if (!module.parent) {
  // 同 python if __name__ == '__main__':
  app.listen(config.port, () => {
    console.log('starting server');
  });
};

export default app;
