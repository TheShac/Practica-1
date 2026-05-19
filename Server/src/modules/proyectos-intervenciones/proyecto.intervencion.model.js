import { pool } from '../../config/db.js';

export async function listProyectosByUser(usuario_id) {
  const [rows] = await pool.query(
    `SELECT *
     FROM proyectos_intervencion
     WHERE usuario_id = ?
     ORDER BY ano_adjudicacion DESC`,
    [usuario_id]
  );
  return rows;
}

export async function getProyectoById(proyecto_id) {
  const [rows] = await pool.query(
    `SELECT * FROM proyectos_intervencion WHERE proyecto_id = ? LIMIT 1`,
    [proyecto_id]
  );
  return rows[0] || null;
}

export async function createProyecto(usuario_id, data) {
  const {
    titulo, fuente_financiamiento, ano_adjudicacion,
    periodo_ejecucion, rol_proyecto, link_verificacion,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO proyectos_intervencion
       (usuario_id, titulo, fuente_financiamiento, ano_adjudicacion,
        periodo_ejecucion, rol_proyecto, link_verificacion)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      usuario_id, titulo,
      fuente_financiamiento || null,
      ano_adjudicacion      || null,
      periodo_ejecucion     || null,
      rol_proyecto          || null,
      link_verificacion     || null,
    ]
  );
  return result.insertId;
}

export async function updateProyecto(proyecto_id, data) {
  const {
    titulo, fuente_financiamiento, ano_adjudicacion,
    periodo_ejecucion, rol_proyecto, link_verificacion,
  } = data;

  await pool.query(
    `UPDATE proyectos_intervencion
     SET titulo                = ?,
         fuente_financiamiento = ?,
         ano_adjudicacion      = ?,
         periodo_ejecucion     = ?,
         rol_proyecto          = ?,
         link_verificacion     = ?
     WHERE proyecto_id = ?`,
    [
      titulo,
      fuente_financiamiento || null,
      ano_adjudicacion      || null,
      periodo_ejecucion     || null,
      rol_proyecto          || null,
      link_verificacion     || null,
      proyecto_id,
    ]
  );
}

export async function deleteProyecto(proyecto_id) {
  await pool.query(
    `DELETE FROM proyectos_intervencion WHERE proyecto_id = ?`,
    [proyecto_id]
  );
}