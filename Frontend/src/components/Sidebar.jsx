import { NavLink } from "react-router-dom";

export default function Sidebar({ collapsed }) {
  return (
    <aside
      style={{
        width: collapsed ? "80px" : "260px",
        background: "#2a406a",
        transition: "all .2s ease",
        minHeight: "100vh",
        padding: "20px 15px",
      }}
    >
      {/* LOGO + TITULO */}
      <div className="d-flex align-items-center gap-2 mb-4">
        <img
          src="/logo_UTA.png"
          alt="UTA"
          style={{
            width: 42,
            height: 42,
            objectFit: "contain",
          }}
        />

        {!collapsed && (
          <div>
            <div
              style={{
                color: "#daa136",
                fontWeight: 700,
                fontSize: "16px",
              }}
            >
              Académico
            </div>

            <div
              style={{
                color: "#daa136",
                fontSize: "13px",
              }}
            >
              Portal Académico
            </div>
          </div>
        )}
      </div>

      {/* MENU */}
      <nav className="d-flex flex-column gap-2">

        <NavLink
          to="/academico/dashboard"
          className={({ isActive }) =>
            `d-flex align-items-center gap-2 px-3 py-2 rounded ${
              isActive ? "bg-secondary bg-opacity-50" : ""
            }`
          }
          style={{ color: "#fff", textDecoration: "none" }}
        >
          <i className="bi bi-speedometer2" />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/academico/perfil"
          className={({ isActive }) =>
            `d-flex align-items-center gap-2 px-3 py-2 rounded ${
              isActive ? "bg-secondary bg-opacity-50" : ""
            }`
          }
          style={{ color: "#fff", textDecoration: "none" }}
        >
          <i className="bi bi-person" />
          {!collapsed && <span>Perfil</span>}
        </NavLink>

        {!collapsed && (
          <div
            style={{
              marginTop: "15px",
              marginBottom: "5px",
              fontSize: "14px",
              letterSpacing: "1px",
              color: "#daa136",
              fontWeight: 600,
            }}
          >
            ACADÉMICO
          </div>
        )}

        <NavLink
          to="/academico/tesis"
          className={({ isActive }) =>
            `d-flex align-items-center gap-2 px-3 py-2 rounded ${
              isActive ? "bg-secondary bg-opacity-50" : ""
            }`
          }
          style={{ color: "#fff", textDecoration: "none" }}
        >
          <i className="bi bi-journal-text" />
          {!collapsed && <span>Tesis</span>}
        </NavLink>

        <NavLink
          to="/academico/publicaciones"
          className={({ isActive }) =>
            `d-flex align-items-center gap-2 px-3 py-2 rounded ${
              isActive ? "bg-secondary bg-opacity-50" : ""
            }`
          }
          style={{ color: "#fff", textDecoration: "none" }}
        >
          <i className="bi bi-file-earmark-text" />
          {!collapsed && <span>Publicaciones</span>}
        </NavLink>

      </nav>
    </aside>
  );
}
