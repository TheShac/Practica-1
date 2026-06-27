import { useEffect, useMemo, useState, useCallback } from "react";
import FormModal           from "@/shared/components/modals/formModal/FormModal.jsx";
import EstadoSelect        from "@/shared/components/forms/statusSelect/EstadoSelect.jsx";
import YearInput           from "@/shared/components/ui/inputs/YearInput.jsx";
import AutoresInput        from "@/shared/components/forms/authorInput/AutoresInput.jsx";
import AutorPrincipalInput from "@/shared/components/forms/authorInput/AutorPrincipalInput.jsx";
import NombreLibroInput    from "@/shared/components/forms/book/NombreLibroInput";
import LugarInput          from "@/shared/components/forms/book/LugarInput.jsx";
import EditorialInput      from "@/shared/components/forms/book/EditorialInput.jsx";
import RespaldoInput       from "@/shared/components/forms/backupLink/RespaldoInput.jsx";
import ActionButtons       from "@/shared/components/ui/buttons/ActionButtons.jsx";
import BtnNuevo            from "@/shared/components/ui/buttons/BtnCreate.jsx";
import ConfirmModal        from "@/shared/components/modals/ConfirmModal.jsx";
import Toast               from "@/shared/components/ui/feedback/Toast.jsx";
import { useConfirm }      from "@/shared/hooks/useConfirm.js";
import { usePagination }   from "@/shared/hooks/usePagination.js";
import Pagination          from "@/shared/components/ui/Pagination.jsx";
import { sanitizeInput, sanitizeObject } from "@/shared/utils/sanitize.js";

import { createLibro, deleteLibro, getMisLibros, updateLibro } from "@/features/academico/services/produccion-cientifica/libro.service.js";

const emptyForm = {
  autores: "", autor_principal: "", ano: "", nombre_libro: "",
  lugar: "", editorial: "", estado: "Publicado", link_verificacion: "",
};

const REQUIRED_FIELDS = [
  { key: "autores",         label: "Autor(es)" },
  { key: "autor_principal", label: "Autor/a principal" },
  { key: "ano",             label: "Año" },
  { key: "nombre_libro",    label: "Nombre libro" },
  { key: "lugar",           label: "Lugar" },
  { key: "editorial",       label: "Editorial" },
  { key: "estado",          label: "Estado" },
];

const validate = (form) => {
  const errs = {};
  REQUIRED_FIELDS.forEach(({ key, label }) => {
    if (!form[key] || String(form[key]).trim() === "")
      errs[key] = `${label} es obligatorio.`;
  });
  return errs;
};

