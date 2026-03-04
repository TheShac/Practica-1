import { getReporteGeneral, updateReporteGeneral, updateWosGlobal } from "../../models/profesional-apoyo/profesionalApoyo.model.js";

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

export async function updateReporteGeneralHandler(req, res) {
  try {
    const { reporte, wosGlobal } = req.body;

    if (!Array.isArray(reporte)) {
      return res.status(400).json({
        message: "Formato de datos inválido"
      });
    }

    await updateReporteGeneral(reporte);

    if (wosGlobal) {
      await updateWosGlobal("Claustro", wosGlobal.Claustro || 0);
      await updateWosGlobal("Colaborador", wosGlobal.Colaborador || 0);
    }

    res.json({
      message: "Reporte actualizado correctamente"
    });

  } catch (error) {
    console.error("Error actualizando reporte:", error);
    res.status(500).json({
      message: "Error al actualizar reporte"
    });
  }
}