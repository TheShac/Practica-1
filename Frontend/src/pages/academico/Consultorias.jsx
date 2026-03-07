
import { useEffect, useMemo, useState } from "react";
import FormModal from "@/components/FormModal.jsx";
import RespaldoInput from "@/components/forms/backupLink/RespaldoInput.jsx";
import {
  getMisConsultorias,
  createConsultoria,
  updateConsultoria,
  deleteConsultoria,
} from "../../services/consultoria.service.js";

const emptyForm = {
  titulo: "",
  institucion_contratante: "",
  ano_adjudicacion: "",
  periodo_ejecucion: "",
  objetivo: "",
  link_verificacion: "",
};

export default function Consultorias() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode]           = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [errors, setErrors]       = useState({});

  const modalTitle = useMemo(
    () => mode === "create" ? "Nueva Consultoría" : "Editar Consultoría",
    [mode]
  );

  const load = async () => {
    const data = await getMisConsultorias();
    setRows(data);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await load();
      } catch (err) {
        console.error(err);
        alert(err.message || "Error cargando consultorías");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const validate = () => {
    const e = {};
    const currentYear = new Date().getFullYear();

    if (!form.titulo.trim())
      e.titulo = "El título es obligatorio";

    if (form.ano_adjudicacion) {
      if (!/^\d{4}$/.test(form.ano_adjudicacion))
        e.ano_adjudicacion = "Debe tener 4 dígitos";
      else if (Number(form.ano_adjudicacion) < 1900 || Number(form.ano_adjudicacion) > currentYear)
        e.ano_adjudicacion = `Entre 1900 y ${currentYear}`;
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openCreate = () => {
    setMode("create");
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (row) => {
    setMode("edit");
    setEditingId(row.consultoria_id);
    setForm({
      titulo:                  row.titulo || "",
      institucion_contratante: row.institucion_contratante || "",
      ano_adjudicacion:        row.ano_adjudicacion ? String(row.ano_adjudicacion) : "",
      periodo_ejecucion:       row.periodo_ejecucion || "",
      objetivo:                row.objetivo || "",
      link_verificacion:       row.link_verificacion || "",
    });
    setErrors({});
    setShowModal(true);
  };

  const close = () => setShowModal(false);

  const submit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        ano_adjudicacion: form.ano_adjudicacion ? Number(form.ano_adjudicacion) : null,
      };

      if (mode === "create") {
        await createConsultoria(payload);
      } else {
        await updateConsultoria(editingId, payload);
      }

      await load();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error guardando consultoría");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar esta consultoría?")) return;
    try {
      await deleteConsultoria(id);
      setRows((prev) => prev.filter((r) => r.consultoria_id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Error eliminando consultoría");
    }
  };

  return (
    <div>
      <h3 className="mb-3">Consultorías</h3>

      <div className="panel-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={{ color: "var(--muted)" }}>Tabla de consultorías</div>
          <button className="btn btn-primary" onClick={openCreate} disabled={loading}>
            <i className="bi bi-plus-lg me-2" />
            Nueva Consultoría
          </button>
        </div>

        {loading ? (
          <div style={{ color: "var(--muted)" }}>Cargando...</div>
        ) : (
          <div className="table-wrap">
            <div className="table-responsive">
              <table className="table table-dark table-dark-custom align-middle">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Institución contratante</th>
                    <th>Año adjudicación</th>
                    <th>Período ejecución</th>
                    <th>Objetivo</th>
                    <th>Respaldo</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.consultoria_id}>
                      <td>{r.titulo}</td>
                      <td>{r.institucion_contratante || "—"}</td>
                      <td>{r.ano_adjudicacion || "—"}</td>
                      <td>{r.periodo_ejecucion || "—"}</td>
                      <td
                        style={{
                          maxWidth: 250,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={r.objetivo}
                      >
                        {r.objetivo || "—"}
                      </td>
                      <td>
                        <a
                          href={r.link_verificacion || "#"}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ver
                        </a>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-light me-2"
                          onClick={() => openEdit(r)}
                        >
                          <i className="bi bi-pencil me-1" />
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => remove(r.consultoria_id)}
                        >
                          <i className="bi bi-trash me-1" />
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}

                  {rows.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ color: "var(--muted)" }}>
                        Sin registros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <FormModal
        show={showModal}
        title={modalTitle}
        onClose={close}
        onSubmit={submit}
        submitText={saving ? "Guardando..." : mode === "create" ? "Crear" : "Guardar cambios"}
      >
        <div className="row g-3">

          <div className="col-12">
            <label className="form-label" style={{ color: "var(--muted)" }}>Título*</label>
            <input
              className={`form-control input-dark${errors.titulo ? " is-invalid" : ""}`}
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              placeholder="Título de la consultoría"
            />
            {errors.titulo && <div className="invalid-feedback">{errors.titulo}</div>}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label" style={{ color: "var(--muted)" }}>Institución contratante</label>
            <input
              className="form-control input-dark"
              value={form.institucion_contratante}
              onChange={(e) => setForm({ ...form, institucion_contratante: e.target.value })}
              placeholder="Nombre de la institución"
            />
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label" style={{ color: "var(--muted)" }}>Año adjudicación</label>
            <input
              className={`form-control input-dark${errors.ano_adjudicacion ? " is-invalid" : ""}`}
              value={form.ano_adjudicacion}
              onChange={(e) => setForm({ ...form, ano_adjudicacion: e.target.value })}
              placeholder="2024"
            />
            {errors.ano_adjudicacion && <div className="invalid-feedback">{errors.ano_adjudicacion}</div>}
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label" style={{ color: "var(--muted)" }}>Período ejecución</label>
            <input
              className="form-control input-dark"
              value={form.periodo_ejecucion}
              onChange={(e) => setForm({ ...form, periodo_ejecucion: e.target.value })}
              placeholder="Ej: 2024-2026"
            />
          </div>

          <div className="col-12">
            <label className="form-label" style={{ color: "var(--muted)" }}>Objetivo</label>
            <textarea
              className="form-control input-dark"
              rows={3}
              value={form.objetivo}
              onChange={(e) => setForm({ ...form, objetivo: e.target.value })}
              placeholder="Descripción del objetivo de la consultoría"
            />
          </div>

          <div className="col-12">
            <RespaldoInput
              value={form.link_verificacion}
              onChange={(e) => setForm({ ...form, link_verificacion: e.target.value })}
            />
          </div>

        </div>
      </FormModal>
    </div>
  );
}