import {
  listCapLibrosByUser,
  getCapLibroById,
  createCapLibro,
  updateCapLibro,
  deleteCapLibro,
} from "../../models/libros/cap.libro.model.js";

function isOwner(row, usuario_id) {
  return row && Number(row.usuario_id) === Number(usuario_id);
}

export async function listMisCapLibros(req, res) {
  try {
    const usuario_id = req.user.usuario_id;
    const rows = await listCapLibrosByUser(usuario_id);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error listando capítulos de libro" });
  }
}

export async function createCapLibroHandler(req, res) {
  try {
    const usuario_id = req.user.usuario_id;
    const body = req.body || {};

    if (!body.nombre_capitulo) {
      return res.status(400).json({ message: "nombre_capitulo es obligatorio" });
    }

    const newId = await createCapLibro(usuario_id, body);
    const created = await getCapLibroById(newId);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creando capítulo de libro" });
  }
}

export async function updateCapLibroHandler(req, res) {
  try {
    const usuario_id = req.user.usuario_id;
    const { id } = req.params;

    const existing = await getCapLibroById(id);
    if (!existing) return res.status(404).json({ message: "Registro no encontrado" });
    if (!isOwner(existing, usuario_id)) return res.status(403).json({ message: "No autorizado" });

    const body = req.body || {};
    if (!body.nombre_capitulo) {
      return res.status(400).json({ message: "nombre_capitulo es obligatorio" });
    }

    await updateCapLibro(id, body);
    const updated = await getCapLibroById(id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualizando capítulo de libro" });
  }
}

export async function deleteCapLibroHandler(req, res) {
  try {
    const usuario_id = req.user.usuario_id;
    const { id } = req.params;

    const existing = await getCapLibroById(id);
    if (!existing) return res.status(404).json({ message: "Registro no encontrado" });
    if (!isOwner(existing, usuario_id)) return res.status(403).json({ message: "No autorizado" });

    await deleteCapLibro(id);
    res.json({ message: "Capítulo de libro eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error eliminando capítulo de libro" });
  }
}