export default function Libros() {
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
  const modalTitle    = mode === "create" ? "Nuevo Libro" : "Editar Libro";

  const setField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: sanitizeInput(value) }));
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  const errorMsg = (key) => (touched[key] && errors[key]) ? errors[key] : null;

  const load = async () => {
    const data = await getMisLibros();
    setRows(data.map((b) => ({
      id:                b.libro_id,
      autores:           b.autores || "",
      autor_principal:   b.autor_principal || "",
      ano:               b.ano ? String(b.ano) : "",
      nombre_libro:      b.nombre_libro || "",
      lugar:             b.lugar || "",
      editorial:         b.editorial || "",
      estado:            b.estado || "Publicado",
      link_verificacion: b.link_verificacion || "",
    })));
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await load();
      } catch (err) {
        setToast({ show: true, message: err.message || "Error cargando libros", type: "error" });
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
      autores:           row.autores,
      autor_principal:   row.autor_principal,
      ano:               row.ano,
      nombre_libro:      row.nombre_libro,
      lugar:             row.lugar,
      editorial:         row.editorial,
      estado:            row.estado || "Publicado",
      link_verificacion: row.link_verificacion,
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
        autores:           clean.autores,
        autor_principal:   clean.autor_principal,
        ano:               clean.ano ? Number(clean.ano) : null,
        nombre_libro:      clean.nombre_libro,
        lugar:             clean.lugar,
        editorial:         clean.editorial,
        estado:            clean.estado,
        link_verificacion: clean.link_verificacion,
      };

      if (mode === "create") {
        await createLibro(payload);
      } else {
        await updateLibro(editingId, payload);
      }

      await load();
      setShowModal(false);
      setToast({ show: true, message: mode === "create" ? "Libro creado correctamente." : "Libro actualizado correctamente.", type: "success" });
    } catch (err) {
      setToast({ show: true, message: err.message || "Error guardando libro", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const remove = (row) => {
    confirm({
      title:       "¿Eliminar libro?",
      message:     `Se eliminará "${row.nombre_libro}". Esta acción no se puede deshacer.`,
      confirmText: "Eliminar",
      onConfirm:   async () => {
        try {
          await deleteLibro(row.id);
          setRows((prev) => prev.filter((r) => r.id !== row.id));
          setToast({ show: true, message: "Libro eliminado correctamente.", type: "success" });
        } catch (err) {
          setToast({ show: true, message: err.message || "Error eliminando libro", type: "error" });
        }
      },
    });
  };

  const badgeClass = (estado) =>
    "badge-status " + (
      estado === "Publicado"   ? "badge-publicado" :
      estado === "En revisión" ? "badge-revision"  :
      estado === "Aceptado"    ? "badge-aceptado"  : "badge-rechazado"
    );

  return (
    <div>
      <h3 className="mb-3 perfil-title">Libros</h3>

      <div className="panel-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={{ color: "var(--muted)" }}>Tabla de libros</div>
          <BtnNuevo label="Nuevo Libro" onClick={openCreate} disabled={loading} />
        </div>

        {loading ? (
          <div style={{ color: "var(--muted)" }}>Cargando...</div>
        ) : (
          <>
          <div className="table-wrap">
            <div className="table-responsive">
              <table className="table table-dark table-dark-custom align-middle" style={{ minWidth: "700px" }}>
                <thead>
                  <tr>
                    <th>Autor(es)</th>
                    <th>Autor/a principal</th>
                    <th>Año</th>
                    <th>Nombre libro</th>
                    <th>Lugar</th>
                    <th>Editorial</th>
                    <th>Estado</th>
                    <th>Respaldo</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.autores}</td>
                      <td>{r.autor_principal}</td>
                      <td>{r.ano}</td>
                      <td>{r.nombre_libro}</td>
                      <td>{r.lugar}</td>
                      <td>{r.editorial}</td>
                      <td><span className={badgeClass(r.estado)}>{r.estado}</span></td>
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
                      <td colSpan="9" style={{ color: "var(--muted)" }}>Sin registros.</td>
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
        submitText={saving ? "Guardando..." : mode === "create" ? "Crear" : "Guardar cambios"}
      >
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <AutoresInput
              value={form.autores}
              onChange={(e) => setField("autores", e.target.value)}
              className={errorMsg("autores") ? "is-invalid" : ""}
            />
            {errorMsg("autores") && <div className="invalid-feedback d-block">{errorMsg("autores")}</div>}
          </div>

          <div className="col-12 col-md-6">
            <AutorPrincipalInput
              value={form.autor_principal}
              onChange={(e) => setField("autor_principal", e.target.value)}
              className={errorMsg("autor_principal") ? "is-invalid" : ""}
            />
            {errorMsg("autor_principal") && <div className="invalid-feedback d-block">{errorMsg("autor_principal")}</div>}
          </div>

          <div className="col-12 col-md-3">
            <YearInput value={form.ano} onChange={(val) => setField("ano", val)} error={errorMsg("ano")} required />
          </div>

          <div className="col-12 col-md-4">
            <EstadoSelect
              value={form.estado}
              onChange={(e) => setField("estado", e.target.value)}
              className={errorMsg("estado") ? "is-invalid" : ""}
            />
            {errorMsg("estado") && <div className="invalid-feedback d-block">{errorMsg("estado")}</div>}
          </div>

          <div className="col-12">
            <NombreLibroInput
              value={form.nombre_libro}
              onChange={(e) => setField("nombre_libro", e.target.value)}
              className={errorMsg("nombre_libro") ? "is-invalid" : ""}
            />
            {errorMsg("nombre_libro") && <div className="invalid-feedback d-block">{errorMsg("nombre_libro")}</div>}
          </div>

          <div className="col-12 col-md-6">
            <LugarInput
              value={form.lugar}
              onChange={(e) => setField("lugar", e.target.value)}
              className={errorMsg("lugar") ? "is-invalid" : ""}
            />
            {errorMsg("lugar") && <div className="invalid-feedback d-block">{errorMsg("lugar")}</div>}
          </div>

          <div className="col-12 col-md-6">
            <EditorialInput
              value={form.editorial}
              onChange={(e) => setField("editorial", e.target.value)}
              className={errorMsg("editorial") ? "is-invalid" : ""}
            />
            {errorMsg("editorial") && <div className="invalid-feedback d-block">{errorMsg("editorial")}</div>}
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