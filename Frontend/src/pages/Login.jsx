import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { loginRequest } from "../services/api.js";
import { formatRut, looksLikeEmail } from "../utils/rut.js";

export default function Login() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectByRole = (rol) => {
    if (rol === "Admin") return navigate("/admin/dashboard");
    if (rol === "Secretaria") return navigate("/secretaria/dashboard");
    return navigate("/academico/dashboard"); // default Academico
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token, user } = await loginRequest({ identifier, password });

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.rol?.toLowerCase() || "");

      redirectByRole(user.rol);
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
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
          {/* IZQUIERDA */}
          <div className="col-12 col-lg-6 p-4 p-lg-5">
            <div className="d-flex align-items-center gap-3 mb-4">
              <img
                src="/logo_UTA.png"
                alt="UTA"
                style={{ width: 54, height: 54, objectFit: "contain" }}
              />

              <div>
                <div className="fw-bold" style={{ color: "#daa136", fontSize: 18 }}>
                  Sistema de Acreditación
                </div>
                <div style={{ color: "var(--muted)" }}>Ingreso</div>
              </div>
            </div>

            {error && (
              <div
                className="alert py-2"
                style={{
                  background: "rgba(220,53,69,.12)",
                  border: "1px solid rgba(220,53,69,.35)",
                  color: "#fff",
                  borderRadius: 12,
                }}
              >
                <i className="bi bi-exclamation-triangle me-2" />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label" style={{ color: "var(--muted)" }}>
                  Rut o correo*
                </label>
                <input
                  className="form-control input-dark"
                  placeholder="12.345.678-9 o correo@uta.cl"
                  value={identifier}
                  onChange={(e) => {
                    const raw = e.target.value;

                    if (looksLikeEmail(raw)) {
                      setIdentifier(raw);
                      return;
                    }

                    setIdentifier(formatRut(raw));
                  }}
                  onBlur={() => {
                    if (!looksLikeEmail(identifier)) {
                      setIdentifier(formatRut(identifier));
                    }
                  }}
                  autoComplete="username"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
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
                disabled={loading}
                style={{
                  background: "#daa136",
                  color: "#0c1222",
                  fontWeight: 700,
                  borderRadius: 10,
                  opacity: loading ? 0.85 : 1,
                }}
              >
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </button>

              <div className="text-center my-3" style={{ color: "var(--muted)" }}>
                o iniciar sesión con
              </div>

              <button
                className="btn w-100 py-2"
                type="button"
                disabled
                style={{
                  background: "#b02b2b",
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: 10,
                  opacity: 0.65,
                  cursor: "not-allowed",
                }}
                title="Más adelante"
              >
                Gmail Institucional
              </button>

              <div className="mt-3" style={{ color: "var(--muted)", fontSize: 13 }}>
                Cuenta Secretaria: secretaria@uta.cl / Secretaria123* <br/>
                Cuenta Academico: academico@uta.cl / Academico123*
              </div>
              
            </form>
          </div>

          {/* DERECHA */}
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
                <span className="ms-2" style={{ color: "#daa136" }}>
                  Leer más
                </span>
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
