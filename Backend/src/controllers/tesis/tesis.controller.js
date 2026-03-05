import {
  getTesisById,
  getTesisByUsuario,
  createTesis,
  updateTesis,
  deleteTesis,
} from "../../models/tesis/tesis.model.js";

export async function getMisTesis(req, res) {
  try {
    const usuario_id = req.user.usuario_id;
    const { nivel } = req.params;

    if (!usuario_id) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const nivelUpper = nivel?.toUpperCase();

    if (!["MAGISTER", "DOCTORADO"].includes(nivelUpper)) {
      return res.status(400).json({ message: "Nivel inválido" });
    }

    const tesis = await getTesisByUsuario(usuario_id, nivelUpper);

    res.json(tesis);
  } catch (err) {
    console.error("Error en getMisTesis:", err);
    res.status(500).json({ message: "Error obteniendo tesis" });
  }
}

export async function createTesisHandler(req, res) {
  try {
    const usuario_id = req.user.usuario_id;

    if (!usuario_id) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const {
      titulo_tesis,
      nombre_programa,
      institucion,
      tesis_dirigida,
      ano,
      autor,
      link_verificacion,
      rol_guia,
      nivel_programa,
    } = req.body;

    if (
      !titulo_tesis ||
      !autor ||
      !ano ||
      !rol_guia ||
      !nivel_programa
    ) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    if (!["GUIA", "CO_GUIA"].includes(rol_guia)) {
      return res.status(400).json({ message: "Rol guía inválido" });
    }

    if (!["MAGISTER", "DOCTORADO"].includes(nivel_programa)) {
      return res.status(400).json({ message: "Nivel programa inválido" });
    }

    const newId = await createTesis({
      usuario_id,
      titulo_tesis,
      nombre_programa,
      institucion,
      tesis_dirigida,
      ano,
      autor,
      link_verificacion,
      rol_guia,
      nivel_programa,
    });

    res.status(201).json({
      message: "Tesis creada correctamente",
      tesis_id: newId,
    });
  } catch (err) {
    console.error("Error en createTesisHandler:", err);
    res.status(500).json({ message: "Error creando tesis" });
  }
}

export async function updateTesisHandler(req, res) {
  try {
    const { id } = req.params;
    const usuario_id = req.user.usuario_id;

    if (!usuario_id) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const tesis = await getTesisById(id);

    if (!tesis) {
      return res.status(404).json({ message: "Tesis no encontrada" });
    }

    if (tesis.usuario_id !== usuario_id) {
      return res.status(403).json({ message: "No tienes permiso para editar esta tesis" });
    }

    await updateTesis(id, req.body);

    res.json({ message: "Tesis actualizada correctamente" });
  } catch (err) {
    console.error("Error en updateTesisHandler:", err);
    res.status(500).json({ message: "Error actualizando tesis" });
  }
}

export async function deleteTesisHandler(req, res) {
  try {
    const { id } = req.params;
    const usuario_id = req.user.usuario_id;

    if (!usuario_id) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    await deleteTesis(id, usuario_id);

    res.json({ message: "Tesis eliminada correctamente" });
  } catch (err) {
    console.error("Error en deleteTesisHandler:", err);
    res.status(500).json({ message: "Error eliminando tesis" });
  }
}

export async function listTesisDeAcademico(req, res) {
  try {
    const { usuarioId, nivel } = req.params;
    const nivelUpper = nivel?.toUpperCase();

    if (!["MAGISTER", "DOCTORADO"].includes(nivelUpper))
      return res.status(400).json({ message: "Nivel inválido" });

    const tesis = await getTesisByUsuario(usuarioId, nivelUpper);
    res.json(tesis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo tesis" });
  }
}

export async function createTesisParaAcademico(req, res) {
  try {
    const { usuarioId } = req.params;
    const { titulo_tesis, nombre_programa, institucion, tesis_dirigida, ano, autor, link_verificacion, rol_guia, nivel_programa } = req.body;

    if (!titulo_tesis || !autor || !ano || !rol_guia || !nivel_programa)
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    if (!["GUIA", "CO_GUIA"].includes(rol_guia))
      return res.status(400).json({ message: "Rol guía inválido" });
    if (!["MAGISTER", "DOCTORADO"].includes(nivel_programa))
      return res.status(400).json({ message: "Nivel programa inválido" });

    const newId = await createTesis({ usuario_id: usuarioId, titulo_tesis, nombre_programa, institucion, tesis_dirigida, ano, autor, link_verificacion, rol_guia, nivel_programa });
    res.status(201).json({ message: "Tesis creada correctamente", tesis_id: newId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creando tesis" });
  }
}

export async function updateTesisParaAcademico(req, res) {
  try {
    const { id } = req.params;

    const tesis = await getTesisById(id);
    if (!tesis) return res.status(404).json({ message: "Tesis no encontrada" });

    await updateTesis(id, req.body);
    res.json({ message: "Tesis actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualizando tesis" });
  }
}

export async function deleteTesisParaAcademico(req, res) {
  try {
    const { id } = req.params;

    const tesis = await getTesisById(id);
    if (!tesis) return res.status(404).json({ message: "Tesis no encontrada" });

    await deleteTesis(id);
    res.json({ message: "Tesis eliminada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error eliminando tesis" });
  }
}