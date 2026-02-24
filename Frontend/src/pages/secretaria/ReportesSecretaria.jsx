import React, { useEffect, useMemo, useState } from "react";
import { getReporteGeneral } from "../../services/reporteGeneral.service";

export default function ReportesSecretaria() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getReporteGeneral();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const claustro = useMemo(
    () => data.filter(a => a.tipo_academico === "Claustro"),
    [data]
  );

  const colaboradores = useMemo(
    () => data.filter(a => a.tipo_academico === "Colaborador"),
    [data]
  );

  const totalClaustro = {
    total_wos_scopus: claustro.reduce(
      (acc, curr) => acc + Number(curr.total_wos_scopus_5_anios || 0),
      0
    ),
    total_scielo: claustro.reduce(
      (acc, curr) => acc + Number(curr.total_scielo_5_anios || 0),
      0
    )
  };

  const totalColaboradores = {
    total_wos_scopus: colaboradores.reduce(
      (acc, curr) => acc + Number(curr.total_wos_scopus_5_anios || 0),
      0
    ),
    total_scielo: colaboradores.reduce(
      (acc, curr) => acc + Number(curr.total_scielo_5_anios || 0),
      0
    )
  };

  return (
    <div>

      <h3 className="mb-3">Reporte General Académico</h3>

      <div className="panel-card">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-outline-success btn-sm">
            <i className="bi bi-file-earmark-excel me-2" />
            Descargar Excel
          </button>
        </div>

        {loading && (
          <div style={{ color: "var(--muted)" }}>Cargando...</div>
        )}

        {error && (
          <div className="text-danger">{error}</div>
        )}

        {!loading && !error && (

        <div className="table-wrap">
          <div className="table-responsive">

            <table className="table table-dark table-dark-custom align-middle text-center fa-table small">

              <thead>
                <tr>
                    <th>Nombre Académico</th>
                    <th>Año ingreso al programa</th>
                    <th>Total publ. WoS/SCOPUS (1)</th>
                    <th>Artículos Scielo/Latindex/ERIH</th>
                    <th>Otros artículos</th>
                    <th>Libros en editorial de relevancia en el área, referato externo y comité editorial</th>
                    <th>Libro en otra editorial</th>
                    <th>Capitulo de libro en editorial de relevancia en el área, referato externo y comité editorial</th>
                    <th>Capítulo de libro en otra editorial</th>
                    <th>Edición crítica y traducción anotada de un libro en editorial de relevancia en el área, referato externo y comité editorial</th>
                    <th>Edición crítica y traducción anotada de un libro en otra editorial</th>
                    <th>Proyectos FONDECYT, FONDEF, FONDAP, BASALES, CORFO, ANILLO, FONIS, FONIDE o Instituto Milenio como investigador responsable (2)</th>
                    <th>Otros proyectos con:
                            <br/>1) evaluación externa por pares.
                            <br/>2) Financiamiento externo.
                            <br/>3) investigación de carácter claramente disciplinar
                    </th>
                </tr>
              </thead>

              <tbody>

                {/* CLAUSTRO */}
                <tr>
                  <td colSpan="13"
                    className="fw-bold text-start"
                    style={{
                      background: "rgba(218,161,54,.15)",
                      color: "var(--gold)"
                    }}>
                    CLAUSTRO
                  </td>
                </tr>

                {claustro.map((row, index) => (
                  <tr key={row.usuario_id}>
                    <td className="text-start">
                      <strong>{index + 1}.</strong> {row.nombre}
                    </td>
                    <td>{row.ingreso || "-"}</td>
                    <td>{row.total_wos_scopus_5_anios || 0}</td>
                    <td>{row.total_scielo_5_anios || 0}</td>
                    <td>{row.otros_articulos || 0}</td>
                    <td>{row.libros_area || 0}</td>
                    <td>{row.libros_otro || 0}</td>
                    <td>{row.cap_area || 0}</td>
                    <td>{row.cap_otro || 0}</td>
                    <td>{row.edicion_area || 0}</td>
                    <td>{row.edicion_otro || 0}</td>
                    <td>{row.proyectos_fondecyt || 0}</td>
                    <td>{row.otros_proyectos || 0}</td>
                  </tr>
                ))}

                <tr style={{ background: "rgba(255,255,255,.05)" }}>
                  <td colSpan="2" className="fw-bold">TOTAL</td>
                  <td>{totalClaustro.total_wos_scopus}</td>
                  <td>{totalClaustro.total_scielo}</td>
                  <td colSpan="10"></td>
                </tr>

                <tr>
                  <td colSpan="2" className="fw-bold text-start">
                    WoS
                  </td>
                  <td style={{
                    background: "rgba(218,161,54,.25)",
                    fontWeight: 600
                  }}>
                    104
                  </td>
                  <td colSpan="10"></td>
                </tr>

                {/* COLABORADORES */}
                <tr>
                  <td colSpan="13"
                    className="fw-bold text-start"
                    style={{
                      background: "rgba(42,64,106,.35)",
                      color: "#ffffff"
                    }}>
                    COLABORADORES
                  </td>
                </tr>

                {colaboradores.map((row, index) => (
                  <tr key={row.usuario_id}>
                    <td className="text-start">
                      <strong>{index + 1}.</strong> {row.nombre}
                    </td>
                    <td>{row.ingreso || "-"}</td>
                    <td>{row.total_wos_scopus_5_anios || 0}</td>
                    <td>{row.scielo || 0}</td>
                    <td>{row.otros_articulos || 0}</td>
                    <td>{row.libros_area || 0}</td>
                    <td>{row.libros_otro || 0}</td>
                    <td>{row.cap_area || 0}</td>
                    <td>{row.cap_otro || 0}</td>
                    <td>{row.edicion_area || 0}</td>
                    <td>{row.edicion_otro || 0}</td>
                    <td>{row.proyectos_fondecyt || 0}</td>
                    <td>{row.otros_proyectos || 0}</td>
                  </tr>
                ))}

                <tr style={{ background: "rgba(255,255,255,.05)" }}>
                  <td colSpan="2" className="fw-bold">TOTAL</td>
                  <td>{totalColaboradores.total_wos_scopus}</td>
                  <td>{totalColaboradores.total_scielo}</td>
                  <td colSpan="10"></td>
                </tr>

                <tr>
                  <td colSpan="2" className="fw-bold text-start">
                    WoS
                  </td>
                  <td style={{
                    background: "rgba(218,161,54,.25)",
                    fontWeight: 600
                  }}>
                    104
                  </td>
                  <td colSpan="10"></td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* NOTAS */}
        <div className="mt-3" style={{ color: "var(--muted)", fontSize: 13 }}>
          <div>(1) Sólo se registran artículos como primer autor.</div>
          <div>(2) Se registran los proyectos obtenidos desde 2019, sin considerar los proyectos en curso.</div>
        </div>

        {/* TABLA PROMEDIOS (NO SE BORRÓ) */}
        <div className="mt-4">

          <div className="table-wrap">
            <div className="table-responsive">

              <table className="table table-dark table-dark-custom align-middle small text-center">

                <thead>
                  <tr>
                    <th></th>
                    <th>Claustro</th>
                    <th>Cuerpo Académico</th>
                  </tr>
                </thead>

                <tbody>

                  <tr>
                    <td className="text-start">
                      Promedio de publicaciones WOS últimos 5 años
                    </td>
                    <td>
                      {claustro.length
                        ? (totalClaustro.total_wos_scopus / claustro.length).toFixed(1)
                        : 0}
                    </td>
                    <td>
                      {data.length
                        ? ((totalClaustro.total_wos_scopus + totalColaboradores.total_wos_scopus) / data.length).toFixed(1)
                        : 0}
                    </td>
                  </tr>

                  <tr>
                    <td className="text-start">
                    Promedio de publicaciones WOS, últimos 5 años (2019-2023)
                    </td>
                    <td>20,8</td>
                    <td>25,8</td>
                </tr>

                <tr>
                    <td className="text-start">
                    Promedio de publicaciones WOS, por académico, últimos 5 años (2019-2023)
                    </td>
                    <td>6,1</td>
                    <td>5,9</td>
                </tr>

                <tr>
                    <td className="text-start">
                    Promedio de Libros o capítulos de libros, últimos 5 años (2019-2023)
                    </td>
                    <td>14,6</td>
                    <td>17</td>
                </tr>

                <tr>
                    <td className="text-start">
                    Promedio de Proyectos FONDECYT, en calidad de IP, últimos 5 años (2019-2023)
                    </td>
                    <td>3,8</td>
                    <td>4,8</td>
                </tr>

                </tbody>
              </table>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}