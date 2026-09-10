import { ConfiguracionModel } from "./configuracion.model.js";

const CLAVES_PERMITIDAS = [
  "remitente_correo",
  "remitente_nombre",
  "expiracion_codigo_min",
  "limite_reenvios",
  "expiracion_reset_min",
];

export async function obtenerTodaLaConfiguracion() {
  const rows = await ConfiguracionModel.getAll();
  return Object.fromEntries(rows.map((r) => [r.clave, r.valor]));
}

export async function obtenerValorConfiguracion(clave, valorPorDefecto) {
  const config = await obtenerTodaLaConfiguracion();
  return config[clave] !== undefined ? config[clave] : valorPorDefecto;
}

export async function obtenerValorNumerico(clave, valorPorDefecto) {
  const valor = await obtenerValorConfiguracion(clave, valorPorDefecto);
  return Number(valor);
}

export async function actualizarConfiguracion(cambios) {
  const entradas = Object.entries(cambios ?? {}).filter(([clave]) =>
    CLAVES_PERMITIDAS.includes(clave)
  );

  if (entradas.length === 0) {
    const err = new Error("No se recibió ninguna clave de configuración válida.");
    err.status = 400;
    throw err;
  }

  for (const [clave, valor] of entradas) {
    await ConfiguracionModel.upsert(clave, String(valor));
  }

  return obtenerTodaLaConfiguracion();
}

export async function listarDominios() {
  return ConfiguracionModel.getDominios();
}

export async function agregarDominio(dominioCrudo) {
  const dominio = dominioCrudo?.trim().toLowerCase();
  if (!dominio || !dominio.includes(".")) {
    const err = new Error("Dominio inválido.");
    err.status = 422;
    throw err;
  }
  await ConfiguracionModel.addDominio(dominio);
  return listarDominios();
}

export async function eliminarDominio(dominio_id) {
  await ConfiguracionModel.deleteDominio(dominio_id);
  return listarDominios();
}