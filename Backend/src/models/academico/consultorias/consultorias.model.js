import { pool } from "../../../config/db.js";

export async function getConsultoriasByUsuario(usuario_id) {
  const [rows] = await pool.query(
    `SELECT * FROM consultorias WHERE usuario_id = ? ORDER BY ano_adjudicacion DESC`,
    [usuario_id]
  );
  return rows;
}

export async function getConsultoriaById(consultoria_id) {
  const [[row]] = await pool.query(
    `SELECT * FROM consultorias WHERE consultoria_id = ?`,
    [consultoria_id]
  );
  return row;
}

export async function createConsultoria(usuario_id, data) {
  const {
    titulo,
    institucion_contratante,
    ano_adjudicacion,
    periodo_ejecucion,
    objetivo,
    link_verificacion,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO consultorias
       (usuario_id, titulo, institucion_contratante, ano_adjudicacion, periodo_ejecucion, objetivo, link_verificacion)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [usuario_id, titulo, institucion_contratante, ano_adjudicacion, periodo_ejecucion, objetivo, link_verificacion]
  );
  return result.insertId;
}

export async function updateConsultoria(consultoria_id, data) {
  const {
    titulo,
    institucion_contratante,
    ano_adjudicacion,
    periodo_ejecucion,
    objetivo,
    link_verificacion,
  } = data;

  await pool.query(
    `UPDATE consultorias
     SET titulo = ?, institucion_contratante = ?, ano_adjudicacion = ?,
         periodo_ejecucion = ?, objetivo = ?, link_verificacion = ?
     WHERE consultoria_id = ?`,
    [titulo, institucion_contratante, ano_adjudicacion, periodo_ejecucion, objetivo, link_verificacion, consultoria_id]
  );
}

export async function deleteConsultoria(consultoria_id) {
  await pool.query(
    `DELETE FROM consultorias WHERE consultoria_id = ?`,
    [consultoria_id]
  );
}