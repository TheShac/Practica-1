export default function ActionButtons({ onEdit, onDelete }) {
  return (
    <div className="d-flex flex-wrap gap-2 justify-content-end">
      <button
        className="btn btn-sm btn-outline-light"
        onClick={onEdit}
      >
        <i className="bi bi-pencil me-1" />
        Editar
      </button>
      <button
        className="btn btn-sm btn-outline-danger"
        onClick={onDelete}
      >
        <i className="bi bi-trash me-1" />
        Eliminar
      </button>
    </div>
  );
}