import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar({ collapsed, onToggleSidebar }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const displayName = useMemo(() => {
    if (user?.nombre) return user.nombre;
    return "Usuario";
  }, [user]);

  const displayRole = useMemo(() => {
    if (!user?.rol) return "—";

    if (user.rol === "Secretaria") {
      return "Profesional de Apoyo";
    }

    return user.rol;
  }, [user]);

  const roleIcon = useMemo(() => {
    switch (user?.rol) {
      case "Admin":
        return "bi-shield-lock";
      case "Secretaria":
        return "bi-briefcase";
      case "Academico":
        return "bi-mortarboard";
      default:
        return "bi-person-circle";
    }
  }, [user]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/", { replace: true });
  };

  return (
    <div
      className="topbar px-4 py-3 d-flex align-items-center justify-content-between"
      style={{
        background: "#2a406a",
        borderBottom: "1px solid rgba(0,0,0,.2)",
      }}
    >
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-sm"
          onClick={onToggleSidebar}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,.25)",
            color: "#fff",
          }}
        >
          <i className="bi bi-list fs-5" />
        </button>

        <span
          style={{
            color: "#daa136",
            fontWeight: 600,
            fontSize: "16px",
          }}
        >
          Portal Académico
        </span>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: 38,
              height: 38,
              background: "rgba(255,255,255,.15)",
            }}
          >
            <i className={`bi ${roleIcon} fs-3 text-white`} />
          </div>

          <div style={{ lineHeight: 1.1 }}>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: "14px" }}>
              {displayName}
            </div>
            <div style={{ color: "rgba(255,255,255,.75)", fontSize: "12px" }}>
              {displayRole}
            </div>
          </div>
        </div>

        <button className="btn btn-sm btn-outline-light" onClick={logout}>
          <i className="bi bi-box-arrow-right me-2" />
          Salir
        </button>
      </div>
    </div>
  );
}
