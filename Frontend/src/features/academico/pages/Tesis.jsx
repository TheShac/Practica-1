import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams }     from "react-router-dom";
import FormModal         from "@/shared/components/modals/formModal/FormModal.jsx";
import YearInput         from "@/shared/components/ui/inputs/YearInput.jsx";
import RespaldoInput     from "@/shared/components/forms/backupLink/RespaldoInput";
import ActionButtons     from "@/shared/components/ui/buttons/ActionButtons";
import BtnNuevo          from "@/shared/components/ui/buttons/BtnCreate.jsx";
import ConfirmModal      from "@/shared/components/modals/ConfirmModal.jsx";
import Toast             from "@/shared/components/ui/feedback/Toast.jsx";
import { useConfirm }    from "@/shared/hooks/useConfirm.js";
import { usePagination } from "@/shared/hooks/usePagination.js";
import Pagination        from "@/shared/components/ui/Pagination.jsx";
import { sanitizeInput, sanitizeObject } from "@/shared/utils/sanitize.js";

import {
  fetchTesis, createTesis, updateTesis, deleteTesis,
} from "@/features/academico/services/produccion-cientifica/tesis.service.js";

const emptyForm = {
  titulo_tesis: "", nombre_programa: "", institucion: "",
  tesis_dirigida: "", ano: "", autor: "",
  link_verificacion: "", rol_guia: "GUIA",
};

const getRequiredFields = (nivelUpper) => [
  { key: "autor",           label: "Autor" },
  { key: "ano",             label: "Año" },
  { key: "titulo_tesis",    label: "Título" },
  { key: "nombre_programa", label: "Programa" },
  { key: "institucion",     label: "Institución" },
  ...(nivelUpper === "DOCTORADO"
    ? [{ key: "tesis_dirigida", label: "Tesis dirigida en el mismo programa" }]
    : []),
];

const validate = (form, nivelUpper) => {
  const errs = {};
  getRequiredFields(nivelUpper).forEach(({ key, label }) => {
    if (!form[key] || String(form[key]).trim() === "")
      errs[key] = `${label} es obligatorio.`;
  });
  return errs;
};

