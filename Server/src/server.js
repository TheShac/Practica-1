import app from './app.js';
import dotenv from 'dotenv';

import './modules/queue/email.worker.js';

dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));