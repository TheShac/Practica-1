import { useEffect, useState } from "react";
import FormModal from "@/shared/components/modals/formModal/FormModal";
import Toast from "@/shared/components/ui/feedback/Toast";
import {
  enviarNotificacion, getNotificacionesEnviadas, eliminarNotificacion,
  getDetalleLectura,
} from "@/features/profesional-apoyo/services/notificacion.service.js";
import { getAcademicos } from "@/features/profesional-apoyo/services/ficha.service.js";
import { formatFecha } from "@/shared/utils/fecha.js";

const emptyForm = {
  asunto: "",
  mensaje: "",
  es_global: true,
  destinatarios: [],
  enviar_correo: false,
};

function nombreCompleto(a) {
  return [a.primer_nombre, a.segundo_nombre, a.primer_apellido, a.segundo_apellido]
    .filter(Boolean).join(" ");
}

const ESTADO_CORREO_INFO = {
  pendiente:   { texto: "Pendiente",    clase: "bg-secondary" },
  procesando:  { texto: "Enviando...",  clase: "bg-info text-dark" },
  completado:  { texto: "Enviado",      clase: "bg-success" },
  con_errores: { texto: "Con errores",  clase: "bg-danger" },
};

function EstadoCorreo({ row }) {
  if (!row.enviar_correo) {
    return <span style={{ color: "var(--muted)" }}>—</span>;
  }
  const info = ESTADO_CORREO_INFO[row.estado_envio] || ESTADO_CORREO_INFO.pendiente;
  return (
    <span className={`badge ${info.clase}`}>
      {info.texto} ({row.cantidad_enviados}/{row.cantidad_destinatarios})
    </span>
  );
}

