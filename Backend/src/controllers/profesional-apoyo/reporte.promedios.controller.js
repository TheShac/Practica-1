import { getPromedios, updatePromedios } from "../../models/profesional-apoyo/reporte.promedios.model.js";

export async function getPromediosHandler(req, res) {
  try {
    const data = await getPromedios();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo promedios" });
  }
}

export async function updatePromediosHandler(req, res) {
  try {
    await updatePromedios(req.body);
    res.json({ message: "Promedios actualizados" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error actualizando promedios" });
  }
}