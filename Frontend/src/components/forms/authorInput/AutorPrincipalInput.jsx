const AutorPrincipalInput = ({ value, onChange, label = "Autor/a principal" }) => (
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
      placeholder="Ej: García J."
    />
  </div>
);

export default AutorPrincipalInput;