import { getReporteGeneral } from "../../models/profesional-apoyo/profesionalApoyo.model.js";

export async function reporteGeneralHandler(req, res) {
  try {
    const data = await getReporteGeneral();
    res.json(data);
  } catch (error) {
    console.error("Error reporte general:", error);
    res.status(500).json({
      message: "Error al obtener reporte general"
    });
  }
}