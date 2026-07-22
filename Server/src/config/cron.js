import cron from 'node-cron';
import { pool } from './db.js';

export function initCron() {
  // Ping diario a las 07:30 AM — 
  cron.schedule('30 7 * * *', async () => {
    try {
      await pool.query('SELECT 1');
      console.log('[cron] Ping a Aiven exitoso');
    } catch (err) {
      console.error('[cron] Error en ping a la BD:', err.message);
    }
  }, {
    scheduled: true,
    timezone:  "America/Santiago",
  });

  console.log('[cron] Job de ping inicializado — corre a las 07:30 AM (Chile)');
}