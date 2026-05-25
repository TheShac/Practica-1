import ReporteFilaAcademico from "./ReporteFilaAcademico";
import ReporteFilaTotales from "./ReporteFilaTotales";
import ReporteFilaWos from "./ReporteFilaWos";

const ReporteSeccionGrupo = ({ titulo, estiloHeader, rows, totales, wos, onWosChange, onCellChange }) => (
  <>
    <tr>
      <td colSpan="13" className="fw-bold text-start" style={estiloHeader}>
        {titulo}
      </td>
    </tr>
    {rows.map((row, index) => (
      <ReporteFilaAcademico
        key={row.usuario_id}
        row={row}
        index={index}
        onChange={onCellChange}
      />
    ))}
    <ReporteFilaTotales totales={totales} />
    <ReporteFilaWos value={wos} onChange={onWosChange} />
  </>
);

export default ReporteSeccionGrupo;