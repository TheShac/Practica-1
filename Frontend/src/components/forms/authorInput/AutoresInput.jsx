const AutoresInput = ({ value, onChange, label = "Autor(es)" }) => (
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
      placeholder="Ej: García J., Martínez L."
    />
  </div>
);

export default AutoresInput;