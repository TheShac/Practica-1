import { getUltimasActualizaciones } from './dashboard.model.js';

export async function getActualizacionesService(limit = 10) {
  return getUltimasActualizaciones(limit);
}