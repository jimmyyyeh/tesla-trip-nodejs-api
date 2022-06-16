import express from 'express';
import index from '../server/routes/index.route';

const app = express();

// 註冊router, 同fastapi app.include_router
app.use('/index', index);

export default app;
