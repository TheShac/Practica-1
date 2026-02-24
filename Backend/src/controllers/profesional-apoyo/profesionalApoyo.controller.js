import { getReporteGeneral } from "../../models/profesional-apoyo/profesionalApoyo.model.js";

export async function reporteGeneralHandler(req, res) {
  try {
    const rows = await getReporteGeneral();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo reporte general" });
  }
}