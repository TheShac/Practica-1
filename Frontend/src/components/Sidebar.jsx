import { NavLink } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

export default function Sidebar({ collapsed }) {
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

  const rol = user?.rol || "Academico";

  const menu = useMemo(() => {
    // Menú Académico
    const academico = [
      { to: "/academico/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
      { to: "/academico/perfil", icon: "bi-person", label: "Perfil" },
      { type: "section", label: "ACADÉMICO" },
      {
        type: "submenu",
        icon: "bi-journal-text",
        label: "Tesis",
        children: [
          { to: "/academico/tesis/magister", label: "Magíster" },
          { to: "/academico/tesis/doctorado", label: "Doctorado" },
        ],
      },
      { to: "/academico/publicaciones", icon: "bi-file-earmark-text", label: "Publicaciones" },
      { to: "/academico/libros", icon: "bi-book", label: "Libros" },
      { to: "/academico/cap-libro", icon: "bi-journal-bookmark", label: "Capítulos de libro" },
      { to: "/academico/investigacion", icon: "bi-diagram-3", label: "Investigación" },
      { to: "/academico/patentes", icon: "bi-award", label: "Patentes" },
      { to: "/academico/intervencion", icon: "bi-briefcase", label: "Proyecto de Intervencion"},
    ];

    // Menú Secretaria
    const secretaria = [
      { to: "/secretaria/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
      { type: "section", label: "SECRETARÍA" },
      { to: "/secretaria/ficha-academicas", icon: "bi-people", label: "Ficha Académicas" },
      { to: "/secretaria/reportes", icon: "bi-clipboard-data", label: "Reportes" },
      { to: "/secretaria/notificaciones", icon: "bi-bell", label: "Notificaciones" },
    ];

    // Menú Admin
    const admin = [
      { to: "/admin/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
      { type: "section", label: "ADMIN" },
      { to: "/admin/usuarios", icon: "bi-person-gear", label: "Usuarios" },
      { to: "/admin/roles", icon: "bi-shield-lock", label: "Roles" },
    ];

    if (rol === "Secretaria") return secretaria;
    if (rol === "Admin") return admin;
    return academico;
  }, [rol]);

  const title =
    rol === "Secretaria" ? "Secretaría" : rol === "Admin" ? "Admin" : "Académico";

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
      <div className="d-flex align-items-center gap-2 mb-4">
        <img
          src="/logo_UTA.png"
          alt="UTA"
          style={{ width: 42, height: 42, objectFit: "contain" }}
        />

        {!collapsed && (
          <div>
            <div style={{ color: "#daa136", fontWeight: 700, fontSize: "16px" }}>
              {title}
            </div>
            <div style={{ color: "#daa136", fontSize: "13px" }}>
              Portal {title}
            </div>
          </div>
        )}
      </div>

      <nav className="d-flex flex-column gap-2">
        {menu.map((item, idx) => {
          if (item.type === "section") {
            return (
              !collapsed && (
                <div
                  key={`sec-${idx}`}
                  style={{
                    marginTop: "15px",
                    marginBottom: "5px",
                    fontSize: "11px",
                    letterSpacing: "1px",
                    color: "#daa136",
                    fontWeight: 600,
                    paddingLeft: 10,
                  }}
                >
                  {item.label}
                </div>
              )
            );
          }

          if (item.type === "submenu") {
            return (
              <div key={`submenu-${idx}`}>
                <div
                  className="d-flex align-items-center gap-2 px-3 py-2 rounded"
                  style={{ color: "#fff" }}
                >
                  <i className={`bi ${item.icon}`} />
                  {!collapsed && <span>{item.label}</span>}
                </div>

                {!collapsed && (
                  <div style={{ paddingLeft: "30px" }}>
                    {item.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        className={({ isActive }) =>
                          `d-block px-2 py-1 rounded ${
                            isActive ? "bg-secondary bg-opacity-50" : ""
                          }`
                        }
                        style={{ color: "#fff", fontSize: "14px" }}
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `d-flex align-items-center gap-2 px-3 py-2 rounded ${
                  isActive ? "bg-secondary bg-opacity-50" : ""
                }`
              }
              style={{ color: "#fff", textDecoration: "none" }}
            >
              <i className={`bi ${item.icon}`} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}