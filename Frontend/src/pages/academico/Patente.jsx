import { useEffect, useMemo, useState, useCallback } from "react";
import FormModal from "@/components/overlays/formModal/FormModal.jsx";
import EstadoSelect from "@/components/forms/statusSelect/EstadoSelect.jsx";
import RespaldoInput from "@/components/forms/backupLink/RespaldoInput.jsx";
import ActionButtons from "@/components/ui/buttons/ActionButtons.jsx";
import BtnNuevo from "@/components/ui/buttons/BtnCreate.jsx";
import {
  fetchPatentes,
  createPatente,
  updatePatente,
  deletePatente,
} from "../../services/patente.service";

const emptyForm = {
  inventores: "",
  nombre_patente: "",
  fecha_solicitud: "",
  fecha_publicacion: "",
  num_registro: "",
  estado: "",
  link_verificacion: "",
};

const REQUIRED_FIELDS = [
  { key: "inventores",       label: "Inventor(es)" },
  { key: "nombre_patente",   label: "Nombre patente" },
  { key: "fecha_solicitud",  label: "Fecha de solicitud" },
  { key: "num_registro",     label: "N° de registro" },
  { key: "estado",           label: "Estado" },
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

function formatDate(date) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

export default function Patente() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode]           = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [touched, setTouched]     = useState({});

  const errors        = useMemo(() => validate(form), [form]);
  const isFormInvalid = Object.keys(errors).length > 0;

  const modalTitle = useMemo(
    () => mode === "create" ? "Nueva Patente" : "Editar Patente",
    [mode],
  );

  const setField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  const errorMsg = (key) => (touched[key] && errors[key]) ? errors[key] : null;

  const load = async () => {
    const data = await fetchPatentes();

    setRows(
      data.map((p) => ({
        id: p.patente_id,
        inventores: p.inventores || "",
        nombre_patente: p.nombre_patente || "",
        fecha_solicitud: formatDate(p.fecha_solicitud),
        fecha_publicacion: formatDate(p.fecha_publicacion),
        num_registro: p.num_registro || "",
        estado: p.estado || "",
        link_verificacion: p.link_verificacion || "",
      }))
    );
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await load();
      } catch (err) {
        console.error(err);
        alert(err.message || "Error cargando patentes");
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
      if (mode === "create") {
        await createPatente(form);
      } else {
        await updatePatente(editingId, form);
      }

      await load();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error guardando patente");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar esta patente?")) return;

    try {
      await deletePatente(id);
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Error eliminando patente");
    }
  };

  const badgeClass = (estado) =>
    "badge-status " +
    (estado === "Publicado"
      ? "badge-publicado"
      : estado === "En revisión"
      ? "badge-revision"
      : estado === "Aceptado"
      ? "badge-aceptado"
      : "");

  return (
    <div>
      <h3 className="mb-3 perfil-title">Patentes</h3>

      <div className="panel-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={{ color: "var(--muted)" }}>Tabla de patentes</div>
          <BtnNuevo label="Nueva Patente" onClick={openCreate} disabled={loading} />
        </div>

        {loading ? (
          <div style={{ color: "var(--muted)" }}>Cargando...</div>
        ) : (
          <div className="table-wrap">
            <div className="table-responsive">
              <table className="table table-dark table-dark-custom align-middle">
                <thead>
                  <tr>
                    <th>Inventor(es)</th>
                    <th>Nombre Patente</th>
                    <th>Fecha de Solicitud</th>
                    <th>Fecha de Publicación</th>
                    <th>N° de registro</th>
                    <th>Estado</th>
                    <th>Respaldo</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                        <td>{r.inventores}</td>
                        <td>{r.nombre_patente}</td>
                        <td>{r.fecha_solicitud || "—"}</td>
                        <td>{r.fecha_publicacion || "—"}</td>
                        <td>{r.num_registro || "—"}</td>
                        <td>
                          <span className={badgeClass(r.estado)}>{r.estado}</span>
                        </td>
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
                      <td colSpan="8" style={{ color: "var(--muted)" }}>
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
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Inventor(es)*
            </label>
            <input
              className={`form-control input-dark${errorMsg("inventores") ? " is-invalid" : ""}`}
              value={form.inventores}
              onChange={(e) => setField("inventores", e.target.value)}
              placeholder="Ej: García J., Martínez L."
            />
            {errorMsg("inventores") && (
              <div className="invalid-feedback">{errorMsg("inventores")}</div>
            )}
          </div>

          <div className="col-12">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Nombre Patente*
            </label>
            <input
              className={`form-control input-dark${errorMsg("nombre_patente") ? " is-invalid" : ""}`}
              value={form.nombre_patente}
              onChange={(e) => setField("nombre_patente", e.target.value)}
              placeholder="Nombre de la patente"
            />
            {errorMsg("nombre_patente") && (
              <div className="invalid-feedback">{errorMsg("nombre_patente")}</div>
            )}
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Fecha de Solicitud*
            </label>
            <input
              type="date"
              className={`form-control input-dark${errorMsg("fecha_solicitud") ? " is-invalid" : ""}`}
              value={form.fecha_solicitud}
              onChange={(e) => setField("fecha_solicitud", e.target.value)}
            />
            {errorMsg("fecha_solicitud") && (
              <div className="invalid-feedback">{errorMsg("fecha_solicitud")}</div>
            )}
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Fecha de Publicación
            </label>
            <input
              type="date"
              className="form-control input-dark"
              value={form.fecha_publicacion}
              onChange={(e) => setField("fecha_publicacion", e.target.value)}
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              N° de registro*
            </label>
            <input
              className={`form-control input-dark${errorMsg("num_registro") ? " is-invalid" : ""}`}
              value={form.num_registro}
              onChange={(e) => setField("num_registro", e.target.value)}
              placeholder="Ej: 202400123"
            />
            {errorMsg("num_registro") && (
              <div className="invalid-feedback">{errorMsg("num_registro")}</div>
            )}
          </div>

          <div className="col-12 col-md-4">
            <EstadoSelect
              value={form.estado}
              onChange={(e) => setField("estado", e.target.value)}
              className={errorMsg("estado") ? "is-invalid" : ""}
            />
            {errorMsg("estado") && (
              <div className="invalid-feedback d-block">{errorMsg("estado")}</div>
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
