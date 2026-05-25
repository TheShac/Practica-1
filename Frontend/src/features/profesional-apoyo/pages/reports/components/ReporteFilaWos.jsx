import ReporteExcelInput from "./ReporteExcelInput";

const ReporteFilaWos = ({ value, onChange }) => (
  <tr>
    <td colSpan="2" className="fw-bold text-start">WoS</td>
    <td style={{ background: "rgba(218,161,54,.25)", fontWeight: 600 }}>
      <ReporteExcelInput
        value={value}
        onChange={(e) => {
          const val = Number(e.target.value);
          if (val >= 0) onChange(val);
        }}
      />
    </td>
    <td colSpan="10"></td>
  </tr>
);

export default ReporteFilaWos;