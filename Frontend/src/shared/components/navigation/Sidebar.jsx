import { NavLink } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useMobile } from "@/shared/hooks/useMobile.js";

export default function Sidebar({ collapsed, mobileOpen, onClose }) {
  const isMobile = useMobile();
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
    const academico = [
      { to: "/academico/dashboard", icon: "bi-house", label: "Home" },
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
      { to: "/academico/intervencion", icon: "bi-briefcase", label: "Proyecto de Intervencion" },
      { to: "/academico/consultorias", icon: "bi-briefcase-fill", label: "Consultorías" },
    ];

    const secretaria = [
      { to: "/secretaria/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
      { type: "section", label: "SECRETARÍA" },
      { to: "/secretaria/ficha-academicas", icon: "bi-people", label: "Ficha Académicas" },
      { to: "/secretaria/reportes", icon: "bi-clipboard-data", label: "Reportes" },
      { to: "/secretaria/notificaciones", icon: "bi-bell", label: "Notificaciones" },
    ];

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
    rol === "Secretaria" ? "Profesional de Apoyo" : rol === "Admin" ? "Admin" : "Académico";

  // En móvil el sidebar es un drawer de posición fija.
  // En escritorio es un rail colapsable dentro del flujo normal.
  const showLabels = isMobile ? true : !collapsed;

  const asideStyle = isMobile
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "260px",
        zIndex: 1050,
        transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform .25s ease",
        background: "#2a406a",
        padding: "20px 15px",
        overflowX: "hidden",
        overflowY: "auto",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }
    : {
        width: collapsed ? "80px" : "260px",
        minWidth: collapsed ? "80px" : "260px",
        maxWidth: collapsed ? "80px" : "260px",
        flexShrink: 0,
        background: "#2a406a",
        transition: "width .2s ease, min-width .2s ease, max-width .2s ease",
        height: "100vh",
        position: "sticky",
        top: 0,
        padding: "20px 15px",
        overflowX: "hidden",
        overflowY: "auto",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      };

  const handleNavClick = () => {
    if (isMobile && onClose) onClose();
  };

  return (
    <>
      {/* Overlay oscuro detrás del drawer en móvil */}
      {isMobile && mobileOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 1049,
          }}
        />
      )}

      <aside style={asideStyle}>
        <div className="d-flex align-items-center gap-2 mb-4">
          <img
            src="/logo_UTA.png"
            alt="UTA"
            style={{ width: 42, height: 42, objectFit: "contain", flexShrink: 0 }}
          />

          {showLabels && (
            <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
              <div style={{ color: "#daa136", fontWeight: 700, fontSize: "1rem" }}>
                {title}
              </div>
              <div style={{ color: "#daa136", fontSize: "0.8125rem" }}>
                Portal {title}
              </div>
            </div>
          )}
        </div>

        <nav className="d-flex flex-column gap-2" style={{ flexGrow: 1 }}>
          {menu.map((item, idx) => {
            if (item.type === "section") {
              return (
                showLabels && (
                  <div
                    key={`sec-${idx}`}
                    style={{
                      marginTop: "15px",
                      marginBottom: "5px",
                      fontSize: "0.75rem",
                      letterSpacing: "1px",
                      color: "#daa136",
                      fontWeight: 600,
                      paddingLeft: 10,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
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
                    style={{ color: "#fff", whiteSpace: "nowrap", overflow: "hidden" }}
                  >
                    <i className={`bi ${item.icon}`} style={{ flexShrink: 0 }} />
                    {showLabels && <span>{item.label}</span>}
                  </div>

                  {showLabels && (
                    <div style={{ paddingLeft: "30px" }}>
                      {item.children.map((child) => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          onClick={handleNavClick}
                          className={({ isActive }) =>
                            `d-block px-2 py-1 rounded ${
                              isActive ? "bg-secondary bg-opacity-50" : ""
                            }`
                          }
                          style={{
                            color: "#fff",
                            fontSize: "0.875rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                          }}
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
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `d-flex align-items-center gap-2 px-3 py-2 rounded ${
                    isActive ? "bg-secondary bg-opacity-50" : ""
                  }`
                }
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                <i className={`bi ${item.icon}`} style={{ flexShrink: 0 }} />
                {showLabels && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {showLabels && (
          <div
            style={{
              marginTop: "20px",
              paddingTop: "12px",
              borderTop: "1px solid rgba(255,255,255,0.15)",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.65)",
              lineHeight: "1.4",
            }}
          >
            <div style={{ marginBottom: "6px" }}>
              <strong>Creado por</strong><br />
              Trinidad Aguirre L.<br />
              Profesional – Postgrado Historia
            </div>

            <div>
              <strong>Desarrollado por</strong><br />
              Leonardo Rodríguez L.<br />
              Isabel Condori G.
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
