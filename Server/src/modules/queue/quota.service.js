import { pool } from "#src/config/db.js";

const LIMITE_DIARIO = 100;
const LIMITE_MENSUAL = 3000;

export async function obtenerCuotaActual() {
  const [rowsHoy] = await pool.query(
    `SELECT COUNT(*) AS total FROM email_logs
     WHERE estado = 'enviado' AND DATE(creado_en) = CURDATE()`
  );
  const [rowsMes] = await pool.query(
    `SELECT COUNT(*) AS total FROM email_logs
     WHERE estado = 'enviado'
       AND YEAR(creado_en) = YEAR(CURDATE())
       AND MONTH(creado_en) = MONTH(CURDATE())`
  );

  return {
    diario: { usados: rowsHoy[0].total, limite: LIMITE_DIARIO },
    mensual: { usados: rowsMes[0].total, limite: LIMITE_MENSUAL },
  };
}

export async function haySpaceParaEnviar() {
  const { diario, mensual } = await obtenerCuotaActual();
  return diario.usados < diario.limite && mensual.usados < mensual.limite;
}