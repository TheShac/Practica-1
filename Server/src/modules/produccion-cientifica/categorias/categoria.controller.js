import { listCategoriasService } from './categoria.service.js';

const handle = (fn) => async (req, res) => {
  try {
    res.json(await fn(req));
  } catch (err) {
    console.error(err);
    res.status(err.status ?? 500).json({ message: err.message });
  }
};

export const listCategorias = handle(() => listCategoriasService());