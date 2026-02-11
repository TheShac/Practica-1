import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cors());

export default app;