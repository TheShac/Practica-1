import { useEffect, useMemo, useState, useCallback } from "react";
import FormModal from "@/components/overlays/formModal/FormModal";
import YearInput from "../../components/ui/inputs/YearInput";
import TituloInput from "@/components/ui/inputs/TituloInput";
import PeriodoEjecucionInput from "@/components/ui/inputs/PeriodoEjecucionInput";
import RespaldoInput from "@/components/forms/backupLink/RespaldoInput.jsx";
import ActionButtons from "@/components/ui/buttons/ActionButtons";
import BtnNuevo from "@/components/ui/buttons/BtnCreate.jsx";
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

const REQUIRED_FIELDS = [
  { key: "titulo",                 label: "Título" },
  { key: "fuente_financiamiento",  label: "Fuente de financiamiento" },
  { key: "ano_adjudicacion",       label: "Año de adjudicación" },
  { key: "periodo_ejecucion",      label: "Período de ejecución" },
  { key: "rol_proyecto",           label: "Rol en el proyecto" },
];

const validate = (form) => {
  const errs = {};

  REQUIRED_FIELDS.forEach(({ key, label }) => {
    if (!form[key] || String(form[key]).trim() === "") {
      errs[key] = `${label} es obligatorio.`;
    }
  });

  return errs;
};

export default function Investigacion() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode]           = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [touched, setTouched]     = useState({});

  const errors      = useMemo(() => validate(form), [form]);
  const isFormInvalid = Object.keys(errors).length > 0;

  const modalTitle = useMemo(
    () => mode === "create" ? "Nueva Investigación" : "Editar Investigación",
    [mode],
  );

  const setField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  const errorMsg = (key) => (touched[key] && errors[key]) ? errors[key] : null;

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


  const openCreate = () => {
    setMode("create");
    setEditingId(null);
    setForm(emptyForm);
    setTouched({});
    setShowModal(true);
  };

  const openEdit = (row) => {
    setMode("edit");
    setEditingId(row.id);
    setForm(row);
    setTouched({});
    setShowModal(true);
  };

  const close = () => {
    setShowModal(false);
    setTouched({});
  };

  const submit = async () => {
    if (isFormInvalid) {
      setTouched(Object.fromEntries(REQUIRED_FIELDS.map(({ key }) => [key, true])));
      return;
    }

    setSaving(true);
    try {
      const { id, ...dataSinId } = form;

      const payload = {
        ...dataSinId,
        ano_adjudicacion: dataSinId.ano_adjudicacion
          ? Number(dataSinId.ano_adjudicacion)
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
          <div style={{ color: "var(--muted)" }}>Tabla de investigaciones</div>
          <BtnNuevo label="Nueva Investigación" onClick={openCreate} disabled={loading} />
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
                    <th>Fuente de financiamiento</th>
                    <th>Año de adjudicación</th>
                    <th>Período de ejecución</th>
                    <th>Rol en el proyecto</th>
                    <th>Respaldo</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.titulo}</td>
                      <td>{r.fuente_financiamiento || "—"}</td>
                      <td>{r.ano_adjudicacion || "—"}</td>
                      <td>{r.periodo_ejecucion || "—"}</td>
                      <td>{r.rol_proyecto || "—"}</td>
                      <td>
                        <a href={r.link_verificacion || "#"} target="_blank" rel="noreferrer">
                          Ver
                        </a>
                      </td>
                      <td className="text-end">
                        <ActionButtons
                          onEdit={() => openEdit(r)}
                          onDelete={() => remove(r.id)}
                        />
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
        submitDisabled={isFormInvalid || saving}
        submitText={saving ? "Guardando..." : mode === "create" ? "Crear" : "Guardar cambios"}
      >
        <div className="row g-3">
          <div className="col-12">
            <TituloInput
              value={form.titulo}
              onChange={(e) => setField("titulo", e.target.value)}
              placeholder="Título de la investigación"
              className={errorMsg("titulo") ? "is-invalid" : ""}
            />
            {errorMsg("titulo") && (
              <div className="invalid-feedback d-block">{errorMsg("titulo")}</div>
            )}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Fuente de financiamiento*
            </label>
            <input
              className={`form-control input-dark${errorMsg("fuente_financiamiento") ? " is-invalid" : ""}`}
              list="fuentes-financiamiento"
              value={form.fuente_financiamiento}
              onChange={(e) => setField("fuente_financiamiento", e.target.value)}
              placeholder="Selecciona o escribe..."
            />
            <datalist id="fuentes-financiamiento">
              <option value="FONDECYT" />
              <option value="FONDEF" />
              <option value="FONDAP" />
              <option value="BASALES" />
              <option value="CORFO" />
              <option value="ANILLO" />
              <option value="FONIS" />
              <option value="FONIDE" />
            </datalist>
            {errorMsg("fuente_financiamiento") && (
              <div className="invalid-feedback d-block">{errorMsg("fuente_financiamiento")}</div>
            )}
          </div>

          <div className="col-12 col-md-3">
            <YearInput
              value={form.ano_adjudicacion}
              onChange={(val) => setField("ano_adjudicacion", val)}
              error={errorMsg("ano_adjudicacion")}
              label="Año de adjudicación"
              required
            />
          </div>

          <div className="col-12 col-md-3">
            <PeriodoEjecucionInput
              value={form.periodo_ejecucion}
              onChange={(e) => setField("periodo_ejecucion", e.target.value)}
              className={errorMsg("periodo_ejecucion") ? "is-invalid" : ""}
            />
            {errorMsg("periodo_ejecucion") && (
              <div className="invalid-feedback d-block">{errorMsg("periodo_ejecucion")}</div>
            )}
          </div>

          <div className="col-12">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Rol en el proyecto*
            </label>
            <input
              className={`form-control input-dark${errorMsg("rol_proyecto") ? " is-invalid" : ""}`}
              list="roles-proyecto"
              value={form.rol_proyecto}
              onChange={(e) => setField("rol_proyecto", e.target.value)}
              placeholder="Selecciona o escribe un rol..."
            />
            <datalist id="roles-proyecto">
              <option value="Investigador Responsable" />
              <option value="Director" />
              <option value="Co-Investigador" />
            </datalist>
            {errorMsg("rol_proyecto") && (
              <div className="invalid-feedback d-block">{errorMsg("rol_proyecto")}</div>
            )}
          </div>

          <div className="col-12">
            <RespaldoInput
              value={form.link_verificacion}
              onChange={(e) => setForm((prev) => ({ ...prev, link_verificacion: e.target.value }))}
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
