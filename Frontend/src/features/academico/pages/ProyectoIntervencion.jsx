import { useEffect, useMemo, useState, useCallback } from "react";
import FormModal             from "@/shared/components/modals/formModal/FormModal.jsx";
import BtnNuevo              from "@/shared/components/ui/buttons/BtnCreate.jsx";
import YearInput             from "@/shared/components/ui/inputs/YearInput.jsx";
import TituloInput           from "@/shared/components/ui/inputs/TituloInput";
import PeriodoEjecucionInput from "@/shared/components/ui/inputs/PeriodoEjecucionInput.jsx";
import RespaldoInput         from "@/shared/components/forms/backupLink/RespaldoInput.jsx";
import ActionButtons         from "@/shared/components/ui/buttons/ActionButtons.jsx";
import ConfirmModal          from "@/shared/components/modals/ConfirmModal.jsx";
import Toast                 from "@/shared/components/ui/feedback/Toast.jsx";
import { useConfirm }    from "@/shared/hooks/useConfirm.js";
import { usePagination } from "@/shared/hooks/usePagination.js";
import Pagination        from "@/shared/components/ui/Pagination.jsx";
import { sanitizeInput, sanitizeObject } from "@/shared/utils/sanitize.js";

import {
  getMisIntervenciones, createIntervencion,
  updateIntervencion, deleteIntervencion,
} from "@/features/academico/services/produccion-cientifica/intervencion.service.js";

const emptyForm = {
  titulo: "", fuente_financiamiento: "", ano_adjudicacion: "",
  periodo_ejecucion: "", rol_proyecto: "", link_verificacion: "",
};

const REQUIRED_FIELDS = [
  { key: "titulo",                label: "Título" },
  { key: "fuente_financiamiento", label: "Fuente de financiamiento" },
  { key: "ano_adjudicacion",      label: "Año de adjudicación" },
  { key: "periodo_ejecucion",     label: "Período de ejecución" },
  { key: "rol_proyecto",          label: "Rol en el proyecto" },
];

const validate = (form) => {
  const errs = {};
  REQUIRED_FIELDS.forEach(({ key, label }) => {
    if (!form[key] || String(form[key]).trim() === "")
      errs[key] = `${label} es obligatorio.`;
  });
  return errs;
};

