import {
  listMisPublicacionesService, createPublicacionService,
  updatePublicacionService, deletePublicacionService,
  listPublicacionesDeAcademicoService, createPublicacionParaAcademicoService,
  updatePublicacionParaAcademicoService, deletePublicacionParaAcademicoService,
} from './publicacion.service.js';

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

export const listMisPublicaciones = handle((req) =>
  listMisPublicacionesService(req.user.usuario_id)
);

export const createPublicacionHandler = handle(async (req, res) => {
  const result = await createPublicacionService(req.user.usuario_id, req.body);
  res.status(201);
  return result;
});

export const updatePublicacionHandler = handle((req) =>
  updatePublicacionService(req.params.id, req.user.usuario_id, req.body)
);

export const deletePublicacionHandler = handle((req) =>
  deletePublicacionService(req.params.id, req.user.usuario_id)
);

// ── Secretaria ─────────────────────────────────────────────────────────────

export const listPublicacionesDeAcademico = handle((req) =>
  listPublicacionesDeAcademicoService(req.params.usuarioId)
);

export const createPublicacionParaAcademico = handle(async (req, res) => {
  const result = await createPublicacionParaAcademicoService(req.params.usuarioId, req.body);
  res.status(201);
  return result;
});

export const updatePublicacionParaAcademico = handle((req) =>
  updatePublicacionParaAcademicoService(req.params.id, req.body)
);

export const deletePublicacionParaAcademico = handle((req) =>
  deletePublicacionParaAcademicoService(req.params.id)
);