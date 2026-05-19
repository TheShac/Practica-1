import {
  enviarNotificacionService, listarEnviadasService, eliminarNotificacionService,
  misNotificacionesService, marcarNotificacionLeidaService, contarNoLeidasService,
} from './notificacion.service.js';

const handle = (fn) => async (req, res) => {
  try {
    res.json(await fn(req));
  } catch (err) {
    console.error(err);
    res.status(err.status ?? 500).json({ message: err.message });
  }
};

// ── Secretaria ─────────────────────────────────────────────────────────────

export const enviarNotificacion = handle(async (req) => {
  const result = await enviarNotificacionService({
    remitente_id: req.user.usuario_id,
    ...req.body,
  });
  req.res.status(201);
  return result;
});

export const listarEnviadas = handle((req) =>
  listarEnviadasService(req.user.usuario_id)
);

export const eliminarNotificacion = handle((req) =>
  eliminarNotificacionService(req.params.id)
);

// ── Académico ──────────────────────────────────────────────────────────────

export const misNotificaciones = handle((req) =>
  misNotificacionesService(req.user.usuario_id)
);

export const marcarNotificacionLeida = handle((req) =>
  marcarNotificacionLeidaService({
    notificacion_id: req.params.id,
    usuario_id:      req.user.usuario_id,
    es_global:       req.body.es_global,
  })
);

export const contarNoLeidas = handle((req) =>
  contarNoLeidasService(req.user.usuario_id)
);