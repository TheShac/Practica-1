import {
  listLibrosByUser,
  getLibroById,
  createLibro,
  updateLibro,
  deleteLibro,
} from "../../models/libros/libro.model.js";

function isOwner(row, usuario_id) {
  return row && Number(row.usuario_id) === Number(usuario_id);
}

export async function listMisLibros(req, res) {
  try {
    const usuario_id = req.user.usuario_id;
    const rows = await listLibrosByUser(usuario_id);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error listando libros" });
  }
}

export async function createLibroHandler(req, res) {
  try {
    const usuario_id = req.user.usuario_id;
    const body = req.body || {};

    const { nombre_libro } = body;
    if (!nombre_libro) {
      return res.status(400).json({ message: "nombre_libro es obligatorio" });
    }

    const newId = await createLibro(usuario_id, body);
    const created = await getLibroById(newId);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creando libro" });
  }
}

export async function updateLibroHandler(req, res) {
  try {
    const usuario_id = req.user.usuario_id;
    const { id } = req.params;

    const existing = await getLibroById(id);
    if (!existing) return res.status(404).json({ message: "Libro no encontrado" });
    if (!isOwner(existing, usuario_id)) return res.status(403).json({ message: "No autorizado" });

    const body = req.body || {};
    if (!body.nombre_libro) {
      return res.status(400).json({ message: "nombre_libro es obligatorio" });
    }

    await updateLibro(id, body);
    const updated = await getLibroById(id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualizando libro" });
  }
}

export async function deleteLibroHandler(req, res) {
  try {
    const usuario_id = req.user.usuario_id;
    const { id } = req.params;

    const existing = await getLibroById(id);
    if (!existing) return res.status(404).json({ message: "Libro no encontrado" });
    if (!isOwner(existing, usuario_id)) return res.status(403).json({ message: "No autorizado" });

    await deleteLibro(id);
    res.json({ message: "Libro eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error eliminando libro" });
  }
}

export async function listLibrosDeAcademico(req, res) {
  try {
    const { usuarioId } = req.params;
    const rows = await listLibrosByUser(usuarioId);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error listando libros" });
  }
}

export async function createLibroParaAcademico(req, res) {
  try {
    const { usuarioId } = req.params;
    const body = req.body || {};
    if (!body.nombre_libro)
      return res.status(400).json({ message: "nombre_libro es obligatorio" });

    const newId = await createLibro(usuarioId, body);
    const created = await getLibroById(newId);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creando libro" });
  }
}

export async function updateLibroParaAcademico(req, res) {
  try {
    const { id } = req.params;
    const body = req.body || {};

    const existing = await getLibroById(id);
    if (!existing) return res.status(404).json({ message: "Libro no encontrado" });
    if (!body.nombre_libro)
      return res.status(400).json({ message: "nombre_libro es obligatorio" });

    await updateLibro(id, body);
    const updated = await getLibroById(id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualizando libro" });
  }
}

export async function deleteLibroParaAcademico(req, res) {
  try {
    const { id } = req.params;

    const existing = await getLibroById(id);
    if (!existing) return res.status(404).json({ message: "Libro no encontrado" });

    await deleteLibro(id);
    res.json({ message: "Libro eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error eliminando libro" });
  }
}