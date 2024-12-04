import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import { initializeFirebaseApp } from './db/db.js';
import { ERROR_CODES, MESSAGE } from './global/global.vars.js';
import commonRoutes from './routes/common.routes.js';
initializeFirebaseApp();

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: '100mb', extended: true }));

app.set('PORT', process.argv[3] || process.env.PORT);
app.use('/api', commonRoutes);

app.all('*', (req, res) => {
  res.status(400).json({ status: 400, message: MESSAGE['400'], errorCode: ERROR_CODES.BAD_REQUEST });
});
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

export { app };
