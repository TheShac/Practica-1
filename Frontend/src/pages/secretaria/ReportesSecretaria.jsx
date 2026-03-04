import React, { useEffect, useMemo, useState } from "react";
import { getReporteGeneral, updateReporteGeneral } from "../../services/reporteGeneral.service";

export default function ReportesSecretaria() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wosClaustro, setWosClaustro] = useState(0);
  const [wosColaborador, setWosColaborador] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getReporteGeneral();
        setData(
          result.map(item => ({
            ...item,
            total_wos_scopus_5_anios: item.total_wos_scopus_5_anios || 0,
            total_scielo_5_anios: item.total_scielo_5_anios || 0,
            otros_articulos: item.otros_articulos || 0,
            libros_area: item.libros_area || 0,
            libros_otro: item.libros_otro || 0,
            cap_area: item.cap_area || 0,
            cap_otro: item.cap_otro || 0,
            edicion_area: item.edicion_area || 0,
            edicion_otro: item.edicion_otro || 0,
            proyectos_fondecyt: item.proyectos_fondecyt || 0,
            otros_proyectos: item.otros_proyectos || 0
          }))
        );

        const claustroWos = result.find(r => r.tipo_academico === "Claustro")?.total_wos_global || 0;
        const colaboradorWos = result.find(r => r.tipo_academico === "Colaborador")?.total_wos_global || 0;

        setWosClaustro(claustroWos);
        setWosColaborador(colaboradorWos);
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

  const calcularTotales = (lista) => ({
    total_wos_scopus: lista.reduce((a,b)=>a+b.total_wos_scopus_5_anios,0),
    total_scielo: lista.reduce((a,b)=>a+b.total_scielo_5_anios,0),
    otros_articulos: lista.reduce((a,b)=>a+b.otros_articulos,0),
    libros_area: lista.reduce((a,b)=>a+b.libros_area,0),
    libros_otro: lista.reduce((a,b)=>a+b.libros_otro,0),
    cap_area: lista.reduce((a,b)=>a+b.cap_area,0),
    cap_otro: lista.reduce((a,b)=>a+b.cap_otro,0),
    edicion_area: lista.reduce((a,b)=>a+b.edicion_area,0),
    edicion_otro: lista.reduce((a,b)=>a+b.edicion_otro,0),
    proyectos_fondecyt: lista.reduce((a,b)=>a+b.proyectos_fondecyt,0),
    otros_proyectos: lista.reduce((a,b)=>a+b.otros_proyectos,0),
  });

  const totalClaustro = calcularTotales(claustro);
  const totalColaboradores = calcularTotales(colaboradores);
  const promedioWosClaustro = claustro.length > 0 ? (wosClaustro / claustro.length).toFixed(1) : 0;
  const promedioWosCuerpo = data.length > 0 ? ((wosClaustro + wosColaborador) / data.length).toFixed(1) : 0;

  const totalLibrosClaustro = totalClaustro.libros_area + totalClaustro.libros_otro + totalClaustro.cap_area + totalClaustro.cap_otro;
  const promedioLibrosClaustro = claustro.length > 0 ? (totalLibrosClaustro / claustro.length).toFixed(1) : 0;
  const totalLibrosColaborador = totalColaboradores.libros_area + totalColaboradores.libros_otro + totalColaboradores.cap_area + totalColaboradores.cap_otro;
  const totalLibrosCuerpo = totalClaustro.libros_area + totalClaustro.libros_otro + totalClaustro.cap_area + totalClaustro.cap_otro;
  const promedioLibrosCuerpo = data.length > 0 ? ((totalLibrosClaustro + totalLibrosColaborador) / data.length).toFixed(1) : 0;

  const handleChange = (id, field, value) => {
    let newValue = value === "" ? "" : Number(value);

    if (newValue < 0) return;

    setData(prev =>
      prev.map(item =>
        item.usuario_id === id
          ? { ...item, [field]: newValue }
          : item
      )
    );
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
          <button
            className="btn btn-primary btn-sm"
            onClick={async () => {
              try {
                await updateReporteGeneral(data, {
                  Claustro: wosClaustro,
                  Colaborador: wosColaborador
                });
                alert("Reporte guardado correctamente");
              } catch (error) {
                alert(error.message);
              }
            }}
          >
            Guardar Cambios
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
                      <strong>{index + 1}.</strong> {row.primer_nombre} {row.primer_apellido}
                    </td>
                    <td>{row.ano_ingreso || "-"}</td>
                    <td>
                      <input
                        type="number"
                        className="text-center excel-input"
                        value={row.total_wos_scopus_5_anios}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleChange(row.usuario_id, "total_wos_scopus_5_anios", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="text-center excel-input"
                        value={row.total_scielo_5_anios}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleChange(row.usuario_id, "total_scielo_5_anios", e.target.value)
                        }
                      />
                    </td>
                    
                    <td>
                      <input
                        type="number"
                        className="text-center excel-input"
                        value={row.otros_articulos}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleChange(row.usuario_id, "otros_articulos", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="text-center excel-input"
                        value={row.libros_area}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleChange(row.usuario_id, "libros_area", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="text-center excel-input"
                        value={row.libros_otro}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleChange(row.usuario_id, "libros_otro", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="text-center excel-input"
                        value={row.cap_area}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleChange(row.usuario_id, "cap_area", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="text-center excel-input"
                        value={row.cap_otro}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleChange(row.usuario_id, "cap_otro", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="text-center excel-input"
                        value={row.edicion_area}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleChange(row.usuario_id, "edicion_area", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="text-center excel-input"
                        value={row.edicion_otro}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleChange(row.usuario_id, "edicion_otro", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="text-center excel-input"
                        value={row.proyectos_fondecyt}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleChange(row.usuario_id, "proyectos_fondecyt", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="text-center excel-input"
                        value={row.otros_proyectos}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleChange(row.usuario_id, "otros_proyectos", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}

                <tr style={{ background: "rgba(255,255,255,.05)" }}>
                  <td colSpan="2" className="fw-bold">TOTAL</td>
                  <td>{totalClaustro.total_wos_scopus}</td>
                  <td>{totalClaustro.total_scielo}</td>
                  <td>{totalClaustro.otros_articulos}</td>
                  <td>{totalClaustro.libros_area}</td>
                  <td>{totalClaustro.libros_otro}</td>
                  <td>{totalClaustro.cap_area}</td>
                  <td>{totalClaustro.cap_otro}</td>
                  <td>{totalClaustro.edicion_area}</td>
                  <td>{totalClaustro.edicion_otro}</td>
                  <td>{totalClaustro.proyectos_fondecyt}</td>
                  <td>{totalClaustro.otros_proyectos}</td>
                </tr>

                <tr>
                  <td colSpan="2" className="fw-bold text-start">WoS</td>
                  <td
                    style={{
                      background: "rgba(218,161,54,.25)",
                      fontWeight: 600
                    }}
                  >
                    <input
                      type="number"
                      min="0"
                      className="excel-input"
                      value={wosClaustro}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= 0) setWosClaustro(val);
                      }}
                    />
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
                      <strong>{index + 1}.</strong> {row.primer_nombre} {row.primer_apellido}
                    </td>
                    <td>{row.ano_ingreso || "-"}</td>
                    <td>
                      <input
                        type="number"
                        className="text-center excel-input"
                        value={row.total_wos_scopus_5_anios}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleChange(row.usuario_id, "total_wos_scopus_5_anios", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="text-center excel-input"
                        value={row.total_scielo_5_anios}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleChange(row.usuario_id, "total_scielo_5_anios", e.target.value)
                        }
                      />
                    </td>
                    
                    <td>
                      <input
                        type="number"
                        className="text-center excel-input"
                        value={row.otros_articulos}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleChange(row.usuario_id, "otros_articulos", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="text-center excel-input"
                        value={row.libros_area}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleChange(row.usuario_id, "libros_area", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="text-center excel-input"
                        value={row.libros_otro}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleChange(row.usuario_id, "libros_otro", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="text-center excel-input"
                        value={row.cap_area}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleChange(row.usuario_id, "cap_area", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="text-center excel-input"
                        value={row.cap_otro}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleChange(row.usuario_id, "cap_otro", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="text-center excel-input"
                        value={row.edicion_area}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleChange(row.usuario_id, "edicion_area", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="text-center excel-input"
                        value={row.edicion_otro}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleChange(row.usuario_id, "edicion_otro", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="text-center excel-input"
                        value={row.proyectos_fondecyt}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleChange(row.usuario_id, "proyectos_fondecyt", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="text-center excel-input"
                        value={row.otros_proyectos}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleChange(row.usuario_id, "otros_proyectos", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}

                <tr style={{ background: "rgba(255,255,255,.05)" }}>
                  <td colSpan="2" className="fw-bold">TOTAL</td>
                  <td>{totalColaboradores.total_wos_scopus}</td>
                  <td>{totalColaboradores.total_scielo}</td>
                  <td>{totalColaboradores.otros_articulos}</td>
                  <td>{totalColaboradores.libros_area}</td>
                  <td>{totalColaboradores.libros_otro}</td>
                  <td>{totalColaboradores.cap_area}</td>
                  <td>{totalColaboradores.cap_otro}</td>
                  <td>{totalColaboradores.edicion_area}</td>
                  <td>{totalColaboradores.edicion_otro}</td>
                  <td>{totalColaboradores.proyectos_fondecyt}</td>
                  <td>{totalColaboradores.otros_proyectos}</td>
                </tr>

                <tr>
                  <td colSpan="2" className="fw-bold text-start">WoS</td>
                  <td
                    style={{
                      background: "rgba(218,161,54,.25)",
                      fontWeight: 600
                    }}
                  >
                    <input
                      type="number"
                      min="0"
                      className="excel-input"
                      value={wosColaborador}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= 0) setWosColaborador(val);
                      }}
                    />
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
                    <td>{promedioWosClaustro}</td>
                    <td>{promedioWosCuerpo}</td>
                  </tr>

                  <tr>
                      <td className="text-start">
                      Promedio de publicaciones WOS, por académico, últimos 5 años (2019-2023)
                      </td>
                      <td>0</td>
                      <td>0</td>
                  </tr>

                  <tr>
                      <td className="text-start">
                      Promedio de Libros o capítulos de libros, últimos 5 años (2019-2023)
                      </td>
                      <td>{promedioLibrosClaustro}</td>
                      <td>{promedioLibrosCuerpo}</td>
                  </tr>

                  <tr>
                      <td className="text-start">
                      Promedio de Proyectos FONDECYT, en calidad de IP, últimos 5 años (2019-2023)
                      </td>
                      <td>0</td>
                      <td>0</td>
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