export default function Notificaciones() {
  const [rows, setRows]           = useState([]);
  const [academicos, setAcademicos] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(emptyForm);
  const [errors, setErrors]       = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const [showLectura, setShowLectura]         = useState(false);
  const [lecturaLoading, setLecturaLoading]   = useState(false);
  const [lecturaRows, setLecturaRows]         = useState([]);
  const [notifSeleccionada, setNotifSeleccionada] = useState(null);

  const load = async () => {
    const [enviadas, acs] = await Promise.all([
      getNotificacionesEnviadas(),
      getAcademicos(),
    ]);
    setRows(enviadas);
    setAcademicos(acs);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await load();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleDestinatario = (uid) => {
    setForm((prev) => ({
      ...prev,
      destinatarios: prev.destinatarios.includes(uid)
        ? prev.destinatarios.filter((d) => d !== uid)
        : [...prev.destinatarios, uid],
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.asunto.trim())  e.asunto  = "El asunto es obligatorio";
    if (!form.mensaje.trim()) e.mensaje = "El mensaje es obligatorio";
    if (!form.es_global && form.destinatarios.length === 0)
      e.destinatarios = "Selecciona al menos un académico";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await enviarNotificacion({
        asunto:        form.asunto,
        mensaje:       form.mensaje,
        es_global:     form.es_global,
        destinatarios: form.es_global ? [] : form.destinatarios,
        enviar_correo: form.enviar_correo,
      });
      await load();
      setShowModal(false);
      setForm(emptyForm);
      setToast({
        show: true,
        message: form.enviar_correo
          ? "Notificación enviada. Los correos se están procesando."
          : "Notificación enviada correctamente",
        type: "success",
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar esta notificación?")) return;
    try {
      await eliminarNotificacion(id);
      setRows((prev) => prev.filter((r) => r.notificacion_id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const abrirDetalleLectura = async (row) => {
    setNotifSeleccionada(row);
    setShowLectura(true);
    setLecturaLoading(true);
    try {
      const detalle = await getDetalleLectura(row.notificacion_id);
      setLecturaRows(detalle);
    } catch (err) {
      alert(err.message);
      setShowLectura(false);
    } finally {
      setLecturaLoading(false);
    }
  };

  return (
    <div>
      <h3 className="mb-3 perfil-title">Notificaciones</h3>

      <div className="panel-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={{ color: "var(--muted)" }}>
            Notificaciones enviadas a los académicos
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => { setForm(emptyForm); setErrors({}); setShowModal(true); }}
          >
            <i className="bi bi-send me-2" />
            Nueva Notificación
          </button>
        </div>

        {loading ? (
          <div style={{ color: "var(--muted)" }}>Cargando...</div>
        ) : rows.length === 0 ? (
          <div style={{ color: "var(--muted)" }}>Sin notificaciones enviadas.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-dark-custom align-middle">
              <thead>
                <tr>
                  <th>Asunto</th>
                  <th>Destinatarios</th>
                  <th>Leídas</th>
                  <th>Correo</th>
                  <th>Enviada</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.notificacion_id}>
                    <td>
                      <div className="fw-semibold">{r.asunto}</div>
                      <div className="small text-truncate" style={{ color: "var(--muted)", maxWidth: 300 }}>
                        {r.mensaje}
                      </div>
                    </td>
                    <td>
                      {r.es_global ? (
                        <span className="badge bg-primary">Todos</span>
                      ) : (
                        <span style={{ color: "var(--muted)" }}>{r.total_destinatarios} académico(s)</span>
                      )}
                    </td>
                    <td>
                      <span style={{ color: "var(--muted)" }}>
                        {r.total_leidos} / {r.total_destinatarios}
                      </span>
                    </td>
                    <td>
                      <EstadoCorreo row={r} />
                    </td>
                    <td style={{ color: "var(--muted)" }}>{formatFecha(r.creado_en)}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => abrirDetalleLectura(r)}
                        title="Ver quién vio esta notificación"
                      >
                        <i className="bi bi-eye" />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => remove(r.notificacion_id)}
                      >
                        <i className="bi bi-trash me-1" />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <FormModal
        show={showModal}
        title="Nueva Notificación"
        onClose={() => setShowModal(false)}
        onSubmit={submit}
        submitText={saving ? "Enviando..." : "Enviar"}
      >
        <div className="row g-3">

          <div className="col-12">
            <label className="form-label" style={{ color: "var(--muted)" }}>Asunto*</label>
            <input
              className={`form-control input-dark${errors.asunto ? " is-invalid" : ""}`}
              value={form.asunto}
              placeholder="Ej: Recordatorio actualización de ficha"
              onChange={(e) => setForm({ ...form, asunto: e.target.value })}
            />
            {errors.asunto && <div className="invalid-feedback">{errors.asunto}</div>}
          </div>

          <div className="col-12">
            <label className="form-label" style={{ color: "var(--muted)" }}>Mensaje*</label>
            <textarea
              className={`form-control input-dark${errors.mensaje ? " is-invalid" : ""}`}
              rows={4}
              value={form.mensaje}
              placeholder="Escribe el mensaje para los académicos..."
              onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
            />
            {errors.mensaje && <div className="invalid-feedback">{errors.mensaje}</div>}
          </div>

          <div className="col-12">
            <label className="form-label" style={{ color: "var(--muted)" }}>Destinatarios</label>
            <div className="d-flex gap-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="todos"
                  checked={form.es_global}
                  onChange={() => setForm({ ...form, es_global: true, destinatarios: [] })}
                />
                <label className="form-check-label" htmlFor="todos">Todos los académicos</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="especificos"
                  checked={!form.es_global}
                  onChange={() => setForm({ ...form, es_global: false })}
                />
                <label className="form-check-label" htmlFor="especificos">Académicos específicos</label>
              </div>
            </div>
          </div>

          {!form.es_global && (
            <div className="col-12">
              <label className="form-label" style={{ color: "var(--muted)" }}>
                Selecciona académicos*
              </label>
              <div
                className={`panel-card mb-0${errors.destinatarios ? " border border-danger" : ""}`}
                style={{ maxHeight: 220, overflowY: "auto" }}
              >
                {academicos.length === 0 ? (
                  <div style={{ color: "var(--muted)" }}>Sin académicos disponibles.</div>
                ) : (
                  academicos.map((a) => (
                    <div key={a.usuario_id} className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`ac-${a.usuario_id}`}
                        checked={form.destinatarios.includes(a.usuario_id)}
                        onChange={() => toggleDestinatario(a.usuario_id)}
                      />
                      <label className="form-check-label" htmlFor={`ac-${a.usuario_id}`}>
                        {nombreCompleto(a)}
                      </label>
                    </div>
                  ))
                )}
              </div>
              {errors.destinatarios && (
                <div className="text-danger small mt-1">{errors.destinatarios}</div>
              )}
            </div>
          )}

          <div className="col-12">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="enviar_correo"
                checked={form.enviar_correo}
                onChange={(e) => setForm({ ...form, enviar_correo: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="enviar_correo" style={{ color: "var(--muted)" }}>
                Enviar también por correo
              </label>
            </div>
            {form.enviar_correo && (
              <div className="small mt-1" style={{ color: "var(--muted)" }}>
                Solo llega a quienes tengan su correo organizacional verificado.
              </div>
            )}
          </div>

        </div>
      </FormModal>

      <FormModal
        show={showLectura}
        title={notifSeleccionada ? `¿Quién vio "${notifSeleccionada.asunto}"?` : "Detalle de lectura"}
        onClose={() => setShowLectura(false)}
        onSubmit={() => setShowLectura(false)}
        submitText="Cerrar"
      >
        {lecturaLoading ? (
          <div style={{ color: "var(--muted)" }}>Cargando...</div>
        ) : lecturaRows.length === 0 ? (
          <div style={{ color: "var(--muted)" }}>Sin destinatarios.</div>
        ) : (
          <div className="table-responsive" style={{ maxHeight: 320, overflowY: "auto" }}>
            <table className="table table-dark table-dark-custom align-middle">
              <thead>
                <tr>
                  <th>Académico</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {lecturaRows.map((r) => (
                  <tr key={r.usuario_id}>
                    <td>{r.nombre}</td>
                    <td>
                      {r.leido ? (
                        <span className="badge bg-success">Vista</span>
                      ) : (
                        <span className="badge bg-secondary">No vista</span>
                      )}
                    </td>
                    <td style={{ color: "var(--muted)" }}>
                      {r.leido_en ? formatFecha(r.leido_en) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </FormModal>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}