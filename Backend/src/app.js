import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';

import authRoutes from "./routes/users/auth.routes.js";
import userRoutes from "./routes/users/user.routes.js";

import categoriaRoutes from "./routes/categorias/categoria.routes.js";
import publicacionRoutes from "./routes/publicaciones/publicacion.routes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

app.use(express.json({ }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/publicaciones", publicacionRoutes);

export default app;