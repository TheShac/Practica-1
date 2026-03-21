const EstadoSelect = ({ value, onChange, label = "Estado" }) => {
  return (
    <div>
      {label && (
        <label className="form-label" style={{ color: "var(--muted)" }}>
          {label}*
        </label>
      )}
      <select
        className="form-select input-dark"
        value={value}
        onChange={onChange}
      >
        <option value="Publicado">Publicado</option>
        <option value="En revisión">En revisión</option>
        <option value="Aceptado">Aceptado</option>
      </select>
    </div>
  );
};

export default EstadoSelect;