export default function PeriodoEjecucionInput({ value, onChange, className = "" }) {

    const handleChange = (e) => {
        let raw = e.target.value.replace(/[^\d-]/g, "");

        if (raw.length === 5 && !raw.includes("-")) {
        raw = raw.slice(0, 4) + "-" + raw.slice(4);
        }

        if (raw.length > 9) return;

        onChange({ target: { value: raw } });
    };
    return (
        <div>
            <label className="form-label" style={{ color: "var(--muted)" }}>
                Período de ejecución*
            </label>
            <input
                className={`form-control input-dark${className ? ` ${className}` : ""}`}
                value={value}
                onChange={handleChange}
                placeholder="Ej: 2024-2026"
                maxLength={9}
            />
        </div>
    );
}