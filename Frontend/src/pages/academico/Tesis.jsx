import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import FormModal from "../../components/FormModal";
import YearInput from "../../components/YearInput";
import {
  fetchTesis,
  createTesis,
  updateTesis,
  deleteTesis,
} from "../../services/tesis.service";

const emptyForm = {
  titulo_tesis: "",
  nombre_programa: "",
  institucion: "",
  ano: "",
  autor: "",
  link_verificacion: "",
  rol_guia: "GUIA",
};

export default function Tesis() {
  const { nivel } = useParams();
  const nivelUpper = nivel?.toUpperCase();

  const nivelValido =
    nivelUpper === "MAGISTER" || nivelUpper === "DOCTORADO";

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (nivelValido) loadTesis();
  }, [nivelUpper]);

  useEffect(() => {
    if (showModal) validate();
  }, [form]);

  async function loadTesis() {
    try {
      setLoading(true);
      const data = await fetchTesis(nivelUpper);
      setRows(data);
    } catch (err) {
      console.error(err);
      alert("Error cargando tesis");
    } finally {
      setLoading(false);
    }
  }

  const modalTitle = useMemo(() => {
    const nivelTexto =
      nivelUpper === "MAGISTER" ? "Magíster" : "Doctorado";

    return mode === "create"
      ? `Nueva Tesis (${nivelTexto})`
      : `Editar Tesis (${nivelTexto})`;
  }, [mode, nivelUpper]);

  function validate() {
    const newErrors = {};
    const currentYear = new Date().getFullYear();
    const anoNumber = Number(form.ano);

    if (!form.autor.trim())
      newErrors.autor = "El autor es obligatorio";

    if (!form.titulo_tesis.trim())
      newErrors.titulo_tesis = "El título es obligatorio";

    if (!form.nombre_programa.trim())
      newErrors.nombre_programa = "El programa es obligatorio";

    if (!form.institucion.trim())
      newErrors.institucion = "La institución es obligatoria";

    if (!form.ano)
      newErrors.ano = "El año es obligatorio";
    else if (!/^\d{4}$/.test(form.ano))
      newErrors.ano = "Debe tener 4 dígitos numéricos";
    else if (anoNumber < 1900 || anoNumber > currentYear)
      newErrors.ano = `Debe estar entre 1900 y ${currentYear}`;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const isFormValid =
    Object.keys(errors).length === 0 &&
    form.ano.length === 4;

  const openCreate = () => {
    setMode("create");
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (row) => {
    setMode("edit");
    setEditingId(row.tesis_id);
    setForm({
      ...row,
      ano: String(row.ano),
    });
    setErrors({});
    setShowModal(true);
  };

  const close = () => {
    if (loadingSubmit) return; // evita cerrar mientras guarda
    setShowModal(false);
    setErrors({});
  };

  /* =========================
     SUBMIT
  ========================== */

  const submit = async () => {
    if (!validate()) return;

    try {
      setLoadingSubmit(true);

      const payload = {
        ...form,
        ano: Number(form.ano),
        nivel_programa: nivelUpper,
      };

      if (mode === "create") {
        await createTesis(payload);
      } else {
        await updateTesis(editingId, payload);
      }

      setShowModal(false);
      loadTesis();
    } catch (err) {
      console.error(err);
      alert(err.message || "Error guardando tesis");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar esta tesis?")) return;

    try {
      await deleteTesis(id);
      loadTesis();
    } catch (err) {
      console.error(err);
      alert("Error eliminando tesis");
    }
  };

  if (!nivelValido) {
    return <div>Nivel inválido.</div>;
  }

  return (
    <div>
      <h3 className="mb-3">
        Tesis {nivelUpper === "MAGISTER" ? "Magíster" : "Doctorado"}
      </h3>

      <div className="panel-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={{ color: "var(--muted)" }}>
            Listado de tesis
          </div>

          <button className="btn btn-primary" onClick={openCreate}>
            <i className="bi bi-plus-lg me-2" />
            Nueva Tesis
          </button>
        </div>

        {loading ? (
          <div style={{ color: "var(--muted)" }}>
            Cargando...
          </div>
        ) : (
          <div className="table-wrap">
            <div className="table-responsive">
              <table className="table table-dark table-dark-custom align-middle">
                <thead>
                  <tr>
                    <th>Autor</th>
                    <th>Año</th>
                    <th>Título</th>
                    <th>Programa</th>
                    <th>Rol</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.tesis_id}>
                      <td>{r.autor}</td>
                      <td>{r.ano}</td>
                      <td>{r.titulo_tesis}</td>
                      <td>{r.nombre_programa}</td>
                      <td>{r.rol_guia}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-light me-2"
                          onClick={() => openEdit(r)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => remove(r.tesis_id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}

                  {rows.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ color: "var(--muted)" }}>
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
          loadingSubmit
            ? "Guardando..."
            : mode === "create"
            ? "Crear"
            : "Guardar cambios"
        }
        submitDisabled={!isFormValid || loadingSubmit}
      >
        <div className="row g-3">

          <div className="col-12 col-md-6">
            <label className="form-label text-light">Autor</label>
            <input
              className={`form-control input-dark ${errors.autor ? "is-invalid" : ""}`}
              value={form.autor}
              onChange={(e) =>
                setForm({ ...form, autor: e.target.value })
              }
            />
            {errors.autor && (
              <div className="invalid-feedback d-block">
                {errors.autor}
              </div>
            )}
          </div>

          <div className="col-12 col-md-6">
            <YearInput
              value={form.ano}
              onChange={(val) =>
                setForm({ ...form, ano: val })
              }
              error={errors.ano}
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label text-light">Título</label>
            <input
              className={`form-control input-dark ${errors.titulo_tesis ? "is-invalid" : ""}`}
              value={form.titulo_tesis}
              onChange={(e) =>
                setForm({
                  ...form,
                  titulo_tesis: e.target.value,
                })
              }
            />
            {errors.titulo_tesis && (
              <div className="invalid-feedback d-block">
                {errors.titulo_tesis}
              </div>
            )}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label text-light">Programa</label>
            <input
              className={`form-control input-dark ${errors.nombre_programa ? "is-invalid" : ""}`}
              value={form.nombre_programa}
              onChange={(e) =>
                setForm({
                  ...form,
                  nombre_programa: e.target.value,
                })
              }
            />
            {errors.nombre_programa && (
              <div className="invalid-feedback d-block">
                {errors.nombre_programa}
              </div>
            )}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label text-light">Institución</label>
            <input
              className={`form-control input-dark ${errors.institucion ? "is-invalid" : ""}`}
              value={form.institucion}
              onChange={(e) =>
                setForm({
                  ...form,
                  institucion: e.target.value,
                })
              }
            />
            {errors.institucion && (
              <div className="invalid-feedback d-block">
                {errors.institucion}
              </div>
            )}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label text-light">Rol guía</label>
            <select
              className="form-select input-dark"
              value={form.rol_guia}
              onChange={(e) =>
                setForm({
                  ...form,
                  rol_guia: e.target.value,
                })
              }
            >
              <option value="GUIA">Guía</option>
              <option value="CO_GUIA">Co-Guía</option>
            </select>
          </div>

        </div>
      </FormModal>
    </div>
  );
}
