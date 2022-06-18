import express from 'express';
import index from '../server/routes/index.route';

const app = express();

app.use('/', index);

export default app;
