const RespaldoInput = ({ value, onChange, label = "Respaldo (link)" }) => (
  <div>
    {label && (
      <label className="form-label" style={{ color: "var(--muted)" }}>
        {label}
      </label>
    )}
    <input
      className="form-control input-dark"
      value={value}
      onChange={onChange}
      placeholder="https://..."
    />
  </div>
);

export default RespaldoInput;