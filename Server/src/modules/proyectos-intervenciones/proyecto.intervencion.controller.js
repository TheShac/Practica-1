import {
  listMisProyectosService, createProyectoService,
  updateProyectoService, deleteProyectoService,
  listProyectosDeAcademicoService, createProyectoParaAcademicoService,
  updateProyectoParaAcademicoService, deleteProyectoParaAcademicoService,
} from './proyecto.intervencion.service.js';

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

export const listMisProyectos = handle((req) =>
  listMisProyectosService(req.user.usuario_id)
);

export const createProyectoHandler = handle(async (req, res) => {
  const result = await createProyectoService(req.user.usuario_id, req.body);
  res.status(201);
  return result;
});

export const updateProyectoHandler = handle((req) =>
  updateProyectoService(req.params.id, req.user.usuario_id, req.body)
);

export const deleteProyectoHandler = handle((req) =>
  deleteProyectoService(req.params.id, req.user.usuario_id)
);

// ── Secretaria ─────────────────────────────────────────────────────────────

export const listProyectosDeAcademico = handle((req) =>
  listProyectosDeAcademicoService(req.params.usuarioId)
);

export const createProyectoParaAcademico = handle(async (req, res) => {
  const result = await createProyectoParaAcademicoService(req.params.usuarioId, req.body);
  res.status(201);
  return result;
});

export const updateProyectoParaAcademico = handle((req) =>
  updateProyectoParaAcademicoService(req.params.id, req.body)
);

export const deleteProyectoParaAcademico = handle((req) =>
  deleteProyectoParaAcademicoService(req.params.id)
);