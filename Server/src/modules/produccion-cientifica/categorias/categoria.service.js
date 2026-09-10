import { getCategorias } from './categoria.model.js';

export async function listCategoriasService() {
  return getCategorias();
}