import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    // “Simulación” de sesión: por ahora siempre entra como académico
    localStorage.setItem("role", "academico");
    navigate("/academico/dashboard");
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center px-3"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="w-100"
        style={{
          maxWidth: 1050,
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 18,
          overflow: "hidden",
        }}
      >
        <div className="row g-0">
          {/* IZQUIERDA: FORM */}
          <div className="col-12 col-lg-6 p-4 p-lg-5">
            <div className="d-flex align-items-center gap-3 mb-4">
              <img
                src="/logo_UTA.png"
                alt="UTA"
                style={{ width: 54, height: 54, objectFit: "contain" }}
              />

              <div>
                <div
                  className="fw-bold"
                  style={{ color: "#daa136", fontSize: 18 }}
                >
                  Sistema de Acreditación
                </div>
                <div style={{ color: "var(--muted)" }}>
                  Ingreso (solo visual)
                </div>
              </div>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label" style={{ color: "var(--muted)" }}>
                  Rut*
                </label>
                <input
                  className="form-control input-dark"
                  placeholder="20.123.456-7"
                />
              </div>

              <div className="mb-2">
                <label className="form-label" style={{ color: "var(--muted)" }}>
                  Clave*
                </label>

                <div className="input-group">
                  <input
                    type={showPass ? "text" : "password"}
                    className="form-control input-dark"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="input-group-text input-dark"
                    onClick={() => setShowPass((v) => !v)}
                    style={{ cursor: "pointer" }}
                    aria-label="Mostrar/Ocultar clave"
                    title="Mostrar/Ocultar clave"
                  >
                    <i className={`bi ${showPass ? "bi-eye-slash" : "bi-eye"}`} />
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <a href="#" style={{ color: "#daa136", fontSize: 14 }}>
                  ¿Olvidó su clave?
                </a>
              </div>

              <button
                className="btn w-100 py-2"
                type="submit"
                style={{
                  background: "#daa136",
                  color: "#0c1222",
                  fontWeight: 700,
                  borderRadius: 10,
                }}
              >
                Iniciar sesión
              </button>

              <div className="text-center my-3" style={{ color: "var(--muted)" }}>
                o iniciar sesión con
              </div>

              <button
                className="btn w-100 py-2"
                type="button"
                onClick={handleLogin}
                style={{
                  background: "#b02b2b",
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: 10,
                }}
              >
                Gmail Institucional
              </button>

              <div className="mt-3" style={{ color: "var(--muted)", fontSize: 13 }}>
                *Por ahora no valida credenciales, solo navega al Dashboard.
              </div>
            </form>
          </div>

          {/* DERECHA: INFO */}
          <div
            className="col-12 col-lg-6 p-4 p-lg-5"
            style={{
              borderLeft: "1px solid var(--border)",
              background: "rgba(0,0,0,.12)",
            }}
          >
            <div className="mb-4">
              <div className="fw-bold mb-2" style={{ color: "#daa136" }}>
                Plataformas de Apoyo a la Docencia
              </div>

              <div className="d-flex gap-2 flex-wrap">
                <span
                  className="px-3 py-2 rounded"
                  style={{
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    background: "rgba(255,255,255,.04)",
                  }}
                >
                  DIDO
                </span>
                <span
                  className="px-3 py-2 rounded"
                  style={{
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    background: "rgba(255,255,255,.04)",
                  }}
                >
                  UTA Med
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="fw-bold mb-2" style={{ color: "#daa136" }}>
                Política de Privacidad
              </div>
              <div style={{ color: "var(--muted)" }}>
                Conoce las políticas de privacidad del sitio web de la Universidad.
                <span className="ms-2" style={{ color: "#daa136" }}>Leer más</span>
              </div>
            </div>

            <div>
              <div className="fw-bold mb-2" style={{ color: "#daa136" }}>
                Solicita Ayuda
              </div>
              <div style={{ color: "var(--muted)" }}>
                Correo: <span style={{ color: "#daa136" }}>Ver Contactos</span>
                <br />
                Horario: Lunes a Jueves 08:30 - 17:30
                <br />
                Viernes 08:30 - 16:30
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
