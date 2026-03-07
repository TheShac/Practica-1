
import {
  getConsultoriasByUsuario,
  getConsultoriaById,
  createConsultoria,
  updateConsultoria,
  deleteConsultoria,
} from "../../../models/academico/consultorias/consultorias.model.js";

// Académico 

export async function getMisConsultorias(req, res) {
  try {
    const usuario_id = req.user.id || req.user.usuario_id;
    if (!usuario_id)
      return res.status(401).json({ message: "Usuario no válido en token" });

    const data = await getConsultoriasByUsuario(usuario_id);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo consultorías" });
  }
}

export async function createConsultoriaHandler(req, res) {
  try {
    const usuario_id = req.user.id || req.user.usuario_id;
    if (!usuario_id)
      return res.status(401).json({ message: "Usuario no válido en token" });

    if (!req.body.titulo)
      return res.status(400).json({ message: "Título obligatorio" });

    const newId = await createConsultoria(usuario_id, req.body);
    const created = await getConsultoriaById(newId);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creando consultoría" });
  }
}

export async function updateConsultoriaHandler(req, res) {
  try {
    const { id } = req.params;
    const existing = await getConsultoriaById(id);
    if (!existing)
      return res.status(404).json({ message: "Consultoría no encontrada" });

    await updateConsultoria(id, req.body);
    const updated = await getConsultoriaById(id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualizando consultoría" });
  }
}

export async function deleteConsultoriaHandler(req, res) {
  try {
    const { id } = req.params;
    const existing = await getConsultoriaById(id);
    if (!existing)
      return res.status(404).json({ message: "Consultoría no encontrada" });

    await deleteConsultoria(id);
    res.json({ message: "Consultoría eliminada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error eliminando consultoría" });
  }
}

// Secretaria 

export async function listConsultoriasDeAcademico(req, res) {
  try {
    const { usuarioId } = req.params;
    const data = await getConsultoriasByUsuario(usuarioId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo consultorías" });
  }
}

export async function createConsultoriaParaAcademico(req, res) {
  try {
    const { usuarioId } = req.params;
    if (!req.body.titulo)
      return res.status(400).json({ message: "Título obligatorio" });

    const newId = await createConsultoria(usuarioId, req.body);
    const created = await getConsultoriaById(newId);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creando consultoría" });
  }
}

export async function updateConsultoriaParaAcademico(req, res) {
  try {
    const { id } = req.params;
    const existing = await getConsultoriaById(id);
    if (!existing)
      return res.status(404).json({ message: "Consultoría no encontrada" });

    await updateConsultoria(id, req.body);
    const updated = await getConsultoriaById(id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualizando consultoría" });
  }
}

export async function deleteConsultoriaParaAcademico(req, res) {
  try {
    const { id } = req.params;
    const existing = await getConsultoriaById(id);
    if (!existing)
      return res.status(404).json({ message: "Consultoría no encontrada" });

    await deleteConsultoria(id);
    res.json({ message: "Consultoría eliminada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error eliminando consultoría" });
  }
}