const LugarInput = ({ value, onChange, label = "Lugar" }) => (
  <div>
    {label && (
      <label className="form-label" style={{ color: "var(--muted)" }}>
        {label}*
      </label>
    )}
    <input
      className="form-control input-dark"
      value={value}
      onChange={onChange}
      placeholder="Lugar"
    />
  </div>
);

export default LugarInput;