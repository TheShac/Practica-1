import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import FormModal from "@/components/overlays/formModal/FormModal.jsx";
import YearInput from "@/components/ui/inputs/YearInput.jsx";
import RespaldoInput from "@/components/forms/backupLink/RespaldoInput";
import ActionButtons from "@/components/ui/buttons/ActionButtons";
import BtnNuevo from "@/components/ui/buttons/BtnCreate.jsx";
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
  tesis_dirigida: "",
  ano: "",
  autor: "",
  link_verificacion: "",
  rol_guia: "GUIA",
};

const getRequiredFields = (nivelUpper) => [
  { key: "autor",          label: "Autor" },
  { key: "ano",            label: "Año" },
  { key: "titulo_tesis",   label: "Título" },
  { key: "nombre_programa", label: "Programa" },
  { key: "institucion",    label: "Institución" },
  ...(nivelUpper === "DOCTORADO"
    ? [{ key: "tesis_dirigida", label: "Tesis dirigida en el mismo programa" }]
    : []),
];

const validate = (form, nivelUpper) => {
  const errs = {};
  const requiredFields = getRequiredFields(nivelUpper);

  requiredFields.forEach(({ key, label }) => {
    if (!form[key] || String(form[key]).trim() === "") {
      errs[key] = `${label} es obligatorio.`;
    }
  });
  
  return errs;
};

