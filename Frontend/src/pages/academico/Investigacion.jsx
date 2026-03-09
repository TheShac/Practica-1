import { useEffect, useMemo, useState } from "react";
import FormModal from "../../components/FormModal";
import YearInput from "../../components/YearInput";
import {
  fetchInvestigaciones,
  createInvestigacion,
  updateInvestigacion,
  deleteInvestigacion,
} from "../../services/investigacion.service";

const emptyForm = {
  titulo: "",
  fuente_financiamiento: "",
  ano_adjudicacion: "",
  periodo_ejecucion: "",
  rol_proyecto: "",
  link_verificacion: "",
};

export default function Investigacion() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const modalTitle = useMemo(() => {
    return mode === "create"
      ? "Nueva Investigación"
      : "Editar Investigación";
  }, [mode]);

  const load = async () => {
    const data = await fetchInvestigaciones();
    setRows(
      data.map((r) => ({
        id: r.investigacion_id,
        titulo: r.titulo || "",
        fuente_financiamiento: r.fuente_financiamiento || "",
        ano_adjudicacion: r.ano_adjudicacion
          ? String(r.ano_adjudicacion)
          : "",
        periodo_ejecucion: r.periodo_ejecucion || "",
        rol_proyecto: r.rol_proyecto || "",
        link_verificacion: r.link_verificacion || "",
      }))
    );
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await load();
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function validate() {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    if (!form.titulo.trim())
      newErrors.titulo = "Título obligatorio";

    if (form.ano_adjudicacion) {
      if (!/^\d{4}$/.test(form.ano_adjudicacion))
        newErrors.ano_adjudicacion = "Debe tener 4 dígitos";
      else if (
        Number(form.ano_adjudicacion) < 1900 ||
        Number(form.ano_adjudicacion) > currentYear
      )
        newErrors.ano_adjudicacion = `Entre 1900 y ${currentYear}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const openCreate = () => {
    setMode("create");
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (row) => {
    setMode("edit");
    setEditingId(row.id);
    setForm(row);
    setShowModal(true);
  };

  const close = () => setShowModal(false);

  const submit = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        ...form,
        ano_adjudicacion: form.ano_adjudicacion
          ? Number(form.ano_adjudicacion)
          : null,
      };

      if (mode === "create") {
        await createInvestigacion(payload);
      } else {
        await updateInvestigacion(editingId, payload);
      }

      await load();
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar esta investigación?")) return;
    await deleteInvestigacion(id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div>
      <h3 className="mb-3 perfil-title">Investigación</h3>

      <div className="panel-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={{ color: "var(--muted)" }}>
            Tabla de investigaciones
          </div>

          <button className="btn btn-primary" onClick={openCreate}>
            <i className="bi bi-plus-lg me-2" />
            Nueva Investigación
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
                    <th>Fuente</th>
                    <th>Año</th>
                    <th>Período</th>
                    <th>Rol</th>
                    <th>Respaldo</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.titulo}</td>
                      <td>{r.fuente_financiamiento}</td>
                      <td>{r.ano_adjudicacion}</td>
                      <td>{r.periodo_ejecucion}</td>
                      <td>{r.rol_proyecto}</td>
                      <td>
                        <a
                          href={r.link_verificacion || "#"}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ver
                        </a>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-light me-2"
                          onClick={() => openEdit(r)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => remove(r.id)}
                        >
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
        submitText={
          saving
            ? "Guardando..."
            : mode === "create"
            ? "Crear"
            : "Guardar cambios"
        }
      >
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label">Título*</label>
            <input
              className="form-control input-dark"
              value={form.titulo}
              onChange={(e) =>
                setForm({ ...form, titulo: e.target.value })
              }
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Fuente financiamiento</label>
            <input
              className="form-control input-dark"
              value={form.fuente_financiamiento}
              onChange={(e) =>
                setForm({
                  ...form,
                  fuente_financiamiento: e.target.value,
                })
              }
            />
          </div>

          <div className="col-12 col-md-3">
            <YearInput
              value={form.ano_adjudicacion}
              onChange={(val) =>
                setForm({ ...form, ano_adjudicacion: val })
              }
              error={errors.ano_adjudicacion}
            />
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label">Período ejecución</label>
            <input
              className="form-control input-dark"
              value={form.periodo_ejecucion}
              onChange={(e) =>
                setForm({
                  ...form,
                  periodo_ejecucion: e.target.value,
                })
              }
              placeholder="Ej: 2023-2026"
            />
          </div>

          <div className="col-12">
            <label className="form-label">Rol en el proyecto</label>
            <input
              className="form-control input-dark"
              value={form.rol_proyecto}
              onChange={(e) =>
                setForm({ ...form, rol_proyecto: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label className="form-label">Respaldo (link)</label>
            <input
              className="form-control input-dark"
              value={form.link_verificacion}
              onChange={(e) =>
                setForm({
                  ...form,
                  link_verificacion: e.target.value,
                })
              }
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
