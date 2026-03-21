const EditorialInput = ({ value, onChange, label = "Editorial" }) => (
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
      placeholder="Editorial"
    />
  </div>
);

export default EditorialInput;