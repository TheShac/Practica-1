import {
  getMisPatentesService, createPatenteService,
  updatePatenteService, deletePatenteService,
  listPatentesDeAcademicoService, createPatenteParaAcademicoService,
  updatePatenteParaAcademicoService, deletePatenteParaAcademicoService,
} from './patente.service.js';

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

export const getMisPatentes = handle((req) =>
  getMisPatentesService(req.user.usuario_id)
);

export const createPatenteHandler = handle(async (req, res) => {
  const result = await createPatenteService(req.user.usuario_id, req.body);
  res.status(201);
  return result;
});

export const updatePatenteHandler = handle((req) =>
  updatePatenteService(req.params.id, req.body)
);

export const deletePatenteHandler = handle((req) =>
  deletePatenteService(req.params.id)
);

// ── Secretaria ─────────────────────────────────────────────────────────────

export const listPatentesDeAcademico = handle((req) =>
  listPatentesDeAcademicoService(req.params.usuarioId)
);

export const createPatenteParaAcademico = handle(async (req, res) => {
  const result = await createPatenteParaAcademicoService(req.params.usuarioId, req.body);
  res.status(201);
  return result;
});

export const updatePatenteParaAcademico = handle((req) =>
  updatePatenteParaAcademicoService(req.params.id, req.body)
);

export const deletePatenteParaAcademico = handle((req) =>
  deletePatenteParaAcademicoService(req.params.id)
);