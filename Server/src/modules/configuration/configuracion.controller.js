import {
  obtenerTodaLaConfiguracion, actualizarConfiguracion,
  listarDominios, agregarDominio, eliminarDominio,
} from "./configuracion.service.js";

export async function obtenerConfiguracion(req, res) {
  try {
    return res.json(await obtenerTodaLaConfiguracion());
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error al obtener la configuración." });
  }
}

export async function actualizarConfiguracionController(req, res) {
  try {
    return res.json(await actualizarConfiguracion(req.body));
  } catch (err) {
    return res.status(err.status ?? 500).json({ message: err.message });
  }
}

export async function obtenerDominios(req, res) {
  try {
    return res.json(await listarDominios());
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error al obtener los dominios." });
  }
}

export async function crearDominio(req, res) {
  try {
    const { dominio } = req.body;
    return res.status(201).json(await agregarDominio(dominio));
  } catch (err) {
    return res.status(err.status ?? 500).json({ message: err.message });
  }
}

export async function borrarDominio(req, res) {
  try {
    return res.json(await eliminarDominio(req.params.id));
  } catch (err) {
    return res.status(err.status ?? 500).json({ message: err.message });
  }
}