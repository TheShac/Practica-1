export default function TituloInput({ value, onChange, className = "", placeholder = "Título" }) {
  return (
    <div>
      <label className="form-label" style={{ color: "var(--muted)" }}>
        Título*
      </label>
      <input
        className={`form-control input-dark${className ? ` ${className}` : ""}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}