export default function Tesis() {
  const { nivel } = useParams();
  const nivelUpper = nivel?.toUpperCase();
  const nivelValido = nivelUpper === "MAGISTER" || nivelUpper === "DOCTORADO";

  const [rows, setRows]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode]           = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [touched, setTouched]     = useState({});

  const errors        = useMemo(() => validate(form, nivelUpper), [form, nivelUpper]);
  const isFormInvalid = Object.keys(errors).length > 0;

  const modalTitle = useMemo(() => {
    const nivelTexto = nivelUpper === "MAGISTER" ? "Magíster" : "Doctorado";
    return mode === "create"
      ? `Nueva Tesis (${nivelTexto})`
      : `Editar Tesis (${nivelTexto})`;
  }, [mode, nivelUpper]);

  const setField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  const errorMsg = (key) => (touched[key] && errors[key]) ? errors[key] : null;

  const loadTesis = async () => {
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
  };

  useEffect(() => {
    if (nivelValido) loadTesis();
  }, [nivelUpper]);

  const openCreate = () => {
    setMode("create");
    setEditingId(null);
    setForm(emptyForm);
    setTouched({});
    setShowModal(true);
  };

  const openEdit = (row) => {
    setMode("edit");
    setEditingId(row.tesis_id);
    setForm({ ...row, ano: String(row.ano) });
    setTouched({});
    setShowModal(true);
  };

  const close = () => {
    if (loadingSubmit) return;
    setShowModal(false);
    setTouched({});
  };

  const submit = async () => {
    if (isFormInvalid) {
      setTouched(
        Object.fromEntries(getRequiredFields(nivelUpper).map(({ key }) => [key, true]))
      );
      return;
    }

    try {
      setLoadingSubmit(true);
      const payload = {
        ...form,
        ano:             Number(form.ano),
        nivel_programa:  nivelUpper,
        tesis_dirigida:  nivelUpper === "DOCTORADO" ? form.tesis_dirigida : null,
      };

      if (mode === "create") {
        await createTesis(payload);
      } else {
        await updateTesis(editingId, payload);
      }

      setShowModal(false);
      await loadTesis();
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
      await loadTesis();
    } catch (err) {
      console.error(err);
      alert("Error eliminando tesis");
    }
  };

  const colSpanTotal = nivelUpper === "DOCTORADO" ? 9 : 8;

  if (!nivelValido) return <div>Nivel inválido.</div>;

  return (
    <div>
      <h3 className="mb-3 perfil-title">
        Tesis {nivelUpper === "MAGISTER" ? "Magíster" : "Doctorado"}
      </h3>

      <div className="panel-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
           <div style={{ color: "var(--muted)" }}>Listado de tesis</div>
          <BtnNuevo label="Nueva Tesis" onClick={openCreate} disabled={loading} />
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
                    <th>Título de la Tesis</th>
                    <th>Nombre del programa</th>
                    <th>Institución</th>
                    {nivelUpper === "DOCTORADO" && (
                      <th>¿La tesis fue dirigida en el mismo programa?</th>
                    )}
                    <th>Rol</th>
                    <th>Respaldo</th>
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
                      <td>{r.institucion}</td>
                      {nivelUpper === "DOCTORADO" && (
                        <td>{r.tesis_dirigida || "—"}</td>
                      )}
                      <td>{r.rol_guia}</td>
                      <td>
                        <a
                          href={r.link_verificacion ? r.link_verificacion : "#"}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ver
                        </a>
                      </td>
                      <td className="text-end">
                        <ActionButtons
                          onEdit={() => openEdit(r)}
                          onDelete={() => remove(r.tesis_id)}
                        />
                      </td>
                    </tr>
                  ))}

                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={colSpanTotal} style={{ color: "var(--muted)" }}>
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
        submitDisabled={isFormInvalid || loadingSubmit}
        submitText={loadingSubmit ? "Guardando..." : mode === "create" ? "Crear" : "Guardar cambios"}
      >
        <div className="row g-3">

          <div className="col-12 col-md-6">
            <label className="form-label text-light">Autor*</label>
            <input
              className={`form-control input-dark${errorMsg("autor") ? " is-invalid" : ""}`}
              value={form.autor}
              onChange={(e) => setField("autor", e.target.value)}
            />
            {errorMsg("autor") && (
              <div className="invalid-feedback d-block">{errorMsg("autor")}</div>
            )}
          </div>

          <div className="col-12 col-md-6">
            <YearInput
              value={form.ano}
              onChange={(val) => setField("ano", val)}
              error={errorMsg("ano")}
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label text-light">Título de la Tesis*</label>
            <input
              className={`form-control input-dark${errorMsg("titulo_tesis") ? " is-invalid" : ""}`}
              value={form.titulo_tesis}
              onChange={(e) => setField("titulo_tesis", e.target.value)}
            />
            {errorMsg("titulo_tesis") && (
              <div className="invalid-feedback d-block">{errorMsg("titulo_tesis")}</div>
            )}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label text-light">Nombre del Programa*</label>
            <input
              className={`form-control input-dark${errorMsg("nombre_programa") ? " is-invalid" : ""}`}
              value={form.nombre_programa}
              onChange={(e) => setField("nombre_programa", e.target.value)}
            />
            {errorMsg("nombre_programa") && (
              <div className="invalid-feedback d-block">{errorMsg("nombre_programa")}</div>
            )}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label text-light">Institución*</label>
            <input
              className={`form-control input-dark${errorMsg("institucion") ? " is-invalid" : ""}`}
              value={form.institucion}
              onChange={(e) => setField("institucion", e.target.value)}
            />
            {errorMsg("institucion") && (
              <div className="invalid-feedback d-block">{errorMsg("institucion")}</div>
            )}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label text-light">Rol guía*</label>
            <select
              className="form-select input-dark"
              value={form.rol_guia}
              onChange={(e) => setField("rol_guia", e.target.value)}
            >
              <option value="GUIA">Guía</option>
              <option value="CO_GUIA">Co-Guía</option>
            </select>
          </div>
          
          {nivelUpper === "DOCTORADO" && (
            <div className="col-12 col-md-6">
              <label className="form-label text-light">
                ¿La tesis fue dirigida en el mismo programa?*
              </label>
              <select
                className={`form-select input-dark${errorMsg("tesis_dirigida") ? " is-invalid" : ""}`}
                value={form.tesis_dirigida}
                onChange={(e) => setField("tesis_dirigida", e.target.value)}
              >
                <option value="" disabled>Seleccione</option>
                <option value="Si">Si</option>
                <option value="No">No</option>
              </select>
              {errorMsg("tesis_dirigida") && (
                <div className="invalid-feedback d-block">{errorMsg("tesis_dirigida")}</div>
              )}
            </div>
          )}
        </div>

        <div className="col-12 col-md">
          <RespaldoInput
              value={form.link_verificacion}
              onChange={(e) => setForm((prev) => ({ ...prev, link_verificacion: e.target.value }))}
            />
        </div>
      </FormModal>
    </div>
  );
}
