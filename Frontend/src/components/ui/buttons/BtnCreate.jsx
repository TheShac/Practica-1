const BtnNuevo = ({ label, onClick, disabled }) => (
  <button className="btn btn-primary" onClick={onClick} disabled={disabled}>
    <i className="bi bi-plus-lg me-2" />
    {label}
  </button>
);

export default BtnNuevo;