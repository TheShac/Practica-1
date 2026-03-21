import { useState, useEffect } from "react";

export default function YearInput({ value, onChange, error, required, label }) {
  const currentYear = new Date().getFullYear();

  const handleChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, "");
    onChange(cleaned);
  };

  return (
    <div>
      <label className="form-label" style={{ color: "var(--muted)" }}>
        {label ?? "Año"}*
      </label>

      <input
        type="text"
        maxLength="4"
        className={`form-control input-dark ${
          error ? "is-invalid" : ""
        }`}
        value={value}
        onChange={handleChange}
        placeholder="Ej: 2024"
      />

      {error && (
        <div className="invalid-feedback d-block">
          {error}
        </div>
      )}

      {!error && value && value.length === 4 && (
        <div
          style={{
            fontSize: "0.8rem",
            color:
              Number(value) >= 1900 &&
              Number(value) <= currentYear
                ? "#28a745"
                : "#dc3545",
          }}
        >
          {Number(value) >= 1900 &&
          Number(value) <= currentYear
            ? "Año válido"
            : `Debe estar entre 1900 y ${currentYear}`}
        </div>
      )}
    </div>
  );
}