export default function Tesis() {
  const { nivel }      = useParams();
  const nivelUpper     = nivel?.toUpperCase();
  const nivelValido    = nivelUpper === "MAGISTER" || nivelUpper === "DOCTORADO";
  const nivelTexto     = nivelUpper === "MAGISTER" ? "Magíster" : "Doctorado";

  const [rows, setRows]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showModal, setShowModal]   = useState(false);
  const [mode, setMode]             = useState("create");
  const [editingId, setEditingId]   = useState(null);
  const [form, setForm]             = useState(emptyForm);
  const [touched, setTouched]       = useState({});
  const [toast, setToast]           = useState({ show: false, message: "", type: "success" });

  const { confirmState, confirm, closeConfirm } = useConfirm();
  const { pageRows, page, setPage, total, totalPages, perPage } = usePagination(rows);

  const errors        = useMemo(() => validate(form, nivelUpper), [form, nivelUpper]);
  const isFormInvalid = Object.keys(errors).length > 0;
  const modalTitle    = mode === "create" ? `Nueva Tesis (${nivelTexto})` : `Editar Tesis (${nivelTexto})`;

  const setField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: sanitizeInput(value) }));
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  const errorMsg = (key) => (touched[key] && errors[key]) ? errors[key] : null;

  const loadTesis = async () => {
    try {
      setLoading(true);
      const data = await fetchTesis(nivelUpper);
      setRows(data);
    } catch (err) {
      setToast({ show: true, message: err.message || "Error cargando tesis", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (nivelValido) loadTesis();
  }, [nivelUpper]);

  const openCreate = () => {
    setMode("create"); setEditingId(null);
    setForm(emptyForm); setTouched({});
    setShowModal(true);
  };

  const openEdit = (row) => {
    setMode("edit"); setEditingId(row.tesis_id);
    setForm({ ...row, ano: String(row.ano) });
    setTouched({}); setShowModal(true);
  };

  const close = () => {
    if (loadingSubmit) return;
    setShowModal(false); setTouched({});
  };

  const submit = async () => {
    if (isFormInvalid) {
      setTouched(Object.fromEntries(getRequiredFields(nivelUpper).map(({ key }) => [key, true])));
      return;
    }
    try {
      setLoadingSubmit(true);

      // Sanitización estricta antes de enviar
      const clean = sanitizeObject(form);

      const payload = {
        ...clean,
        ano:            Number(clean.ano),
        nivel_programa: nivelUpper,
        tesis_dirigida: nivelUpper === "DOCTORADO" ? clean.tesis_dirigida : null,
      };

      if (mode === "create") {
        await createTesis(payload);
      } else {
        await updateTesis(editingId, payload);
      }

      setShowModal(false);
      await loadTesis();
      setToast({ show: true, message: mode === "create" ? "Tesis creada correctamente." : "Tesis actualizada correctamente.", type: "success" });
    } catch (err) {
      setToast({ show: true, message: err.message || "Error guardando tesis", type: "error" });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const remove = (row) => {
    confirm({
      title:       "¿Eliminar tesis?",
      message:     `Se eliminará "${row.titulo_tesis}". Esta acción no se puede deshacer.`,
      confirmText: "Eliminar",
      onConfirm:   async () => {
        try {
          await deleteTesis(row.tesis_id);
          await loadTesis();
          setToast({ show: true, message: "Tesis eliminada correctamente.", type: "success" });
        } catch (err) {
          setToast({ show: true, message: err.message || "Error eliminando tesis", type: "error" });
        }
      },
    });
  };

  if (!nivelValido) return <div>Nivel inválido.</div>;

  return (
    <div>
      <h3 className="mb-3 perfil-title">Tesis {nivelTexto}</h3>

      <div className="panel-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={{ color: "var(--muted)" }}>Listado de tesis</div>
          <BtnNuevo label="Nueva Tesis" onClick={openCreate} disabled={loading} />
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
                    <th>Autor</th>
                    <th>Año</th>
                    <th>Título de la Tesis</th>
                    <th>Nombre del programa</th>
                    <th>Institución</th>
                    {nivelUpper === "DOCTORADO" && <th>¿Dirigida en el mismo programa?</th>}
                    <th>Rol</th>
                    <th>Respaldo</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((r) => (
                    <tr key={r.tesis_id}>
                      <td>{r.autor}</td>
                      <td>{r.ano}</td>
                      <td>{r.titulo_tesis}</td>
                      <td>{r.nombre_programa}</td>
                      <td>{r.institucion}</td>
                      {nivelUpper === "DOCTORADO" && <td>{r.tesis_dirigida || "—"}</td>}
                      <td>{r.rol_guia}</td>
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
                      <td colSpan={nivelUpper === "DOCTORADO" ? 9 : 8} style={{ color: "var(--muted)" }}>
                        Sin registros.
                      </td>
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
            {errorMsg("autor") && <div className="invalid-feedback d-block">{errorMsg("autor")}</div>}
          </div>

          <div className="col-12 col-md-6">
            <YearInput value={form.ano} onChange={(val) => setField("ano", val)} error={errorMsg("ano")} required />
          </div>

          <div className="col-12">
            <label className="form-label text-light">Título de la Tesis*</label>
            <input
              className={`form-control input-dark${errorMsg("titulo_tesis") ? " is-invalid" : ""}`}
              value={form.titulo_tesis}
              onChange={(e) => setField("titulo_tesis", e.target.value)}
            />
            {errorMsg("titulo_tesis") && <div className="invalid-feedback d-block">{errorMsg("titulo_tesis")}</div>}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label text-light">Nombre del Programa*</label>
            <input
              className={`form-control input-dark${errorMsg("nombre_programa") ? " is-invalid" : ""}`}
              value={form.nombre_programa}
              onChange={(e) => setField("nombre_programa", e.target.value)}
            />
            {errorMsg("nombre_programa") && <div className="invalid-feedback d-block">{errorMsg("nombre_programa")}</div>}
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label text-light">Institución*</label>
            <input
              className={`form-control input-dark${errorMsg("institucion") ? " is-invalid" : ""}`}
              value={form.institucion}
              onChange={(e) => setField("institucion", e.target.value)}
            />
            {errorMsg("institucion") && <div className="invalid-feedback d-block">{errorMsg("institucion")}</div>}
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
              <label className="form-label text-light">¿La tesis fue dirigida en el mismo programa?*</label>
              <select
                className={`form-select input-dark${errorMsg("tesis_dirigida") ? " is-invalid" : ""}`}
                value={form.tesis_dirigida}
                onChange={(e) => setField("tesis_dirigida", e.target.value)}
              >
                <option value="" disabled>Seleccione</option>
                <option value="Si">Si</option>
                <option value="No">No</option>
              </select>
              {errorMsg("tesis_dirigida") && <div className="invalid-feedback d-block">{errorMsg("tesis_dirigida")}</div>}
            </div>
          )}

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