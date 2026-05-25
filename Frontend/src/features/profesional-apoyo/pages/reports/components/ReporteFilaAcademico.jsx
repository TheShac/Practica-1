import ReporteExcelInput from "./ReporteExcelInput";

const FIELDS = [
  "total_wos_scopus_5_anios",
  "total_scielo_5_anios",
  "otros_articulos",
  "libros_area",
  "libros_otro",
  "cap_area",
  "cap_otro",
  "edicion_area",
  "edicion_otro",
  "proyectos_fondecyt",
  "otros_proyectos",
];

const ReporteFilaAcademico = ({ row, index, onChange }) => (
  <tr>
    <td className="text-start">
      <strong>{index + 1}.</strong> {row.primer_nombre} {row.primer_apellido}
    </td>
    <td>{row.ano_ingreso || "-"}</td>
    {FIELDS.map((field) => (
      <td key={field}>
        <ReporteExcelInput
          value={row[field]}
          onChange={(e) => onChange(row.usuario_id, field, e.target.value)}
        />
      </td>
    ))}
  </tr>
);

export default ReporteFilaAcademico;