export default function ConfirmModal({
  show,
  title = "¿Estás seguro?",
  message,
  confirmText  = "Confirmar",
  cancelText   = "Cancelar",
  confirmStyle = { borderColor: "#ef4444", color: "#ef4444" },
  onConfirm,
  onClose,
}) {
  if (!show) return null;

  return (
    <div
      className="modal-backdrop"
      style={{
        position:        "fixed",
        inset:           0,
        background:      "rgba(0,0,0,.6)",
        zIndex:          1050,
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        padding:         "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="panel-card"
        style={{ maxWidth: 420, width: "100%", margin: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0" style={{ color: "var(--text)" }}>{title}</h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={onClose}
          />
        </div>

        {/* Mensaje */}
        {message && (
          <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>{message}</p>
        )}

        {/* Acciones */}
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="btn btn-sm"
            style={confirmStyle}
            onClick={() => { onConfirm(); onClose(); }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}