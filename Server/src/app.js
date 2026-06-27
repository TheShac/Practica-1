import express      from 'express';
import cors         from 'cors';
import cookieParser from 'cookie-parser';
import morgan       from 'morgan';
import dotenv       from 'dotenv';
import helmet       from 'helmet';

import apiRouter from './routes/index.routes.js';
import { globalLimiter } from './middlewares/rateLimiter.js';

dotenv.config();

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(morgan('dev'));
//app.options("/{*path}", cors());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Único punto de entrada a la API ───────────────────────────────────────
app.use('/api', globalLimiter, apiRouter);

export default app;