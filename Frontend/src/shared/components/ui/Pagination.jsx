export default function Pagination({ page, totalPages, total, perPage, onPageChange }) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * perPage + 1;
  const end   = Math.min(page * perPage, total);

  // Ventana de hasta 5 botones centrada en la página actual
  const delta = 2;
  let from = Math.max(1, page - delta);
  let to   = Math.min(totalPages, page + delta);
  if (to - from < delta * 2) {
    if (from === 1) to   = Math.min(totalPages, from + delta * 2);
    else            from = Math.max(1, to - delta * 2);
  }
  const pages = Array.from({ length: to - from + 1 }, (_, i) => from + i);

  const btn = (label, target, disabled, active = false) => (
    <button
      key={label}
      onClick={() => !disabled && onPageChange(target)}
      disabled={disabled}
      className={`btn btn-sm ${active ? "btn-primary" : "btn-outline-secondary"}`}
      style={{
        minWidth: 34,
        color:    active ? "#000" : "var(--text)",
        background: active ? "var(--gold)" : "transparent",
        borderColor: active ? "var(--gold)" : "rgba(255,255,255,.2)",
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 gap-2">
      <span style={{ color: "var(--muted)", fontSize: "0.8125rem" }}>
        {start}–{end} de {total} registro{total !== 1 ? "s" : ""}
      </span>

      <div className="d-flex gap-1">
        {btn("«", 1,          page === 1)}
        {btn("‹", page - 1,  page === 1)}
        {from > 1 && <span style={{ color: "var(--muted)", alignSelf: "center" }}>…</span>}
        {pages.map((p) => btn(p, p, false, p === page))}
        {to < totalPages && <span style={{ color: "var(--muted)", alignSelf: "center" }}>…</span>}
        {btn("›", page + 1,  page === totalPages)}
        {btn("»", totalPages, page === totalPages)}
      </div>
    </div>
  );
}
