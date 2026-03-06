import { useEffect, useState } from "react";
import {
  getMisNotificaciones,
  marcarLeida,
} from "../../services/notificacion.service.js";

function formatFecha(fecha) {
  if (!fecha) return "—";
  return new Date(fecha).toLocaleDateString("es-CL", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function MisNotificaciones() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null); // notificacion_id expandida

  const load = async () => {
    const data = await getMisNotificaciones();
    setRows(data);
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

  const handleExpand = async (notif) => {
    // Si se cierra, no hacer nada especial
    if (expanded === notif.notificacion_id) {
      setExpanded(null);
      return;
    }

    setExpanded(notif.notificacion_id);

    // Marcar como leída si aún no lo está
    if (!notif.leido) {
      try {
        await marcarLeida(notif.notificacion_id, notif.es_global);
        setRows((prev) =>
          prev.map((r) =>
            r.notificacion_id === notif.notificacion_id
              ? { ...r, leido: 1, leido_en: new Date().toISOString() }
              : r
          )
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  const noLeidas = rows.filter((r) => !r.leido).length;

  if (loading) return <div style={{ color: "var(--muted)" }}>Cargando notificaciones...</div>;

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-3">
        <h5 className="mb-0">Notificaciones</h5>
        {noLeidas > 0 && (
          <span className="badge bg-danger">{noLeidas}</span>
        )}
      </div>

      {rows.length === 0 ? (
        <div style={{ color: "var(--muted)" }}>Sin notificaciones.</div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {rows.map((notif) => {
            const isExpanded = expanded === notif.notificacion_id;
            const isUnread   = !notif.leido;

            return (
              <div
                key={notif.notificacion_id}
                className="panel-card mb-0"
                style={{
                  cursor: "pointer",
                  borderLeft: isUnread ? "3px solid var(--bs-primary)" : "3px solid transparent",
                  transition: "border-color 0.2s",
                }}
                onClick={() => handleExpand(notif)}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="d-flex align-items-center gap-2">
                    {isUnread && (
                      <span
                        style={{
                          width: 8, height: 8, borderRadius: "50%",
                          background: "var(--bs-primary)",
                          display: "inline-block", flexShrink: 0,
                        }}
                      />
                    )}
                    <div>
                      <div className={`fw-semibold${isUnread ? "" : ""}`} style={{ color: isUnread ? "#fff" : "var(--muted)" }}>
                        {notif.asunto}
                      </div>
                      <div className="small" style={{ color: "var(--muted)" }}>
                        De: {notif.remitente_nombre} · {formatFecha(notif.creado_en)}
                      </div>
                    </div>
                  </div>
                  <i className={`bi bi-chevron-${isExpanded ? "up" : "down"} ms-3`} style={{ color: "var(--muted)" }} />
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--bs-border-color)" }}>
                    <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{notif.mensaje}</p>
                    {notif.leido_en && (
                      <div className="small mt-2" style={{ color: "var(--muted)" }}>
                        Leído el {formatFecha(notif.leido_en)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}