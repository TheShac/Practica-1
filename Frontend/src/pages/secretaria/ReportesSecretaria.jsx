import React from "react";

export default function ReportesSecretaria() {

  const claustro = [
    {
      nombre: "Académico 1",
      ingreso: 2018,
      total_wos_scopus: 33,
      scielo: 2,
      otros_articulos: 0,
      libros_area: 8,
      libros_otro: 5,
      cap_area: 0,
      cap_otro: 0,
      edicion_area: 0,
      edicion_otro: 0,
      proyectos_fondecyt: 2,
      otros_proyectos: 0
    }
  ];

  const colaboradores = [
    {
      nombre: "Colaborador 1",
      ingreso: 2019,
      total_wos_scopus: 6,
      scielo: 5,
      otros_articulos: 0,
      libros_area: 0,
      libros_otro: 0,
      cap_area: 1,
      cap_otro: 0,
      edicion_area: 1,
      edicion_otro: 0,
      proyectos_fondecyt: 2,
      otros_proyectos: 2
    }
  ];

  const calcularTotales = (array) =>
    array.reduce((acc, item) => {
      Object.keys(acc).forEach(key => {
        if (typeof item[key] === "number") acc[key] += item[key];
      });
      return acc;
    }, {
      total_wos_scopus: 0,
      scielo: 0,
      otros_articulos: 0,
      libros_area: 0,
      libros_otro: 0,
      cap_area: 0,
      cap_otro: 0,
      edicion_area: 0,
      edicion_otro: 0,
      proyectos_fondecyt: 0,
      otros_proyectos: 0
    });

  const totalClaustro = calcularTotales(claustro);
  const totalColaboradores = calcularTotales(colaboradores);

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
                            1) evaluación externa por pares.
                            2) Financiamiento externo.
                            3) investigación de carácter claramente disciplinar
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
                  <tr key={index}>
                    <td className="text-start">{row.nombre}</td>
                    <td>{row.ingreso}</td>
                    <td>{row.total_wos_scopus}</td>
                    <td>{row.scielo}</td>
                    <td>{row.otros_articulos}</td>
                    <td>{row.libros_area}</td>
                    <td>{row.libros_otro}</td>
                    <td>{row.cap_area}</td>
                    <td>{row.cap_otro}</td>
                    <td>{row.edicion_area}</td>
                    <td>{row.edicion_otro}</td>
                    <td>{row.proyectos_fondecyt}</td>
                    <td>{row.otros_proyectos}</td>
                  </tr>
                ))}

                <tr style={{ background: "rgba(255,255,255,.05)" }}>
                  <td colSpan="2" className="fw-bold">TOTAL</td>
                  <td>{totalClaustro.total_wos_scopus}</td>
                  <td>{totalClaustro.scielo}</td>
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
                    className="fw-bold text-start mt-3"
                    style={{
                      background: "rgba(42,64,106,.35)",
                      color: "#ffffff"
                    }}>
                    COLABORADORES
                  </td>
                </tr>

                {colaboradores.map((row, index) => (
                  <tr key={index}>
                    <td className="text-start">{row.nombre}</td>
                    <td>{row.ingreso}</td>
                    <td>{row.total_wos_scopus}</td>
                    <td>{row.scielo}</td>
                    <td>{row.otros_articulos}</td>
                    <td>{row.libros_area}</td>
                    <td>{row.libros_otro}</td>
                    <td>{row.cap_area}</td>
                    <td>{row.cap_otro}</td>
                    <td>{row.edicion_area}</td>
                    <td>{row.edicion_otro}</td>
                    <td>{row.proyectos_fondecyt}</td>
                    <td>{row.otros_proyectos}</td>
                  </tr>
                ))}

                <tr style={{ background: "rgba(255,255,255,.05)" }}>
                  <td colSpan="2" className="fw-bold">TOTAL</td>
                  <td>{totalColaboradores.total_wos_scopus}</td>
                  <td>{totalColaboradores.scielo}</td>
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
                  <td colSpan="2" className="fw-bold text-start">
                    WoS
                  </td>
                  <td style={{
                    background: "rgba(218,161,54,.25)",
                    fontWeight: 600
                  }}>
                    25
                  </td>
                  <td colSpan="10"></td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

        {/* NOTAS */}
        <div className="mt-3" style={{ color: "var(--muted)", fontSize: 13 }}>
          <div>(1) Sólo se registran artículos como primer autor.</div>
          <div>(2) Se registran los proyectos obtenidos desde 2019, sin considerar proyectos en curso.</div>
        </div>

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