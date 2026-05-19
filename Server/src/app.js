import express      from 'express';
import cors         from 'cors';
import cookieParser from 'cookie-parser';
import morgan       from 'morgan';
import dotenv       from 'dotenv';

import apiRouter from './routes/index.routes.js';

dotenv.config();

const app = express();

app.use(morgan('dev'));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Único punto de entrada a la API ───────────────────────────────────────
app.use('/api', apiRouter);

export default app;