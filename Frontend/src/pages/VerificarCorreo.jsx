import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getEstadoCorreo, registrarCorreo, confirmarCodigo, reenviarCodigo,
} from "@/core/auth/email-verification.service.js";

const RUTA_POR_ROL = {
  admin: "/admin/dashboard",
  secretaria: "/secretaria/dashboard",
  academico: "/academico/dashboard",
};

function rutaVolver() {
  const rol = localStorage.getItem("role");
  return RUTA_POR_ROL[rol] || "/";
}

export default function VerificarCorreo() {
  const [loading, setLoading] = useState(true);
  const [estado, setEstado]   = useState({ correo: null, verificado: false });

  const [correoInput, setCorreoInput] = useState("");
  const [codigoInput, setCodigoInput] = useState("");

  const [enviando, setEnviando] = useState(false);
  const [error, setError]     = useState("");
  const [aviso, setAviso]     = useState("");

  const cargarEstado = async () => {
    try {
      const data = await getEstadoCorreo();
      setEstado(data);
    } catch (err) {
      setError(err.message || "No se pudo cargar el estado del correo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEstado();
  }, []);

  const handleRegistrar = async (e) => {
    e.preventDefault();
    setError("");
    setAviso("");
    setEnviando(true);
    try {
      const data = await registrarCorreo(correoInput);
      setEstado({ correo: data.correo, verificado: false });
      setCodigoInput("");
      setAviso("Te enviamos un código de verificación a tu correo.");
    } catch (err) {
      setError(err.message || "No se pudo registrar el correo.");
    } finally {
      setEnviando(false);
    }
  };

  const handleConfirmar = async (e) => {
    e.preventDefault();
    setError("");
    setAviso("");
    setEnviando(true);
    try {
      await confirmarCodigo(codigoInput);
      setEstado((prev) => ({ ...prev, verificado: true }));
      setAviso("¡Correo verificado correctamente!");
    } catch (err) {
      setError(err.message || "No se pudo verificar el código.");
    } finally {
      setEnviando(false);
    }
  };

  const handleReenviar = async () => {
    setError("");
    setAviso("");
    setEnviando(true);
    try {
      const data = await reenviarCodigo();
      setAviso(`Nuevo código enviado. Reenvíos restantes: ${data.intentosRestantes}.`);
    } catch (err) {
      setError(err.message || "No se pudo reenviar el código.");
    } finally {
      setEnviando(false);
    }
  };

  const iniciarCambioDeCorreo = () => {
    setCorreoInput("");
    setError("");
    setAviso("");
    // "Truco" de estado: forzamos la vista de registro sin perder el
    // correo actual en el backend hasta que se confirme uno nuevo.
    setEstado({ correo: null, verificado: false });
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "var(--bg)" }}>
        <div style={{ color: "var(--muted)" }}>Cargando...</div>
      </div>
    );
  }

  // Determina qué formulario mostrar según el estado actual.
  const vista = !estado.correo ? "registrar" : estado.verificado ? "verificado" : "confirmar";

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center px-3"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="w-100"
        style={{
          maxWidth: 440,
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
          <div style={{ color: "var(--muted)" }}>Correo organizacional</div>
        </div>

        {error && (
          <div
            className="alert py-2"
            style={{ background: "rgba(220,53,69,.12)", border: "1px solid rgba(220,53,69,.35)", color: "#fff", borderRadius: 12 }}
          >
            <i className="bi bi-exclamation-triangle me-2" />
            {error}
          </div>
        )}
        {aviso && (
          <div
            className="alert py-2"
            style={{ background: "rgba(218,161,54,.12)", border: "1px solid rgba(218,161,54,.35)", color: "#fff", borderRadius: 12 }}
          >
            <i className="bi bi-check-circle me-2" />
            {aviso}
          </div>
        )}

        {/* ── Ya verificado ─────────────────────────────────────────── */}
        {vista === "verificado" && (
          <>
            <p style={{ color: "var(--muted)" }}>
              Tu correo organizacional verificado es:
            </p>
            <div className="fw-semibold mb-3">{estado.correo}</div>
            <div className="d-flex align-items-center gap-2 mb-4" style={{ color: "#28a745" }}>
              <i className="bi bi-patch-check-fill" />
              Verificado
            </div>
            <button className="btn btn-outline-secondary btn-sm" onClick={iniciarCambioDeCorreo}>
              Cambiar correo
            </button>
          </>
        )}

        {/* ── Registrar correo (primera vez o cambio) ──────────────────── */}
        {vista === "registrar" && (
          <form onSubmit={handleRegistrar}>
            <p style={{ color: "var(--muted)" }}>
              Ingresa tu correo institucional. Debe pertenecer a un dominio autorizado
              (ej. @academicos.uta.cl, @gestion.uta.cl).
            </p>
            <div className="mb-3">
              <label className="form-label" style={{ color: "var(--muted)" }}>Correo organizacional*</label>
              <input
                type="email"
                className="form-control input-dark"
                placeholder="tucorreo@academicos.uta.cl"
                value={correoInput}
                onChange={(e) => setCorreoInput(e.target.value)}
                required
              />
            </div>
            <button
              className="btn w-100 py-2"
              type="submit"
              disabled={enviando}
              style={{ background: "#daa136", color: "#0c1222", fontWeight: 700, borderRadius: 10, opacity: enviando ? 0.85 : 1 }}
            >
              {enviando ? "Enviando..." : "Enviar código de verificación"}
            </button>
          </form>
        )}

        {/* ── Confirmar código ──────────────────────────────────────── */}
        {vista === "confirmar" && (
          <>
            <p style={{ color: "var(--muted)" }}>
              Enviamos un código de 6 dígitos a <strong>{estado.correo}</strong>.
              Ingrésalo para verificar tu correo.
            </p>
            <form onSubmit={handleConfirmar}>
              <div className="mb-3">
                <label className="form-label" style={{ color: "var(--muted)" }}>Código de verificación*</label>
                <input
                  className="form-control input-dark text-center"
                  style={{ letterSpacing: 6, fontSize: 20 }}
                  placeholder="000000"
                  maxLength={6}
                  value={codigoInput}
                  onChange={(e) => setCodigoInput(e.target.value.replace(/\D/g, ""))}
                  required
                />
              </div>
              <button
                className="btn w-100 py-2 mb-2"
                type="submit"
                disabled={enviando || codigoInput.length !== 6}
                style={{ background: "#daa136", color: "#0c1222", fontWeight: 700, borderRadius: 10, opacity: enviando ? 0.85 : 1 }}
              >
                {enviando ? "Verificando..." : "Verificar código"}
              </button>
            </form>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <button className="btn btn-link p-0" style={{ color: "var(--muted)", fontSize: 14 }} onClick={handleReenviar} disabled={enviando}>
                Reenviar código
              </button>
              <button className="btn btn-link p-0" style={{ color: "var(--muted)", fontSize: 14 }} onClick={iniciarCambioDeCorreo}>
                Cambiar correo
              </button>
            </div>
          </>
        )}

        <div className="mt-4">
          <Link to={rutaVolver()} style={{ color: "var(--muted)", fontSize: 14 }}>
            ← Volver
          </Link>
        </div>
      </div>
    </div>
  );
}