import { getUltimasActualizaciones } from "../../models/profesional-apoyo/dashboard.model.js";

export async function getActualizaciones(req, res) {
  try {
    const rows = await getUltimasActualizaciones();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo actualizaciones" });
  }
}