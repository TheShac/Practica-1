import { useState } from "react";
import { Link } from "react-router-dom";
import { passwordResetSolicitarRequest } from "@/core/auth/auth.service.js";
import { formatRut } from "@/shared/utils/rut.js";

export default function ForgotPassword() {
  const [rut, setRut] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { mensaje } = await passwordResetSolicitarRequest({ rut });
      setMensaje(mensaje);
      setEnviado(true);
    } catch {
      setMensaje("No se pudo procesar la solicitud. Intenta nuevamente.");
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
          <div style={{ color: "var(--muted)" }}>Recuperar contraseña</div>
        </div>

        {enviado ? (
          <>
            <div
              className="alert py-2"
              style={{
                background: "rgba(218,161,54,.12)",
                border: "1px solid rgba(218,161,54,.35)",
                color: "#fff",
                borderRadius: 12,
              }}
            >
              <i className="bi bi-envelope-check me-2" />
              {mensaje}
            </div>
            <Link to="/" style={{ color: "#daa136", fontSize: 14 }}>
              Volver al inicio de sesión
            </Link>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ color: "var(--muted)", fontSize: 14 }}>
              Ingresa tu RUT y, si tu cuenta tiene un correo verificado, te enviaremos un enlace
              para elegir una nueva contraseña.
            </p>

            {mensaje && (
              <div
                className="alert py-2"
                style={{
                  background: "rgba(220,53,69,.12)",
                  border: "1px solid rgba(220,53,69,.35)",
                  color: "#fff",
                  borderRadius: 12,
                }}
              >
                {mensaje}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label" style={{ color: "var(--muted)" }}>
                Rut*
              </label>
              <input
                className="form-control input-dark"
                placeholder="12.345.678-9"
                value={rut}
                onChange={(e) => setRut(formatRut(e.target.value))}
                autoComplete="username"
              />
            </div>

            <button
              className="btn w-100 py-2"
              type="submit"
              disabled={loading || !rut}
              style={{
                background: "#daa136",
                color: "#0c1222",
                fontWeight: 700,
                borderRadius: 10,
                opacity: loading ? 0.85 : 1,
              }}
            >
              {loading ? "Enviando..." : "Enviar enlace de recuperación"}
            </button>

            <div className="text-center mt-3">
              <Link to="/" style={{ color: "var(--muted)", fontSize: 14 }}>
                Volver al inicio de sesión
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}