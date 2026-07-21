import FormModal     from "@/shared/components/modals/formModal/FormModal.jsx";
import PasswordInput from "./PasswordInput.jsx";

export default function ModalCambiarPassword({ show, onClose, onSubmit, saving, value, onChange }) {
  return (
    <FormModal
      show={show}
      title="Cambiar Contraseña"
      onClose={onClose}
      onSubmit={onSubmit}
      submitText={saving ? "Guardando..." : "Cambiar Contraseña"}
    >
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label" style={{ color: "var(--muted)" }}>Nueva contraseña</label>
          <PasswordInput value={value} onChange={onChange} />
        </div>
      </div>
    </FormModal>
  );
}