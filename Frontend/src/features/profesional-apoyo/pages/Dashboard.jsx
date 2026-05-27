import { useEffect, useState } from "react";
import { getUltimasActualizaciones } from "@/features/profesional-apoyo/services/home.service.js";

function ContratoBadges({ tipo_contrato }) {
  if (!tipo_contrato) {
    return <span style={{ color: "var(--muted)" }}>Sin programa</span>;
  }

  const badges = tipo_contrato.split(", ").map((item) => {
    const [programa, tipo] = item.split(" - ");
    const isDoctorado = programa?.toUpperCase().includes("DOCTORADO");

    return (
      <span
        key={item}
        className={`badge-status ${isDoctorado ? "badge-aceptado" : "badge-aceptado"}`}
        style={{ display: "inline-block", marginRight: 4 }}
      >
        {item}
      </span>
    );
  });

  return <div className="d-flex flex-wrap gap-1">{badges}</div>;
}

export default function SecretariaDashboard() {
  const [actualizaciones, setActualizaciones] = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState("");

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
    return new Date(fecha).toLocaleDateString("es-CL", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
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
            Registros más recientes creados o editados por los académicos
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
                    <th>Programa / Tipo</th>
                    <th>Módulo</th>
                    <th>Acción</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {actualizaciones.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ color: "var(--muted)" }}>
                        Sin registros recientes.
                      </td>
                    </tr>
                  ) : (
                    actualizaciones.map((a, idx) => (
                      <tr key={idx}>
                        <td>{a.nombre_academico}</td>
                        <td>
                          <ContratoBadges tipo_contrato={a.tipo_contrato} />
                        </td>
                        <td>{a.modulo}</td>
                        <td>
                          <span className={`badge-status ${a.accion === "Creado" ? "badge-aceptado" : "badge-revision"}`}>
                            {a.accion}
                          </span>
                        </td>
                        <td>{formatFecha(a.fecha)}</td>
                      </tr>
                    ))
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