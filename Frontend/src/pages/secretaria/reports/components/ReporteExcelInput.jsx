const ReporteExcelInput = ({ value, onChange }) => (
  <input
    type="number"
    className="text-center excel-input"
    value={value}
    onFocus={(e) => e.target.select()}
    onChange={onChange}
  />
);

export default ReporteExcelInput;