import { pool } from "../../config/db.js";

const EMPTY = {
  prom_wos_claustro:      0,
  prom_wos_cuerpo:        0,
  prom_wos_acad_claustro: 0,
  prom_wos_acad_cuerpo:   0,
  prom_libros_claustro:   0,
  prom_libros_cuerpo:     0,
  prom_fondecyt_claustro: 0,
  prom_fondecyt_cuerpo:   0,
};

export async function getPromedios() {
  const [[row]] = await pool.query(
    `SELECT * FROM reporte_promedios WHERE id = 1`
  );
  return row ?? EMPTY;
}

export async function updatePromedios(data) {
  await pool.query(
    `UPDATE reporte_promedios SET
      prom_wos_claustro      = ?,
      prom_wos_cuerpo        = ?,
      prom_wos_acad_claustro = ?,
      prom_wos_acad_cuerpo   = ?,
      prom_libros_claustro   = ?,
      prom_libros_cuerpo     = ?,
      prom_fondecyt_claustro = ?,
      prom_fondecyt_cuerpo   = ?
     WHERE id = 1`,
    [
      data.prom_wos_claustro,
      data.prom_wos_cuerpo,
      data.prom_wos_acad_claustro,
      data.prom_wos_acad_cuerpo,
      data.prom_libros_claustro,
      data.prom_libros_cuerpo,
      data.prom_fondecyt_claustro,
      data.prom_fondecyt_cuerpo,
    ]
  );
}