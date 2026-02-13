import {
  listPublicacionesByUser,
  getPublicacionById,
  createPublicacion,
  updatePublicacion,
  deletePublicacion,
} from "../../models/publicaciones/publicacion.model.js";

function isOwner(row, usuario_id) {
  return row && Number(row.usuario_id) === Number(usuario_id);
}

export async function listMisPublicaciones(req, res) {
  try {
    const usuario_id = req.user.usuario_id;
    const rows = await listPublicacionesByUser(usuario_id);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error listando publicaciones" });
  }
}

export async function createPublicacionHandler(req, res) {
  try {
    const usuario_id = req.user.usuario_id;

    const {
      categoria_id,
      titulo_articulo,
      nombre_revista,
      ISSN,
      ano,
      autor_principal,
      autores,
      link_verificacion,
      estado,
    } = req.body;

    if (!categoria_id || !titulo_articulo) {
      return res.status(400).json({ message: "categoria_id y titulo_articulo son obligatorios" });
    }

    const newId = await createPublicacion(usuario_id, {
      categoria_id,
      titulo_articulo,
      nombre_revista,
      ISSN,
      ano,
      autor_principal,
      autores,
      link_verificacion,
      estado,
    });

    const created = await getPublicacionById(newId);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creando publicación" });
  }
}

export async function updatePublicacionHandler(req, res) {
  try {
    const usuario_id = req.user.usuario_id;
    const { id } = req.params;

    const existing = await getPublicacionById(id);
    if (!existing) return res.status(404).json({ message: "Publicación no encontrada" });
    if (!isOwner(existing, usuario_id)) return res.status(403).json({ message: "No autorizado" });

    // Validación mínima
    if (!req.body.categoria_id || !req.body.titulo_articulo) {
      return res.status(400).json({ message: "categoria_id y titulo_articulo son obligatorios" });
    }

    await updatePublicacion(id, req.body);

    const updated = await getPublicacionById(id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualizando publicación" });
  }
}

export async function deletePublicacionHandler(req, res) {
  try {
    const usuario_id = req.user.usuario_id;
    const { id } = req.params;

    const existing = await getPublicacionById(id);
    if (!existing) return res.status(404).json({ message: "Publicación no encontrada" });
    if (!isOwner(existing, usuario_id)) return res.status(403).json({ message: "No autorizado" });

    await deletePublicacion(id);
    res.json({ message: "Publicación eliminada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error eliminando publicación" });
  }
}
