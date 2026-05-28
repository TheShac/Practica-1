import FormModal from "@/shared/components/modals/formModal/FormModal.jsx";
import { formatRut, cleanRut } from "@/shared/utils/rut.js";

const PROGRAMAS = [
  { programa_id: 1, nombre: "MAGISTER" },
  { programa_id: 2, nombre: "DOCTORADO" },
];

export default function ModalEditarUsuario({ show, onClose, onSubmit, saving, roles, rolesAca, form, setForm, editingRolId }) {

  const isAcademico = Number(form.rol_id) === 3;

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));

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

  const addCorreo        = () => set("correos", [...form.correos, { mail: "" }]);
  const removeCorreo     = (i) => set("correos", form.correos.filter((_, idx) => idx !== i));
  const addTitulacion    = () => set("titulaciones", [...form.titulaciones, { titulo: "", institucion_titulacion: "", pais_titulacion: "", ano_titulacion: "" }]);
  const removeTitulacion = (i) => set("titulaciones", form.titulaciones.filter((_, idx) => idx !== i));

  const updateCorreo = (i, value) => {
    const updated = [...form.correos];
    updated[i] = { ...updated[i], mail: value };
    set("correos", updated);
  };

  const updateTitulacion = (i, field, value) => {
    const updated = [...form.titulaciones];
    updated[i] = { ...updated[i], [field]: value };
    set("titulaciones", updated);
  };

  const setGrado = (field, value) =>
    set("grado_academico", { ...form.grado_academico, [field]: value });

  return (
    <FormModal
      show={show}
      title="Editar Usuario"
      onClose={onClose}
      onSubmit={onSubmit}
      submitText={saving ? "Guardando..." : "Guardar Cambios"}
    >
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <label className="form-label" style={{ color: "var(--muted)" }}>RUT</label>
          <input
            className="form-control input-dark"
            value={form.rut || ""}
            onChange={(e) => set("rut", formatRut(cleanRut(e.target.value)))}
            autoComplete="off"
            name="rut-edit"
          />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label" style={{ color: "var(--muted)" }}>Primer nombre</label>
          <input className="form-control input-dark" value={form.primer_nombre} onChange={(e) => set("primer_nombre", e.target.value)} autoComplete="off" />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label" style={{ color: "var(--muted)" }}>Segundo nombre</label>
          <input className="form-control input-dark" value={form.segundo_nombre} onChange={(e) => set("segundo_nombre", e.target.value)} autoComplete="off" />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" style={{ color: "var(--muted)" }}>Primer apellido</label>
          <input className="form-control input-dark" value={form.primer_apellido} onChange={(e) => set("primer_apellido", e.target.value)} autoComplete="off" />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" style={{ color: "var(--muted)" }}>Segundo apellido</label>
          <input className="form-control input-dark" value={form.segundo_apellido} onChange={(e) => set("segundo_apellido", e.target.value)} autoComplete="off" />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label" style={{ color: "var(--muted)" }}>Teléfono</label>
          <input className="form-control input-dark" value={form.telefono} onChange={(e) => set("telefono", e.target.value)} autoComplete="off" />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label" style={{ color: "var(--muted)" }}>Año ingreso</label>
          <input type="number" className="form-control input-dark" value={form.ano_ingreso} onChange={(e) => set("ano_ingreso", e.target.value)} autoComplete="off" name="anio-ingreso-edit" />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label" style={{ color: "var(--muted)" }}>Rol</label>
          <select
            className="form-select input-dark"
            value={form.rol_id || ""}
            onChange={(e) => {
              const nuevoRol = e.target.value ? Number(e.target.value) : "";
              setForm((p) => ({ ...p, rol_id: nuevoRol, programas: Number(nuevoRol) === 3 ? p.programas : [] }));
            }}
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
                      id={`prog-e-${prog.programa_id}`}
                      checked={!!asignado}
                      onChange={() => togglePrograma(prog.programa_id)}
                    />
                    <label className="form-check-label" htmlFor={`prog-e-${prog.programa_id}`}>{prog.nombre}</label>
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

        {isAcademico && (
          <>
            {/* Correos */}
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label mb-0" style={{ color: "var(--muted)" }}>Correos</label>
                <button type="button" className="btn btn-sm btn-outline-light" onClick={addCorreo}>
                  <i className="bi bi-plus" /> Agregar
                </button>
              </div>
              {form.correos.map((c, i) => (
                <div key={i} className="d-flex gap-2 mb-2">
                  <input className="form-control input-dark" placeholder="correo@ejemplo.com" value={c.mail} onChange={(e) => updateCorreo(i, e.target.value)} autoComplete="off" />
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeCorreo(i)}>
                    <i className="bi bi-trash" />
                  </button>
                </div>
              ))}
            </div>

            {/* Grado académico */}
            <div className="col-12">
              <label className="form-label" style={{ color: "var(--muted)" }}>Grado académico</label>
            </div>
            <div className="col-12 col-md-6">
              <input className="form-control input-dark" placeholder="Nombre del grado" value={form.grado_academico?.nombre_grado || ""} onChange={(e) => setGrado("nombre_grado", e.target.value)} autoComplete="off" />
            </div>
            <div className="col-12 col-md-6">
              <input className="form-control input-dark" placeholder="Institución" value={form.grado_academico?.institucion_grado || ""} onChange={(e) => setGrado("institucion_grado", e.target.value)} autoComplete="off" />
            </div>
            <div className="col-12 col-md-6">
              <input className="form-control input-dark" placeholder="País" value={form.grado_academico?.pais_grado || ""} onChange={(e) => setGrado("pais_grado", e.target.value)} autoComplete="off" />
            </div>
            <div className="col-12 col-md-6">
              <input className="form-control input-dark" placeholder="Año" value={form.grado_academico?.ano_grado || ""} onChange={(e) => setGrado("ano_grado", e.target.value)} autoComplete="off" />
            </div>

            {/* Titulaciones */}
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label mb-0" style={{ color: "var(--muted)" }}>Titulaciones</label>
                <button type="button" className="btn btn-sm btn-outline-light" onClick={addTitulacion}>
                  <i className="bi bi-plus" /> Agregar
                </button>
              </div>
              {form.titulaciones.map((t, i) => (
                <div key={i} className="row g-2 mb-2">
                  <div className="col-12 col-md-6">
                    <input className="form-control input-dark" placeholder="Título" value={t.titulo} onChange={(e) => updateTitulacion(i, "titulo", e.target.value)} autoComplete="off" />
                  </div>
                  <div className="col-12 col-md-6">
                    <input className="form-control input-dark" placeholder="Institución" value={t.institucion_titulacion} onChange={(e) => updateTitulacion(i, "institucion_titulacion", e.target.value)} autoComplete="off" />
                  </div>
                  <div className="col-8 col-md-5">
                    <input className="form-control input-dark" placeholder="País" value={t.pais_titulacion} onChange={(e) => updateTitulacion(i, "pais_titulacion", e.target.value)} autoComplete="off" />
                  </div>
                  <div className="col-8 col-md-5">
                    <input className="form-control input-dark" placeholder="Año" value={t.ano_titulacion} onChange={(e) => updateTitulacion(i, "ano_titulacion", e.target.value)} autoComplete="off" />
                  </div>
                  <div className="col-4 col-md-2 d-flex align-items-center">
                    <button type="button" className="btn btn-sm btn-outline-danger w-100" onClick={() => removeTitulacion(i)}>
                      <i className="bi bi-trash" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </FormModal>
  );
}