import {
  listMisCapLibrosService, createCapLibroService,
  updateCapLibroService, deleteCapLibroService,
  listCapLibrosDeAcademicoService, createCapLibroParaAcademicoService,
  updateCapLibroParaAcademicoService, deleteCapLibroParaAcademicoService,
} from './cap.libro.service.js';

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

export const listMisCapLibros = handle((req) =>
  listMisCapLibrosService(req.user.usuario_id)
);

export const createCapLibroHandler = handle(async (req, res) => {
  const result = await createCapLibroService(req.user.usuario_id, req.body);
  res.status(201);
  return result;
});

export const updateCapLibroHandler = handle((req) =>
  updateCapLibroService(req.params.id, req.user.usuario_id, req.body)
);

export const deleteCapLibroHandler = handle((req) =>
  deleteCapLibroService(req.params.id, req.user.usuario_id)
);

// ── Secretaria ─────────────────────────────────────────────────────────────

export const listCapLibrosDeAcademico = handle((req) =>
  listCapLibrosDeAcademicoService(req.params.usuarioId)
);

export const createCapLibroParaAcademico = handle(async (req, res) => {
  const result = await createCapLibroParaAcademicoService(req.params.usuarioId, req.body);
  res.status(201);
  return result;
});

export const updateCapLibroParaAcademico = handle((req) =>
  updateCapLibroParaAcademicoService(req.params.id, req.body)
);

export const deleteCapLibroParaAcademico = handle((req) =>
  deleteCapLibroParaAcademicoService(req.params.id)
);