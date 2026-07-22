import app from './app.js';
import dotenv from 'dotenv';

import { initCron } from './config/cron.js';

dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  initCron();
});