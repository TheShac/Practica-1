import { useEffect, useMemo, useState, useCallback } from "react";
import FormModal from "@/components/overlays/formModal/FormModal.jsx";
import EstadoSelect from "@/components/forms/statusSelect/EstadoSelect.jsx";
import RespaldoInput from "@/components/forms/backupLink/RespaldoInput.jsx";
import IssnInput from "@/components/ui/inputs/IssnInput.jsx";
import YearInput from "@/components/ui/inputs/YearInput.jsx";
import AutoresInput from "@/components/forms/authorInput/AutoresInput.jsx";
import AutorPrincipalInput from "@/components/forms/authorInput/AutorPrincipalInput.jsx";
import TituloInput from "@/components/ui/inputs/TituloInput.jsx";
import BtnNuevo from "@/components/ui/buttons/BtnCreate.jsx";
import ActionButtons from "@/components/ui/buttons/ActionButtons.jsx";

import {
  getCategorias,
  getMisPublicaciones,
  createPublicacion,
  updatePublicacion,
  deletePublicacion,
} from "../../services/api.js";

const emptyForm = {
  autores: "",
  autorPrincipal: "",
  anio: "",
  categoria_id: "",
  titulo: "",
  estado: "Publicado",
  revista: "",
  issn: "",
  respaldo: "",
};

