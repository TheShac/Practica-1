import {
  getMisTesisService, createTesisService,
  updateTesisService, deleteTesisService,
  listTesisDeAcademicoService, createTesisParaAcademicoService,
  updateTesisParaAcademicoService, deleteTesisParaAcademicoService,
} from './tesis.service.js';

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

export const getMisTesis = handle((req) =>
  getMisTesisService(req.user.usuario_id, req.params.nivel)
);

export const createTesisHandler = handle(async (req, res) => {
  const result = await createTesisService(req.user.usuario_id, req.body);
  res.status(201);
  return result;
});

export const updateTesisHandler = handle((req) =>
  updateTesisService(req.params.id, req.user.usuario_id, req.body)
);

export const deleteTesisHandler = handle((req) =>
  deleteTesisService(req.params.id, req.user.usuario_id)
);

// ── Secretaria ─────────────────────────────────────────────────────────────

export const listTesisDeAcademico = handle((req) =>
  listTesisDeAcademicoService(req.params.usuarioId, req.params.nivel)
);

export const createTesisParaAcademico = handle(async (req, res) => {
  const result = await createTesisParaAcademicoService(req.params.usuarioId, req.body);
  res.status(201);
  return result;
});

export const updateTesisParaAcademico = handle((req) =>
  updateTesisParaAcademicoService(req.params.id, req.body)
);

export const deleteTesisParaAcademico = handle((req) =>
  deleteTesisParaAcademicoService(req.params.id)
);