export default function ProyectoIntervencion() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode]           = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [touched, setTouched]     = useState({});
  const [toast, setToast]         = useState({ show: false, message: "", type: "success" });

  const { confirmState, confirm, closeConfirm } = useConfirm();
  const { pageRows, page, setPage, total, totalPages, perPage } = usePagination(rows);

  const errors        = useMemo(() => validate(form), [form]);
  const isFormInvalid = Object.keys(errors).length > 0;
  const modalTitle    = mode === "create" ? "Nuevo Proyecto de Intervención" : "Editar Proyecto de Intervención";

  const setField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: sanitizeInput(value) }));
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  const errorMsg = (key) => (touched[key] && errors[key]) ? errors[key] : null;

  const load = async () => {
    const data = await getMisIntervenciones();
    setRows(data.map((p) => ({
      id:                    p.proyecto_id,
      titulo:                p.titulo || "",
      fuente_financiamiento: p.fuente_financiamiento || "",
      ano_adjudicacion:      p.ano_adjudicacion ? String(p.ano_adjudicacion) : "",
      periodo_ejecucion:     p.periodo_ejecucion || "",
      rol_proyecto:          p.rol_proyecto || "",
      link_verificacion:     p.link_verificacion || "",
    })));
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await load();
      } catch (err) {
        setToast({ show: true, message: err.message || "Error cargando proyectos", type: "error" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openCreate = () => {
    setMode("create"); setEditingId(null);
    setForm(emptyForm); setTouched({});
    setShowModal(true);
  };

  const openEdit = (row) => {
    setMode("edit"); setEditingId(row.id);
    setForm({
      titulo:                row.titulo,
      fuente_financiamiento: row.fuente_financiamiento,
      ano_adjudicacion:      row.ano_adjudicacion,
      periodo_ejecucion:     row.periodo_ejecucion,
      rol_proyecto:          row.rol_proyecto,
      link_verificacion:     row.link_verificacion,
    });
    setTouched({}); setShowModal(true);
  };

  const close = () => { setShowModal(false); setTouched({}); };

  const submit = async () => {
    if (isFormInvalid) {
      setTouched(Object.fromEntries(REQUIRED_FIELDS.map(({ key }) => [key, true])));
      return;
    }
    setSaving(true);
    try {
      const clean = sanitizeObject(form);
      const payload = {
        titulo:                clean.titulo,
        fuente_financiamiento: clean.fuente_financiamiento,
        ano_adjudicacion:      clean.ano_adjudicacion ? Number(clean.ano_adjudicacion) : null,
        periodo_ejecucion:     clean.periodo_ejecucion,
        rol_proyecto:          clean.rol_proyecto,
        link_verificacion:     clean.link_verificacion,
      };

      if (mode === "create") {
        await createIntervencion(payload);
      } else {
        await updateIntervencion(editingId, payload);
      }

      await load();
      setShowModal(false);
      setToast({ show: true, message: mode === "create" ? "Proyecto creado correctamente." : "Proyecto actualizado correctamente.", type: "success" });
    } catch (err) {
      setToast({ show: true, message: err.message || "Error guardando proyecto", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const remove = (row) => {
    confirm({
      title:       "¿Eliminar proyecto?",
      message:     `Se eliminará "${row.titulo}". Esta acción no se puede deshacer.`,
      confirmText: "Eliminar",
      onConfirm:   async () => {
        try {
          await deleteIntervencion(row.id);
          setRows((prev) => prev.filter((r) => r.id !== row.id));
          setToast({ show: true, message: "Proyecto eliminado correctamente.", type: "success" });
        } catch (err) {
          setToast({ show: true, message: err.message || "Error eliminando proyecto", type: "error" });
        }
      },
    });
  };

  return (
    <div>
      <h3 className="mb-3 perfil-title">Proyectos de Intervención</h3>

      <div className="panel-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={{ color: "var(--muted)" }}>Tabla de proyectos de intervención</div>
          <BtnNuevo label="Nuevo Proyecto" onClick={openCreate} disabled={loading} />
        </div>

        {loading ? (
          <div style={{ color: "var(--muted)" }}>Cargando...</div>
        ) : (
          <>
          <div className="table-wrap">
            <div className="table-responsive">
              <table className="table table-dark table-dark-custom align-middle">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Fuente financiamiento</th>
                    <th>Año de adjudicación</th>
                    <th>Período de ejecución</th>
                    <th>Rol en el proyecto</th>
                    <th>Respaldo</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.titulo}</td>
                      <td>{r.fuente_financiamiento || "—"}</td>
                      <td>{r.ano_adjudicacion || "—"}</td>
                      <td>{r.periodo_ejecucion || "—"}</td>
                      <td>{r.rol_proyecto || "—"}</td>
                      <td>
                        {r.link_verificacion
                          ? <a href={r.link_verificacion} target="_blank" rel="noreferrer">Ver</a>
                          : "—"
                        }
                      </td>
                      <td className="text-end">
                        <ActionButtons onEdit={() => openEdit(r)} onDelete={() => remove(r)} />
                      </td>
                    </tr>
                  ))}
                  {total === 0 && (
                    <tr>
                      <td colSpan="7" style={{ color: "var(--muted)" }}>Sin registros.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={page} totalPages={totalPages} total={total} perPage={perPage} onPageChange={setPage} />
          </>
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
              placeholder="Título del proyecto"
              className={errorMsg("titulo") ? "is-invalid" : ""}
            />
            {errorMsg("titulo") && <div className="invalid-feedback d-block">{errorMsg("titulo")}</div>}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label" style={{ color: "var(--muted)" }}>Fuente de financiamiento*</label>
            <input
              className={`form-control input-dark${errorMsg("fuente_financiamiento") ? " is-invalid" : ""}`}
              value={form.fuente_financiamiento}
              onChange={(e) => setField("fuente_financiamiento", e.target.value)}
            />
            {errorMsg("fuente_financiamiento") && <div className="invalid-feedback d-block">{errorMsg("fuente_financiamiento")}</div>}
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

          <div className="col-12">
            <PeriodoEjecucionInput
              value={form.periodo_ejecucion}
              onChange={(e) => setField("periodo_ejecucion", e.target.value)}
              className={errorMsg("periodo_ejecucion") ? "is-invalid" : ""}
            />
            {errorMsg("periodo_ejecucion") && <div className="invalid-feedback d-block">{errorMsg("periodo_ejecucion")}</div>}
          </div>

          <div className="col-12">
            <label className="form-label" style={{ color: "var(--muted)" }}>Rol en el proyecto*</label>
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
            {errorMsg("rol_proyecto") && <div className="invalid-feedback d-block">{errorMsg("rol_proyecto")}</div>}
          </div>

          <div className="col-12">
            <RespaldoInput
              value={form.link_verificacion}
              onChange={(e) => setField("link_verificacion", e.target.value)}
            />
          </div>
        </div>
      </FormModal>

      <ConfirmModal {...confirmState} onClose={closeConfirm} />

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
    </div>
  );
}