import { useEffect, useState } from "react";
import FormModal from "../../components/FormModal.jsx";
import {
  enviarNotificacion,
  getNotificacionesEnviadas,
  eliminarNotificacion,
} from "../../services/notificacion.service.js";
import { getAcademicos } from "../../services/api.js";

const emptyForm = {
  asunto: "",
  mensaje: "",
  es_global: true,
  destinatarios: [],
};

function formatFecha(fecha) {
  if (!fecha) return "—";
  return new Date(fecha).toLocaleDateString("es-CL", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function nombreCompleto(a) {
  return [a.primer_nombre, a.segundo_nombre, a.primer_apellido, a.segundo_apellido]
    .filter(Boolean).join(" ");
}

export default function Notificaciones() {
  const [rows, setRows]           = useState([]);
  const [academicos, setAcademicos] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(emptyForm);
  const [errors, setErrors]       = useState({});

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
      });
      await load();
      setShowModal(false);
      setForm(emptyForm);
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

  return (
    <div>
      <h3 className="mb-3">Notificaciones</h3>

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
                      {r.es_global ? (
                        <span style={{ color: "var(--muted)" }}>—</span>
                      ) : (
                        <span style={{ color: "var(--muted)" }}>
                          {r.total_leidos} / {r.total_destinatarios}
                        </span>
                      )}
                    </td>
                    <td style={{ color: "var(--muted)" }}>{formatFecha(r.creado_en)}</td>
                    <td className="text-center">
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

      {/* ── Modal Nueva Notificación ── */}
      <FormModal
        show={showModal}
        title="Nueva Notificación"
        onClose={() => setShowModal(false)}
        onSubmit={submit}
        submitText={saving ? "Enviando..." : "Enviar"}
      >
        <div className="row g-3">

          {/* Asunto */}
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

          {/* Mensaje */}
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

          {/* Tipo de destinatario */}
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

          {/* Lista de académicos (solo si es específico) */}
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

        </div>
      </FormModal>
    </div>
  );
}