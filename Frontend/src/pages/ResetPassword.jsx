import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { passwordResetConfirmarRequest } from "@/core/auth/auth.service.js";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (nuevaPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (nuevaPassword !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await passwordResetConfirmarRequest({ token, nuevaPassword });
      navigate("/?reset=ok", { replace: true });
    } catch (err) {
      setError(err?.message || "El enlace es inválido o ya expiró. Solicita uno nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center px-3"
        style={{ background: "var(--bg)" }}
      >
        <div
          className="w-100 text-center"
          style={{
            maxWidth: 420,
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 18,
            padding: 32,
            color: "var(--muted)",
          }}
        >
          <p>Este enlace no es válido.</p>
          <Link to="/olvide-password" style={{ color: "#daa136" }}>
            Solicitar un nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center px-3"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="w-100"
        style={{
          maxWidth: 420,
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 18,
          padding: 32,
        }}
      >
        <div className="mb-4">
          <div className="fw-bold" style={{ color: "#daa136", fontSize: 18 }}>
            Postgrado de Historia
          </div>
          <div style={{ color: "var(--muted)" }}>Elige tu nueva contraseña</div>
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

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Nueva contraseña*
            </label>
            <div className="input-group">
              <input
                type={showPass ? "text" : "password"}
                className="form-control input-dark"
                placeholder="••••••••"
                value={nuevaPassword}
                onChange={(e) => {
                  if (error) setError("");
                  setNuevaPassword(e.target.value);
                }}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="input-group-text input-dark"
                onClick={() => setShowPass((v) => !v)}
                style={{
                  cursor: "pointer",
                  background: "transparent",
                  border: "1px solid var(--border)",
                  borderLeft: "none",
                  color: "var(--muted)",
                }}
              >
                <i className={`bi ${showPass ? "bi-eye" : "bi-eye-slash"}`} />
              </button>
            </div>
            <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>
              Mínimo 8 caracteres.
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Confirmar contraseña*
            </label>
            <input
              type={showPass ? "text" : "password"}
              className="form-control input-dark"
              placeholder="••••••••"
              value={confirmarPassword}
              onChange={(e) => {
                if (error) setError("");
                setConfirmarPassword(e.target.value);
              }}
              autoComplete="new-password"
            />
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
            {loading ? "Guardando..." : "Guardar nueva contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}