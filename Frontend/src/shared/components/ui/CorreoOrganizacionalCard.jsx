import { useEffect, useState } from "react";
import {
  getEstadoCorreo, registrarCorreo, confirmarCodigo, reenviarCodigo,
} from "@/core/auth/email-verification.service.js";

export default function CorreoOrganizacionalCard() {
  const [loading, setLoading] = useState(true);
  const [estado, setEstado]   = useState({ correo: null, verificado: false });

  const [correoInput, setCorreoInput] = useState("");
  const [codigoInput, setCodigoInput] = useState("");

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

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
    setEstado({ correo: null, verificado: false });
  };

  if (loading) {
    return (
      <div className="perfil-card">
        <h2>Correo Organizacional</h2>
        <p>Cargando...</p>
      </div>
    );
  }

  const vista = !estado.correo ? "registrar" : estado.verificado ? "verificado" : "confirmar";

  return (
    <div className="perfil-card">
      <h2>Correo Organizacional</h2>

      {error && <p style={{ color: "#c0392b" }}>{error}</p>}
      {aviso && <p style={{ color: "#daa136" }}>{aviso}</p>}

      {vista === "verificado" && (
        <>
          <div className="perfil-grid">
            <div className="form-group">
              <label>Correo verificado</label>
              <input value={estado.correo} disabled />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <input value="Verificado ✓" disabled />
            </div>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={iniciarCambioDeCorreo}
            style={{ marginTop: "10px" }}
          >
            Cambiar correo
          </button>
        </>
      )}

      {vista === "registrar" && (
        <form onSubmit={handleRegistrar}>
          <div className="form-group">
            <label>Correo organizacional (dominio institucional)</label>
            <input
              type="email"
              placeholder="tucorreo@academicos.uta.cl"
              value={correoInput}
              onChange={(e) => setCorreoInput(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar código de verificación"}
          </button>
        </form>
      )}

      {vista === "confirmar" && (
        <>
          <p>
            Enviamos un código de 6 dígitos a <strong>{estado.correo}</strong>. Ingrésalo para
            verificarlo.
          </p>
          <form onSubmit={handleConfirmar}>
            <div className="form-group">
              <label>Código de verificación</label>
              <input
                placeholder="000000"
                maxLength={6}
                value={codigoInput}
                onChange={(e) => setCodigoInput(e.target.value.replace(/\D/g, ""))}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={enviando || codigoInput.length !== 6}
            >
              {enviando ? "Verificando..." : "Verificar código"}
            </button>
          </form>
          <div style={{ marginTop: "10px", display: "flex", gap: "12px" }}>
            <button type="button" className="btn-primary" onClick={handleReenviar} disabled={enviando}>
              Reenviar código
            </button>
            <button type="button" className="btn-danger-soft" onClick={iniciarCambioDeCorreo}>
              Cambiar correo
            </button>
          </div>
        </>
      )}
    </div>
  );
}