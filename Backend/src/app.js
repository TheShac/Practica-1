import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from "./routes/users/auth.routes.js";
import userRoutes from "./routes/users/user.routes.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export default app;