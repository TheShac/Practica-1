import express      from 'express';
import cors         from 'cors';
import cookieParser from 'cookie-parser';
import morgan       from 'morgan';
import dotenv       from 'dotenv';
import helmet       from 'helmet';
import session      from 'express-session';

import apiRouter from './routes/index.routes.js';
import { globalLimiter } from './middlewares/rateLimiter.js';
import passport from './modules/users/auth/google.strategy.js';

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

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 5 * 60 * 1000, // 5 min
  },
}));
app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV !== 'production') {
  const { bullBoardRouter } = await import('./modules/queue/bull-board.js');
  app.use('/admin/queues', bullBoardRouter);
}

// ── Único punto de entrada a la API ───────────────────────────────────────
app.use('/api', globalLimiter, apiRouter);

export default app;