const IssnInput = ({ value, onChange, label = "ISSN" }) => {

  const handleChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    const limited = raw.slice(0, 8);

    const formatted = limited.length > 4
      ? `${limited.slice(0, 4)}-${limited.slice(4)}`
      : limited;

    onChange({ ...e, target: { ...e.target, value: formatted } });
  };

  return (
    <div>
      {label && (
        <label className="form-label" style={{ color: "var(--muted)" }}>
          {label}
        </label>
      )}
      <input
        className="form-control input-dark"
        value={value}
        onChange={handleChange}
        placeholder="0000-0000"
        maxLength={9}
      />
    </div>
  );
};

export default IssnInput;