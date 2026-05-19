import {
  getMisInvestigacionesService, createInvestigacionService,
  updateInvestigacionService, deleteInvestigacionService,
  listInvestigacionesDeAcademicoService, createInvestigacionParaAcademicoService,
  updateInvestigacionParaAcademicoService, deleteInvestigacionParaAcademicoService,
} from './investigacion.service.js';

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

export const getMisInvestigaciones = handle((req) =>
  getMisInvestigacionesService(req.user.usuario_id)
);

export const createInvestigacionHandler = handle(async (req, res) => {
  const result = await createInvestigacionService(req.user.usuario_id, req.body);
  res.status(201);
  return result;
});

export const updateInvestigacionHandler = handle((req) =>
  updateInvestigacionService(req.params.id, req.body)
);

export const deleteInvestigacionHandler = handle((req) =>
  deleteInvestigacionService(req.params.id)
);

// ── Secretaria ─────────────────────────────────────────────────────────────

export const listInvestigacionesDeAcademico = handle((req) =>
  listInvestigacionesDeAcademicoService(req.params.usuarioId)
);

export const createInvestigacionParaAcademico = handle(async (req, res) => {
  const result = await createInvestigacionParaAcademicoService(req.params.usuarioId, req.body);
  res.status(201);
  return result;
});

export const updateInvestigacionParaAcademico = handle((req) =>
  updateInvestigacionParaAcademicoService(req.params.id, req.body)
);

export const deleteInvestigacionParaAcademico = handle((req) =>
  deleteInvestigacionParaAcademicoService(req.params.id)
);