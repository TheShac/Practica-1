import FormModal     from "@/shared/components/modals/formModal/FormModal.jsx";
import PasswordInput from "./PasswordInput.jsx";
import { formatRut, cleanRut } from "@/shared/utils/rut.js";

const PROGRAMAS = [
  { programa_id: 1, nombre: "MAGISTER" },
  { programa_id: 2, nombre: "DOCTORADO" },
];

export default function ModalCrearUsuario({ show, onClose, onSubmit, saving, roles, rolesAca, form, setForm }) {

  const isAcademico = Number(form.rol_id) === 3;

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleRut = (e) => set("rut", formatRut(cleanRut(e.target.value)));

  const togglePrograma = (programa_id) => {
    const existe = form.programas.find(p => Number(p.programa_id) === programa_id);
    set("programas", existe
      ? form.programas.filter(p => Number(p.programa_id) !== programa_id)
      : [...form.programas, { programa_id, rolaca_id: "" }]
    );
  };

  const setRolaca = (programa_id, rolaca_id) => {
    set("programas", form.programas.map(p =>
      Number(p.programa_id) === programa_id ? { ...p, rolaca_id: rolaca_id ? Number(rolaca_id) : "" } : p
    ));
  };

  return (
    <FormModal
      show={show}
      title="Nuevo Usuario"
      onClose={onClose}
      onSubmit={onSubmit}
      submitText={saving ? "Guardando..." : "Crear Usuario"}
    >
      {/* Bloque oculto para engañar al autocompletado del browser */}
      <input type="text"     name="username" style={{ display: "none" }} autoComplete="username" readOnly />
      <input type="password" name="password" style={{ display: "none" }} autoComplete="new-password" readOnly />

      <div className="row g-3">
        <div className="col-12 col-md-4">
          <label className="form-label" style={{ color: "var(--muted)" }}>RUT*</label>
          <input
            className="form-control input-dark"
            placeholder="12.345.678-9"
            value={form.rut}
            onChange={handleRut}
            autoComplete="off"
            name="rut-usuario"
          />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label" style={{ color: "var(--muted)" }}>Primer nombre*</label>
          <input className="form-control input-dark" value={form.primer_nombre} onChange={(e) => set("primer_nombre", e.target.value)} autoComplete="off" name="pnombre-nuevo" />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label" style={{ color: "var(--muted)" }}>Segundo nombre</label>
          <input className="form-control input-dark" value={form.segundo_nombre} onChange={(e) => set("segundo_nombre", e.target.value)} autoComplete="off" name="snombre-nuevo" />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" style={{ color: "var(--muted)" }}>Primer apellido*</label>
          <input className="form-control input-dark" value={form.primer_apellido} onChange={(e) => set("primer_apellido", e.target.value)} autoComplete="off" name="papellido-nuevo" />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" style={{ color: "var(--muted)" }}>Segundo apellido</label>
          <input className="form-control input-dark" value={form.segundo_apellido} onChange={(e) => set("segundo_apellido", e.target.value)} autoComplete="off" name="sapellido-nuevo" />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label" style={{ color: "var(--muted)" }}>Teléfono</label>
          <input className="form-control input-dark" value={form.telefono} onChange={(e) => set("telefono", e.target.value)} autoComplete="off" name="telefono-nuevo" />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label" style={{ color: "var(--muted)" }}>Año ingreso</label>
          <input
            type="number"
            className="form-control input-dark"
            placeholder="2024"
            value={form.ano_ingreso}
            onChange={(e) => set("ano_ingreso", e.target.value)}
            autoComplete="off"
            name="anio-ingreso-nuevo"
          />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label" style={{ color: "var(--muted)" }}>Rol*</label>
          <select
            className="form-select input-dark"
            value={form.rol_id}
            onChange={(e) => setForm((p) => ({ ...p, rol_id: Number(e.target.value), programas: [] }))}
          >
            <option value="">Seleccione...</option>
            {roles.map((r) => <option key={r.rol_id} value={r.rol_id}>{r.nombre}</option>)}
          </select>
        </div>

        {isAcademico && (
          <div className="col-12">
            <label className="form-label" style={{ color: "var(--muted)" }}>Programas y tipo de contrato</label>
            {PROGRAMAS.map((prog) => {
              const asignado = form.programas.find(p => Number(p.programa_id) === prog.programa_id);
              return (
                <div key={prog.programa_id} className="d-flex align-items-center gap-2 mb-2">
                  <div className="form-check mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`prog-c-${prog.programa_id}`}
                      checked={!!asignado}
                      onChange={() => togglePrograma(prog.programa_id)}
                    />
                    <label className="form-check-label" htmlFor={`prog-c-${prog.programa_id}`}>{prog.nombre}</label>
                  </div>
                  {asignado && (
                    <select
                      className="form-select input-dark form-select-sm"
                      style={{ maxWidth: 180 }}
                      value={asignado.rolaca_id || ""}
                      onChange={(e) => setRolaca(prog.programa_id, e.target.value)}
                    >
                      <option value="">Tipo contrato...</option>
                      {rolesAca.map((r) => <option key={r.rolaca_id} value={r.rolaca_id}>{r.tipo_academico}</option>)}
                    </select>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="col-12">
          <label className="form-label" style={{ color: "var(--muted)" }}>Líneas de investigación</label>
          <textarea className="form-control input-dark" rows={2} value={form.lineas_investigacion} onChange={(e) => set("lineas_investigacion", e.target.value)} autoComplete="off" />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" style={{ color: "var(--muted)" }}>Contraseña*</label>
          <PasswordInput value={form.password} onChange={(e) => set("password", e.target.value)} />
        </div>
      </div>
    </FormModal>
  );
}