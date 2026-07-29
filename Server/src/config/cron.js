import cron from 'node-cron';
import { pool } from './db.js';

export function initCron() {
  cron.schedule('0 8,11,15,19 * * *', async () => {
    try {
      await pool.query('SELECT 1');
      
      const horaActual = new Date().toLocaleString('es-CL', { 
        timeZone: 'America/Santiago',
        hour12: false
      });
      
      console.log(`[cron] Ping a Aiven exitoso a las: ${horaActual}`);
      
    } catch (err) {
      console.error('[cron] Error en ping a la BD:', err.message);
    }
  }, {
    scheduled: true,
    timezone: "America/Santiago",
  });

  console.log('[cron] Job de ping inicializado — corre a las 08:00, 11:00, 15:00 y 19:00 (Chile)');
}