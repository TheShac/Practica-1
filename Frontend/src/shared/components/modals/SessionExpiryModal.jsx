import { useState, useEffect } from "react";

// Muestra un countdown y permite al usuario renovar la sesión o cerrarla
export default function SessionExpiryModal({ show, onRenew, onLogout }) {
  const [segundos, setSegundos] = useState(120);

  useEffect(() => {
    if (!show) { setSegundos(120); return; }

    const interval = setInterval(() => {
      setSegundos((s) => {
        if (s <= 1) { clearInterval(interval); onLogout(); return 0; }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  const mins = Math.floor(segundos / 60);
  const secs = String(segundos % 60).padStart(2, "0");

  return (
    <div
      style={{
        position:       "fixed",
        inset:          0,
        background:     "rgba(0,0,0,.7)",
        zIndex:         2000,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        padding:        "1rem",
      }}
    >
      <div className="panel-card" style={{ maxWidth: 420, width: "100%", margin: 0 }}>
        <div className="d-flex align-items-center gap-2 mb-3">
          <i className="bi bi-clock-history fs-4" style={{ color: "#daa136" }} />
          <h5 className="mb-0" style={{ color: "var(--text)" }}>Sesión por expirar</h5>
        </div>

        <p style={{ color: "var(--muted)", marginBottom: "0.5rem" }}>
          Tu sesión expirará en:
        </p>
        <div
          style={{
            fontSize:    32,
            fontWeight:  700,
            color:       segundos <= 30 ? "#ef4444" : "#daa136",
            marginBottom: "1.5rem",
            textAlign:   "center",
          }}
        >
          {mins}:{secs}
        </div>

        <p style={{ color: "var(--muted)", marginBottom: "1.5rem", fontSize: 14 }}>
          ¿Deseas continuar en la plataforma?
        </p>

        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={onLogout}
          >
            Cerrar sesión
          </button>
          <button
            type="button"
            className="btn btn-sm"
            style={{ borderColor: "#daa136", color: "#daa136" }}
            onClick={onRenew}
          >
            Continuar sesión
          </button>
        </div>
      </div>
    </div>
  );
}