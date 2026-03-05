import {
  getInvestigacionesByUsuario,
  createInvestigacion,
  updateInvestigacion,
  deleteInvestigacion,
} from "../../models/investigacion/investigacion.model.js";

export async function getMisInvestigaciones(req, res) {
  try {
    const usuario_id = req.user.id || req.user.usuario_id;

    if (!usuario_id) {
      return res.status(401).json({ message: "Usuario no válido en token" });
    }

    const data = await getInvestigacionesByUsuario(usuario_id);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo investigaciones" });
  }
}

export async function createInvestigacionHandler(req, res) {
  try {
    const usuario_id = req.user.id || req.user.usuario_id;

    if (!usuario_id) {
      return res.status(401).json({ message: "Usuario no válido en token" });
    }

    const {
      titulo,
      fuente_financiamiento,
      ano_adjudicacion,
      periodo_ejecucion,
      rol_proyecto,
      link_verificacion,
    } = req.body;

    if (!titulo) {
      return res.status(400).json({ message: "Título obligatorio" });
    }

    const newId = await createInvestigacion({
      usuario_id,
      titulo,
      fuente_financiamiento,
      ano_adjudicacion,
      periodo_ejecucion,
      rol_proyecto,
      link_verificacion,
    });

    res.status(201).json({ investigacion_id: newId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creando investigación" });
  }
}

export async function updateInvestigacionHandler(req, res) {
  try {
    const { id } = req.params;
    await updateInvestigacion(id, req.body);
    res.json({ message: "Investigación actualizada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualizando investigación" });
  }
}

export async function deleteInvestigacionHandler(req, res) {
  try {
    const { id } = req.params;
    await deleteInvestigacion(id);
    res.json({ message: "Investigación eliminada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error eliminando investigación" });
  }
}

export async function listInvestigacionesDeAcademico(req, res) {
  try {
    const { usuarioId } = req.params;
    const data = await getInvestigacionesByUsuario(usuarioId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo investigaciones" });
  }
}

export async function createInvestigacionParaAcademico(req, res) {
  try {
    const { usuarioId } = req.params;
    const { titulo, fuente_financiamiento, ano_adjudicacion, periodo_ejecucion, rol_proyecto, link_verificacion } = req.body;

    if (!titulo)
      return res.status(400).json({ message: "Título obligatorio" });

    const newId = await createInvestigacion({ usuario_id: usuarioId, titulo, fuente_financiamiento, ano_adjudicacion, periodo_ejecucion, rol_proyecto, link_verificacion });
    res.status(201).json({ investigacion_id: newId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creando investigación" });
  }
}

export async function updateInvestigacionParaAcademico(req, res) {
  try {
    const { id } = req.params;
    await updateInvestigacion(id, req.body);
    res.json({ message: "Investigación actualizada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualizando investigación" });
  }
}

export async function deleteInvestigacionParaAcademico(req, res) {
  try {
    const { id } = req.params;
    await deleteInvestigacion(id);
    res.json({ message: "Investigación eliminada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error eliminando investigación" });
  }
}