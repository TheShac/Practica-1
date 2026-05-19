import { getActualizacionesService } from './dashboard.service.js';

const handle = (fn) => async (req, res) => {
  try {
    res.json(await fn(req));
  } catch (err) {
    console.error(err);
    res.status(err.status ?? 500).json({ message: err.message });
  }
};

export const getActualizaciones = handle(() => getActualizacionesService());