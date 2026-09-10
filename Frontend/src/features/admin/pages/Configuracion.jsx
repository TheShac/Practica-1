import { useEffect, useState } from "react";
import Toast from "@/shared/components/ui/feedback/Toast";
import {
  getConfiguracion, actualizarConfiguracion,
  getDominios, agregarDominio, eliminarDominio,
} from "@/features/admin/services/configuracion.service.js";

const CAMPOS = [
  { clave: "remitente_correo", label: "Correo remitente", tipo: "email", placeholder: "no-reply@uta.cl" },
  { clave: "remitente_nombre", label: "Nombre del remitente", tipo: "text", placeholder: "Postgrado en Historia UTA" },
  { clave: "expiracion_codigo_min", label: "Expiración del código de verificación (min)", tipo: "number" },
  { clave: "limite_reenvios", label: "Límite de reenvíos", tipo: "number" },
  { clave: "expiracion_reset_min", label: "Expiración del enlace de recuperación (min)", tipo: "number" },
];

export default function Configuracion() {
  const [config, setConfig]       = useState({});
  const [dominios, setDominios]   = useState([]);
  const [nuevoDominio, setNuevoDominio] = useState("");
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const load = async () => {
    const [cfg, doms] = await Promise.all([getConfiguracion(), getDominios()]);
    setConfig(cfg);
    setDominios(doms);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await load();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (clave, valor) => {
    setConfig((prev) => ({ ...prev, [clave]: valor }));
  };

  const guardarConfig = async () => {
    setSaving(true);
    try {
      const actualizado = await actualizarConfiguracion(config);
      setConfig(actualizado);
      setToast({ show: true, message: "Configuración guardada correctamente", type: "success" });
    } catch (err) {
      setToast({ show: true, message: err.message, type: "danger" });
    } finally {
      setSaving(false);
    }
  };

  const handleAgregarDominio = async (e) => {
    e.preventDefault();
    if (!nuevoDominio.trim()) return;
    try {
      const actualizado = await agregarDominio(nuevoDominio.trim());
      setDominios(actualizado);
      setNuevoDominio("");
    } catch (err) {
      setToast({ show: true, message: err.message, type: "danger" });
    }
  };

  const handleEliminarDominio = async (id) => {
    if (!confirm("¿Eliminar este dominio de la lista permitida? Los usuarios con ese dominio dejarán de poder registrar correo o iniciar sesión con Google.")) return;
    try {
      const actualizado = await eliminarDominio(id);
      setDominios(actualizado);
    } catch (err) {
      setToast({ show: true, message: err.message, type: "danger" });
    }
  };

  if (loading) return <div style={{ color: "var(--muted)" }}>Cargando...</div>;

  return (
    <div>
      <h3 className="mb-3 perfil-title">Configuración</h3>

      <div className="panel-card mb-4">
        <div className="mb-3" style={{ color: "var(--muted)" }}>
          Remitente, tiempos de expiración y límites de reenvío. Los cambios aplican de inmediato,
          sin necesidad de reiniciar el sistema.
        </div>

        <div className="row g-3">
          {CAMPOS.map((campo) => (
            <div className="col-12 col-md-6" key={campo.clave}>
              <label className="form-label" style={{ color: "var(--muted)" }}>{campo.label}</label>
              <input
                type={campo.tipo}
                className="form-control input-dark"
                placeholder={campo.placeholder}
                value={config[campo.clave] ?? ""}
                onChange={(e) => handleChange(campo.clave, e.target.value)}
              />
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary btn-sm mt-3"
          onClick={guardarConfig}
          disabled={saving}
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>

      <div className="panel-card">
        <div className="mb-3" style={{ color: "var(--muted)" }}>
          Dominios institucionales permitidos (correo organizacional y login con Google)
        </div>

        <form className="d-flex align-items-center gap-2 mb-3" onSubmit={handleAgregarDominio}>
          <input
            className="form-control input-dark"
            placeholder="nuevo-dominio.uta.cl"
            value={nuevoDominio}
            onChange={(e) => setNuevoDominio(e.target.value)}
            style={{ padding: "6px 12px", fontSize: 14 }}
          />
          <button
            className="btn btn-primary"
            type="submit"
            style={{ padding: "6px 16px", fontSize: 14, fontWeight: 700, borderRadius: 10, whiteSpace: "nowrap" }}
          >
            <i className="bi bi-plus-lg me-1" />
            Agregar
          </button>
        </form>

        <table className="table table-dark table-dark-custom align-middle mb-0">
          <thead>
            <tr>
              <th>Dominio</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dominios.length === 0 ? (
              <tr>
                <td colSpan={2} style={{ color: "var(--muted)" }}>Sin dominios configurados.</td>
              </tr>
            ) : (
              dominios.map((d) => (
                <tr key={d.dominio_id}>
                  <td>{d.dominio}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleEliminarDominio(d.dominio_id)}
                    >
                      <i className="bi bi-trash me-1" />
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}