const REQUIRED_FIELDS = [
  { key: "autores",       label: "Autor(es)" },
  { key: "autorPrincipal", label: "Autor principal" },
  { key: "anio",          label: "Año" },
  { key: "categoria_id",  label: "Indexados" },
  { key: "titulo",        label: "Título" },
  { key: "revista",       label: "Revista" },
  { key: "estado",        label: "Estado" },
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

const mapPublicacion = (p) => ({
  id:            p.publicacion_id,
  categoria_id:  p.categoria_id,
  categoria:     p.categoria_nombre,
  autores:       p.autores || "",
  autorPrincipal: p.autor_principal || "",
  anio:          p.ano ? String(p.ano) : "",
  titulo:        p.titulo_articulo || "",
  revista:       p.nombre_revista || "",
  estado:        p.estado || "Publicado",
  issn:          p.ISSN || "",
  respaldo:      p.link_verificacion || "",
});

export default function Publicaciones() {
  const [rows, setRows]           = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode]           = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [touched, setTouched]     = useState({});

  const errors        = useMemo(() => validate(form), [form]);
  const isFormInvalid = Object.keys(errors).length > 0;

  const modalTitle = useMemo(
    () => mode === "create" ? "Nueva Publicación" : "Editar Publicación",
    [mode],
  );

  const setField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  const errorMsg = (key) => (touched[key] && errors[key]) ? errors[key] : null;

  const loadRows = async () => {
    const pubs = await getMisPublicaciones();
    setRows(pubs.map(mapPublicacion));
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [cats, pubs] = await Promise.all([getCategorias(), getMisPublicaciones()]);
        setCategorias(cats);
        setRows(pubs.map(mapPublicacion));
      } catch (err) {
        console.error(err);
        alert(err.message || "Error cargando publicaciones");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openCreate = () => {
    setMode("create");
    setEditingId(null);
    const defaultCatId = categorias?.[0]?.categoria_id
      ? String(categorias[0].categoria_id)
      : "";
    setForm({ ...emptyForm, categoria_id: defaultCatId });
    setTouched({});
    setShowModal(true);
  };

  const openEdit = (row) => {
    setMode("edit");
    setEditingId(row.id);
    setForm({
      autores:       row.autores,
      autorPrincipal: row.autorPrincipal,
      anio:          row.anio,
      categoria_id:  row.categoria_id ? String(row.categoria_id) : "",
      titulo:        row.titulo,
      estado:        row.estado || "Publicado",
      revista:       row.revista,
      issn:          row.issn,
      respaldo:      row.respaldo,
    });
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
      const payload = {
        autores:          form.autores,
        autor_principal:  form.autorPrincipal,
        ano:              Number(form.anio),
        categoria_id:     Number(form.categoria_id),
        titulo_articulo:  form.titulo,
        nombre_revista:   form.revista,
        estado:           form.estado,
        ISSN:             form.issn,
        link_verificacion: form.respaldo,
      };

      if (mode === "create") {
        await createPublicacion(payload);
      } else {
        await updatePublicacion(editingId, payload);
      }

      await loadRows();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error guardando publicación");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar esta publicación?")) return;

    try {
      await deletePublicacion(id);
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Error eliminando publicación");
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
      : "badge-rechazado");

  return (
    <div>
      <h3 className="mb-3 perfil-title">Publicaciones</h3>

      <div className="panel-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={{ color: "var(--muted)" }}>Tabla de publicaciones</div>
          <BtnNuevo label="Nueva Publicación" onClick={openCreate} disabled={loading} />
        </div>

        {loading ? (
          <div style={{ color: "var(--muted)" }}>Cargando...</div>
        ) : (
          <div className="table-wrap">
            <div className="table-responsive">
              <table className="table table-dark table-dark-custom align-middle">
                <thead>
                  <tr>
                    <th>Autor(es)</th>
                    <th>Autor/a principal</th>
                    <th>Año</th>
                    <th>Indexada</th>
                    <th>Título del artículo</th>
                    <th>Nombre Revista</th>
                    <th>Estado</th>
                    <th>ISSN</th>
                    <th>Respaldo</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.autores}</td>
                      <td>{r.autorPrincipal}</td>
                      <td>{r.anio}</td>
                      <td>{r.categoria}</td>
                      <td>{r.titulo}</td>
                      <td>{r.revista || "—"}</td>
                      <td>
                        <span className={badgeClass(r.estado)}>{r.estado}</span>
                      </td>
                      <td>{r.issn || "—"}</td>
                      <td>
                        <a href={r.respaldo || "#"} target="_blank" rel="noreferrer">
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
                      <td colSpan="9" style={{ color: "var(--muted)" }}>
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
          <div className="col-12 col-md-6">
            <AutoresInput
              value={form.autores}
              onChange={(e) => setField("autores", e.target.value)}
              className={errorMsg("autores") ? "is-invalid" : ""}
            />
            {errorMsg("autores") && (
              <div className="invalid-feedback d-block">{errorMsg("autores")}</div>
            )}
          </div>

          <div className="col-12 col-md-6">
            <AutorPrincipalInput
              value={form.autorPrincipal}
              onChange={(e) => setField("autorPrincipal", e.target.value)}
              className={errorMsg("autorPrincipal") ? "is-invalid" : ""}
            />
            {errorMsg("autorPrincipal") && (
              <div className="invalid-feedback d-block">{errorMsg("autorPrincipal")}</div>
            )}
          </div>

          <div className="col-12 col-md-3">
            <YearInput
              value={form.anio}
              onChange={(val) => setField("anio", val)}
              error={errorMsg("anio")}
              required
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Indexados*
            </label>
            <select
              className={`form-select input-dark${errorMsg("categoria_id") ? " is-invalid" : ""}`}
              value={form.categoria_id}
              onChange={(e) => setField("categoria_id", e.target.value)}
            >
              <option value="" disabled>Seleccione...</option>
              {categorias.map((c) => (
                <option key={c.categoria_id} value={String(c.categoria_id)}>
                  {c.nombre}
                </option>
              ))}
            </select>
            {errorMsg("categoria_id") && (
              <div className="invalid-feedback">{errorMsg("categoria_id")}</div>
            )}
          </div>

          <div className="col-12 col-md-5">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Revista*
            </label>
            <input
              className={`form-control input-dark${errorMsg("revista") ? " is-invalid" : ""}`}
              value={form.revista}
              onChange={(e) => setField("revista", e.target.value)}
              placeholder="Nombre de la revista"
            />
            {errorMsg("revista") && (
              <div className="invalid-feedback">{errorMsg("revista")}</div>
            )}
          </div>

          <div className="col-12 col-md-8">
            <TituloInput
              value={form.titulo}
              onChange={(e) => setField("titulo", e.target.value)}
              placeholder="Título del artículo"
              className={errorMsg("titulo") ? "is-invalid" : ""}
            />
            {errorMsg("titulo") && (
              <div className="invalid-feedback d-block">{errorMsg("titulo")}</div>
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

          <div className="col-12 col-md-6">
            <IssnInput
              value={form.issn}
              onChange={(e) => setForm((prev) => ({ ...prev, issn: e.target.value }))}
            />
          </div>

          <div className="col-12 col-md-6">
            <RespaldoInput
              value={form.respaldo}
              onChange={(e) => setForm((prev) => ({ ...prev, respaldo: e.target.value }))}
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
