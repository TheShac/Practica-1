import { useState } from "react";

export default function PasswordInput({ value, onChange, placeholder = "Mínimo 6 caracteres", className = "form-control input-dark" }) {
  const [show, setShow] = useState(false);

  return (
    <div className="input-group">
      <input
        type={show ? "text" : "password"}
        className={className}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="new-password"
      />
      <button
        type="button"
        className="input-group-text"
        onClick={() => setShow((v) => !v)}
        style={{
          cursor: "pointer",
          background: "transparent",
          border: "1px solid var(--border)",
          borderLeft: "none",
          color: "var(--muted)",
        }}
      >
        <i className={`bi ${show ? "bi-eye" : "bi-eye-slash"}`} />
      </button>
    </div>
  );
}