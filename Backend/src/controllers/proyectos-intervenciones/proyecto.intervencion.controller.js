import {
  listProyectosByUser,
  getProyectoById,
  createProyecto,
  updateProyecto,
  deleteProyecto,
} from "../../models/proyectos-intervencion/proyecto.intervencion.model.js";

function isOwner(row, usuario_id) {
  return row && Number(row.usuario_id) === Number(usuario_id);
}

// listar mis proyectos
export async function listMisProyectos(req, res) {
  try {
    const usuario_id = req.user.usuario_id;

    const rows = await listProyectosByUser(usuario_id);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error listando proyectos" });
  }
}

// crear proyecto
export async function createProyectoHandler(req, res) {
  try {
    const usuario_id = req.user.usuario_id;

    const {
      titulo,
      fuente_financiamiento,
      ano_adjudicacion,
      periodo_ejecucion,
      rol_proyecto,
      link_verificacion,
    } = req.body;

    if (!titulo) {
      return res
        .status(400)
        .json({ message: "El campo titulo es obligatorio" });
    }

    const newId = await createProyecto(usuario_id, {
      titulo,
      fuente_financiamiento,
      ano_adjudicacion,
      periodo_ejecucion,
      rol_proyecto,
      link_verificacion,
    });

    const created = await getProyectoById(newId);

    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creando proyecto" });
  }
}

// actualizar proyecto
export async function updateProyectoHandler(req, res) {
  try {
    const usuario_id = req.user.usuario_id;
    const { id } = req.params;

    const existing = await getProyectoById(id);

    if (!existing)
      return res.status(404).json({ message: "Proyecto no encontrado" });

    if (!isOwner(existing, usuario_id))
      return res.status(403).json({ message: "No autorizado" });

    if (!req.body.titulo)
      return res
        .status(400)
        .json({ message: "El campo titulo es obligatorio" });

    await updateProyecto(id, req.body);

    const updated = await getProyectoById(id);

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualizando proyecto" });
  }
}

// eliminar proyecto
export async function deleteProyectoHandler(req, res) {
  try {
    const usuario_id = req.user.usuario_id;
    const { id } = req.params;

    const existing = await getProyectoById(id);

    if (!existing)
      return res.status(404).json({ message: "Proyecto no encontrado" });

    if (!isOwner(existing, usuario_id))
      return res.status(403).json({ message: "No autorizado" });

    await deleteProyecto(id);

    res.json({ message: "Proyecto eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error eliminando proyecto" });
  }
}

// listar proyectos de un académico
export async function listProyectosDeAcademico(req, res) {
  try {
    const { usuarioId } = req.params;

    const rows = await listProyectosByUser(usuarioId);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error listando proyectos" });
  }
}

// crear proyecto para académico
export async function createProyectoParaAcademico(req, res) {
  try {
    const { usuarioId } = req.params;

    const {
      titulo,
      fuente_financiamiento,
      ano_adjudicacion,
      periodo_ejecucion,
      rol_proyecto,
      link_verificacion,
    } = req.body;

    if (!titulo)
      return res
        .status(400)
        .json({ message: "El campo titulo es obligatorio" });

    const newId = await createProyecto(usuarioId, {
      titulo,
      fuente_financiamiento,
      ano_adjudicacion,
      periodo_ejecucion,
      rol_proyecto,
      link_verificacion,
    });

    const created = await getProyectoById(newId);

    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creando proyecto" });
  }
}

// actualizar proyecto para académico
export async function updateProyectoParaAcademico(req, res) {
  try {
    const { id } = req.params;

    const existing = await getProyectoById(id);

    if (!existing)
      return res.status(404).json({ message: "Proyecto no encontrado" });

    if (!req.body.titulo)
      return res
        .status(400)
        .json({ message: "El campo titulo es obligatorio" });

    await updateProyecto(id, req.body);

    const updated = await getProyectoById(id);

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualizando proyecto" });
  }
}

// eliminar proyecto para académico
export async function deleteProyectoParaAcademico(req, res) {
  try {
    const { id } = req.params;

    const existing = await getProyectoById(id);

    if (!existing)
      return res.status(404).json({ message: "Proyecto no encontrado" });

    await deleteProyecto(id);

    res.json({ message: "Proyecto eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error eliminando proyecto" });
  }
}