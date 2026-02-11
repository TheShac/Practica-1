import { useNavigate } from "react-router-dom";

export default function Topbar({ collapsed, onToggleSidebar }) {
  const navigate = useNavigate();

  const user = {
    name: "Juan García",
    role: "Académico",
    avatar: "https://i.pravatar.cc/100?img=12", // puedes cambiar por imagen en /public
  };

  const logout = () => {
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div
      className="topbar px-4 py-3 d-flex align-items-center justify-content-between"
      style={{
        background: "#2a406a",
        borderBottom: "1px solid rgba(0,0,0,.2)",
      }}
    >
      {/* IZQUIERDA */}
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

      {/* DERECHA */}
      <div className="d-flex align-items-center gap-3">
        <div className="d-flex align-items-center gap-2">
          <img
            src={user.avatar}
            alt="avatar"
            className="rounded-circle"
            style={{
              width: 38,
              height: 38,
              objectFit: "cover",
            }}
          />

          <div style={{ lineHeight: 1.1 }}>
            <div
              style={{
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              {user.name}
            </div>

            <div
              style={{
                color: "rgba(255,255,255,.75)",
                fontSize: "12px",
              }}
            >
              {user.role}
            </div>
          </div>
        </div>

        <button
          className="btn btn-sm btn-outline-light"
          onClick={logout}
        >
          <i className="bi bi-box-arrow-right me-2" />
          Salir
        </button>
      </div>
    </div>
  );
}
