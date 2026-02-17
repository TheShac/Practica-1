import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';

import authRoutes from "./routes/users/auth.routes.js";
import userRoutes from "./routes/users/user.routes.js";

import tesisRoutes from "./routes/tesis/tesis.routes.js";
import categoriaRoutes from "./routes/categorias/categoria.routes.js";
import publicacionRoutes from "./routes/publicaciones/publicacion.routes.js";

import libroRoutes from "./routes/libros/libro.routes.js";
import capLibroRoutes from "./routes/libros/cap.libro.routes.js";
import investigacionRoutes from "./routes/investigacion/investigacion.routes.js";
import patenteRoutes from "./routes/patente/patente.routes.js";

import fichaRoutes from "./routes/ficha.routes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

app.use(express.json({ }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tesis", tesisRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/publicaciones", publicacionRoutes);
app.use("/api/libros", libroRoutes);
app.use("/api/cap-libro", capLibroRoutes);
app.use("/api/investigacion", investigacionRoutes);
app.use("/api/patente", patenteRoutes);

app.use("/api/ficha", fichaRoutes);

export default app;