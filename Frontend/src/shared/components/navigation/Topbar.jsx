import { useEffect, useMemo, useState } from "react";
import { useNavigate }                  from "react-router-dom";
import { getCountNoLeidas }             from "@/features/academico/services/notificacion.service.js";
import { logoutRequest }                from "@/core/auth/auth.service.js";

export default function Topbar({ collapsed, onToggleSidebar, noLeidas = 0, onBellClick }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try { setUser(JSON.parse(raw)); }
      catch { setUser(null); }
    }
  }, []);

  const displayName = useMemo(() => user?.nombre || "Usuario", [user]);

  const displayRole = useMemo(() => {
    if (!user?.rol) return "—";
    if (user.rol === "Secretaria") return "Profesional de Apoyo";
    return user.rol;
  }, [user]);

  const roleIcon = useMemo(() => {
    switch (user?.rol) {
      case "Admin":      return "bi-shield-lock";
      case "Secretaria": return "bi-briefcase";
      case "Academico":  return "bi-mortarboard";
      default:           return "bi-person-circle";
    }
  }, [user]);

  const logout = async () => {
    try { await logoutRequest(); } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/", { replace: true });
  };

  return (
    <div
      className="topbar px-3 px-md-4 py-3 d-flex align-items-center justify-content-between"
      style={{ background: "#2a406a", borderBottom: "1px solid rgba(0,0,0,.2)" }}
    >
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-sm"
          onClick={onToggleSidebar}
          style={{ background: "transparent", border: "1px solid rgba(255,255,255,.25)", color: "#fff" }}
        >
          <i className="bi bi-list fs-5" />
        </button>
        {/* Ocultar el título en pantallas muy pequeñas para dar espacio */}
        <span className="d-none d-sm-inline" style={{ color: "#daa136", fontWeight: 600, fontSize: "1rem" }}>
          Portal Académico
        </span>
      </div>

      <div className="d-flex align-items-center gap-2 gap-md-3">

        {/* Badge notificaciones */}
        {onBellClick && (
          <button
            className="btn btn-sm position-relative"
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,.25)", color: "#fff" }}
            onClick={onBellClick}
            title="Notificaciones"
          >
            <i className="bi bi-bell fs-5" />
            {noLeidas > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "0.625rem" }}
              >
                {noLeidas > 99 ? "99+" : noLeidas}
              </span>
            )}
          </button>
        )}

        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{ width: 38, height: 38, background: "rgba(255,255,255,.15)", flexShrink: 0 }}
          >
            <i className={`bi ${roleIcon} fs-3 text-white`} />
          </div>
          {/* Nombre y rol solo visibles en pantallas medianas en adelante */}
          <div className="d-none d-md-block" style={{ lineHeight: 1.1 }}>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.875rem" }}>{displayName}</div>
            <div style={{ color: "rgba(255,255,255,.75)", fontSize: "0.75rem" }}>{displayRole}</div>
          </div>
        </div>

        <button className="btn btn-sm btn-outline-light" onClick={logout} title="Cerrar sesión">
          <i className="bi bi-box-arrow-right" />
          {/* Texto "Salir" solo en pantallas medianas en adelante */}
          <span className="d-none d-md-inline ms-2">Salir</span>
        </button>
      </div>
    </div>
  );
}
