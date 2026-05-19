import {
  listMisLibrosService, createLibroService,
  updateLibroService, deleteLibroService,
  listLibrosDeAcademicoService, createLibroParaAcademicoService,
  updateLibroParaAcademicoService, deleteLibroParaAcademicoService,
} from './libro.service.js';

const handle = (fn) => async (req, res) => {
  try {
    const result = await fn(req, res);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(err.status ?? 500).json({ message: err.message });
  }
};

// ── Académico ──────────────────────────────────────────────────────────────

export const listMisLibros = handle((req) =>
  listMisLibrosService(req.user.usuario_id)
);

export const createLibroHandler = handle(async (req, res) => {
  const result = await createLibroService(req.user.usuario_id, req.body);
  res.status(201);
  return result;
});

export const updateLibroHandler = handle((req) =>
  updateLibroService(req.params.id, req.user.usuario_id, req.body)
);

export const deleteLibroHandler = handle((req) =>
  deleteLibroService(req.params.id, req.user.usuario_id)
);

// ── Secretaria ─────────────────────────────────────────────────────────────

export const listLibrosDeAcademico = handle((req) =>
  listLibrosDeAcademicoService(req.params.usuarioId)
);

export const createLibroParaAcademico = handle(async (req, res) => {
  const result = await createLibroParaAcademicoService(req.params.usuarioId, req.body);
  res.status(201);
  return result;
});

export const updateLibroParaAcademico = handle((req) =>
  updateLibroParaAcademicoService(req.params.id, req.body)
);

export const deleteLibroParaAcademico = handle((req) =>
  deleteLibroParaAcademicoService(req.params.id)
);