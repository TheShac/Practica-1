import {
  getPatentesByUsuario,
  createPatente,
  updatePatente,
  deletePatente,
} from "../../models/patente/patente.model.js";

export async function getMisPatentes(req, res) {
  try {
    const usuario_id = req.user.id || req.user.usuario_id;

    if (!usuario_id) {
      return res.status(401).json({ message: "Usuario no válido en token" });
    }

    const data = await getPatentesByUsuario(usuario_id);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo patentes" });
  }
}

export async function createPatenteHandler(req, res) {
  try {
    const usuario_id = req.user.id || req.user.usuario_id;

    if (!usuario_id) {
      return res.status(401).json({ message: "Usuario no válido en token" });
    }

    const { nombre_patente } = req.body;

    if (!nombre_patente) {
      return res.status(400).json({ message: "Nombre obligatorio" });
    }

    const newId = await createPatente({
      usuario_id,
      ...req.body,
    });

    res.status(201).json({ patente_id: newId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creando patente" });
  }
}

export async function updatePatenteHandler(req, res) {
  try {
    const { id } = req.params;
    await updatePatente(id, req.body);
    res.json({ message: "Patente actualizada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualizando patente" });
  }
}

export async function deletePatenteHandler(req, res) {
  try {
    const { id } = req.params;
    await deletePatente(id);
    res.json({ message: "Patente eliminada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error eliminando patente" });
  }
}
