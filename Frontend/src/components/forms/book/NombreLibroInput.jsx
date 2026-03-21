const NombreLibroInput = ({ value, onChange, label = "Nombre libro" }) => (
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
      placeholder="Nombre del libro"
    />
  </div>
);

export default NombreLibroInput;