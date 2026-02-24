import app from './app.js';
import dotenv from 'dotenv';
import userRoutes from "./routes/users/user.routes.js";


dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
app.use("/api/usuarios", userRoutes);