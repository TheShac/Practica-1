import {
  getMisConsultoriasService, createConsultoriaService,
  updateConsultoriaService, deleteConsultoriaService,
  listConsultoriasDeAcademicoService, createConsultoriaParaAcademicoService,
  updateConsultoriaParaAcademicoService, deleteConsultoriaParaAcademicoService,
} from './consultorias.service.js';

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

export const getMisConsultorias = handle((req) =>
  getMisConsultoriasService(req.user.usuario_id)
);

export const createConsultoriaHandler = handle(async (req, res) => {
  const result = await createConsultoriaService(req.user.usuario_id, req.body);
  res.status(201);
  return result;
});

export const updateConsultoriaHandler = handle((req) =>
  updateConsultoriaService(req.params.id, req.body)
);

export const deleteConsultoriaHandler = handle((req) =>
  deleteConsultoriaService(req.params.id)
);

// ── Secretaria ─────────────────────────────────────────────────────────────

export const listConsultoriasDeAcademico = handle((req) =>
  listConsultoriasDeAcademicoService(req.params.usuarioId)
);

export const createConsultoriaParaAcademico = handle(async (req, res) => {
  const result = await createConsultoriaParaAcademicoService(req.params.usuarioId, req.body);
  res.status(201);
  return result;
});

export const updateConsultoriaParaAcademico = handle((req) =>
  updateConsultoriaParaAcademicoService(req.params.id, req.body)
);

export const deleteConsultoriaParaAcademico = handle((req) =>
  deleteConsultoriaParaAcademicoService(req.params.id)
);