import { useEffect } from "react";

export default function FormModal({
  show,
  title,
  children,
  onClose,
  onSubmit,
  submitText = "Guardar",
}) {

  useEffect(() => {
    if (!show) return;
    const handleKeyDown = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <>
      <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div
            className="modal-content"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              color: "var(--text)",
            }}
          >
            <div className="modal-header" style={{ borderBottom: "1px solid var(--border)" }}>
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>

            <div className="modal-body">{children}</div>

            <div className="modal-footer" style={{ borderTop: "1px solid var(--border)" }}>
              <button type="button" className="btn btn-outline-light" onClick={onClose}>
                Cancelar
              </button>
              <button type="button" className="btn btn-primary" onClick={onSubmit}>
                {submitText}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" />
    </>
  );
}
