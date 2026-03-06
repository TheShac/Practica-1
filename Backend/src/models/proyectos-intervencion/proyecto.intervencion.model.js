import { pool } from "../../config/db.js"
/* =========================
   LISTAR POR USUARIO
========================= */
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

/* =========================
   OBTENER POR ID
========================= */
export async function getProyectoById(id) {
  const [rows] = await pool.query(
    `SELECT *
     FROM proyectos_intervencion
     WHERE proyecto_id = ?`,
    [id]
  );

  return rows[0];
}

/* =========================
   CREAR
========================= */
export async function createProyecto(usuario_id, data) {
  const {
    titulo,
    fuente_financiamiento,
    ano_adjudicacion,
    periodo_ejecucion,
    rol_proyecto,
    link_verificacion,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO proyectos_intervencion
     (usuario_id, titulo, fuente_financiamiento, ano_adjudicacion, periodo_ejecucion, rol_proyecto, link_verificacion)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      usuario_id,
      titulo,
      fuente_financiamiento,
      ano_adjudicacion,
      periodo_ejecucion,
      rol_proyecto,
      link_verificacion,
    ]
  );

  return result.insertId;
}

/* =========================
   ACTUALIZAR
========================= */
export async function updateProyecto(id, data) {
  const {
    titulo,
    fuente_financiamiento,
    ano_adjudicacion,
    periodo_ejecucion,
    rol_proyecto,
    link_verificacion,
  } = data;

  await pool.query(
    `UPDATE proyectos_intervencion
     SET
       titulo = ?,
       fuente_financiamiento = ?,
       ano_adjudicacion = ?,
       periodo_ejecucion = ?,
       rol_proyecto = ?,
       link_verificacion = ?
     WHERE proyecto_id = ?`,
    [
      titulo,
      fuente_financiamiento,
      ano_adjudicacion,
      periodo_ejecucion,
      rol_proyecto,
      link_verificacion,
      id,
    ]
  );
}

/* =========================
   ELIMINAR
========================= */
export async function deleteProyecto(id) {
  await pool.query(
    `DELETE FROM proyectos_intervencion
     WHERE proyecto_id = ?`,
    [id]
  );
}