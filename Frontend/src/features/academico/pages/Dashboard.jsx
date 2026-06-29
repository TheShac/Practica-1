import { useEffect, useState, useRef } from "react";
import { getMisNotificaciones, marcarLeida } from "@/features/academico/services/notificacion.service.js";
import { useNotificacionContext } from "@/shared/context/NotificacionContext.jsx";
import { formatFecha } from "@/shared/utils/fecha.js";

function NotificacionCard({ notif, onLeida }) {
  const [expanded, setExpanded] = useState(false);
  const isUnread = !notif.leido;

  const handleClick = async () => {
    setExpanded((prev) => !prev);
    if (!expanded && isUnread) await onLeida(notif);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        background: "var(--card-bg, #1e2a3a)",
        borderRadius: 10,
        padding: "14px 16px",
        cursor: "pointer",
        borderLeft: isUnread ? "3px solid #4e8ef7" : "3px solid transparent",
        transition: "border-color 0.2s",
      }}
    >
      <div className="d-flex justify-content-between align-items-start gap-2">
        <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
          {isUnread && (
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4e8ef7", flexShrink: 0 }} />
          )}
          <div style={{ minWidth: 0 }}>
            <div className="fw-semibold text-truncate" style={{ color: isUnread ? "#fff" : "var(--muted)", fontSize: "1.3rem" }}>
              {notif.asunto}
            </div>
            <div style={{ color: "var(--muted)", fontSize: "0.9375rem" }}>
              {notif.remitente_nombre} · {formatFecha(notif.creado_en)}
            </div>
          </div>
        </div>
        <i className={`bi bi-chevron-${expanded ? "up" : "down"}`} style={{ color: "var(--muted)", flexShrink: 0, fontSize: "1.125rem" }} />
      </div>

      {expanded && (
        <div className="mt-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p style={{ whiteSpace: "pre-wrap", margin: 0, fontSize: "1.125rem", color: "#cdd6e0" }}>
            {notif.mensaje}
          </p>
          {notif.leido_en && (
            <div style={{ color: "var(--muted)", fontSize: "0.9375rem", marginTop: 6 }}>
              Leído el {formatFecha(notif.leido_en)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [notifs, setNotifs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const { nuevaNotif }        = useNotificacionContext();
  const prevNotifRef          = useRef(null);

  const noLeidas = notifs.filter((n) => !n.leido).length;

  useEffect(() => {
    (async () => {
      try {
        const data = await getMisNotificaciones();
        setNotifs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Agregar notificación nueva al tope de la lista sin recargar
  useEffect(() => {
    if (!nuevaNotif) return;
    // Evitar duplicados si el context emite el mismo objeto
    if (prevNotifRef.current === nuevaNotif) return;
    prevNotifRef.current = nuevaNotif;

    setNotifs((prev) => {
      // Si ya existe en la lista (por carga inicial) no la duplicamos
      const yaExiste = prev.some(n => n.notificacion_id === nuevaNotif.notificacion_id);
      if (yaExiste) return prev;
      return [
        {
          ...nuevaNotif,
          leido:            0,
          leido_en:         null,
          remitente_nombre: "Profesional de Apoyo",
          creado_en:        new Date().toISOString(),
          es_global:        nuevaNotif.es_global ?? true,
        },
        ...prev,
      ];
    });
  }, [nuevaNotif]);

  const handleLeida = async (notif) => {
    try {
      await marcarLeida(notif.notificacion_id, notif.es_global);
      setNotifs((prev) =>
        prev.map((n) =>
          n.notificacion_id === notif.notificacion_id
            ? { ...n, leido: 1, leido_en: new Date().toISOString() }
            : n
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3 className="mb-3 perfil-title">Dashboard</h3>
      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <div className="card-dark p-3">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="fw-semibold" style={{ color: "rgb(255, 255, 255)" }}>Notificaciones</div>
              {noLeidas > 0 && (
                <span className="badge bg-danger" style={{ fontSize: "0.9375rem" }}>{noLeidas}</span>
              )}
            </div>

            {loading ? (
              <div style={{ color: "var(--muted)", fontSize: "1.25rem" }}>Cargando...</div>
            ) : notifs.length === 0 ? (
              <div style={{ color: "var(--muted)", fontSize: "1.25rem" }}>Sin notificaciones.</div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {notifs.map((n) => (
                  <NotificacionCard key={n.notificacion_id} notif={n} onLeida={handleLeida} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}