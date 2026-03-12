import { useEffect, useState } from "react";
import { getUltimasActualizaciones } from "../../services/profesional/home.service.js";

export default function SecretariaDashboard() {
  const [actualizaciones, setActualizaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUltimasActualizaciones();
        setActualizaciones(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-CL");
  };

  return (
    <div>
      <h3 className="mb-3 perfil-title">Dashboard de Gestión - Profesional de Apoyo</h3>

      <div className="panel-card">
        <div className="mb-3 perfil-title">
          <div style={{ fontWeight: 600, fontSize: 16 }}>
            Últimas Actualizaciones de Académicos
          </div>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            Registros más recientes ingresados por los académicos
          </div>
        </div>

        {loading ? (
          <div style={{ color: "var(--muted)" }}>Cargando...</div>
        ) : error ? (
          <div className="text-danger">{error}</div>
        ) : (
          <div className="table-wrap">
            <div className="table-responsive">
              <table className="table table-dark table-dark-custom align-middle fa-table">
                <thead>
                  <tr>
                    <th>Académico</th>
                    <th>Tipo de Contrato</th>
                    <th>Módulo</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {actualizaciones.map((a, idx) => (
                    <tr key={idx}>
                      <td>{a.nombre_academico}</td>
                      <td>
                        <span className="badge-status badge-aceptado">
                          {a.tipo_contrato || "Sin contrato"}
                        </span>
                      </td>
                      <td>{a.modulo}</td>
                      <td>{formatFecha(a.fecha)}</td>
                    </tr>
                  ))}

                  {actualizaciones.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ color: "var(--muted)" }}>
                        Sin registros recientes.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}