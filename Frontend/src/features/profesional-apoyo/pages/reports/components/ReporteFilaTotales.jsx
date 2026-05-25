const ReporteFilaTotales = ({ totales }) => (
  <tr style={{ background: "rgba(255,255,255,.05)" }}>
    <td colSpan="2" className="fw-bold">TOTAL</td>
    <td>{totales.total_wos_scopus}</td>
    <td>{totales.total_scielo}</td>
    <td>{totales.otros_articulos}</td>
    <td>{totales.libros_area}</td>
    <td>{totales.libros_otro}</td>
    <td>{totales.cap_area}</td>
    <td>{totales.cap_otro}</td>
    <td>{totales.edicion_area}</td>
    <td>{totales.edicion_otro}</td>
    <td>{totales.proyectos_fondecyt}</td>
    <td>{totales.otros_proyectos}</td>
  </tr>
);

export default ReporteFilaTotales;