import { obtenerDashboardCorreos, obtenerDashboardNotificaciones } from "./dashboard.service.js";

export async function dashboardCorreos(req, res) {
  try {
    const data = await obtenerDashboardCorreos();
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error al obtener el dashboard de correos." });
  }
}

export async function dashboardNotificaciones(req, res) {
  try {
    const data = await obtenerDashboardNotificaciones();
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error al obtener el dashboard de notificaciones." });
  }
}