import { useEffect, useMemo, useState } from "react";
import FormModal from "../../components/FormModal.jsx";
import EstadoSelect from "@/components/forms/statusSelect/EstadoSelect.jsx";
import RespaldoInput from "@/components/forms/backupLink/RespaldoInput.jsx";
import IssnInput from "@/components/ui/inputs/IssnInput.jsx";
import BtnNuevo from "@/components/ui/buttons/BtnCreate.jsx";

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

export default function Publicaciones() {
  const [rows, setRows] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const modalTitle = useMemo(() => {
    return mode === "create" ? "Nueva Publicación" : "Editar Publicación";
  }, [mode]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const [cats, pubs] = await Promise.all([
          getCategorias(),
          getMisPublicaciones(),
        ]);

        setCategorias(cats);

        const mapped = pubs.map((p) => ({
          id: p.publicacion_id,
          categoria_id: p.categoria_id,
          categoria: p.categoria_nombre,
          autores: p.autores || "",
          autorPrincipal: p.autor_principal || "",
          anio: p.ano ? String(p.ano) : "",
          titulo: p.titulo_articulo || "",
          revista: p.nombre_revista || "",
          estado: p.estado || "Publicado",
          issn: p.ISSN || "",
          respaldo: p.link_verificacion || "",
        }));

        setRows(mapped);
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

    setForm({
      ...emptyForm,
      categoria_id: defaultCatId,
    });

    setShowModal(true);
  };

  const openEdit = (row) => {
    setMode("edit");
    setEditingId(row.id);
    setForm({
      autores: row.autores,
      autorPrincipal: row.autorPrincipal,
      anio: row.anio,
      categoria_id: row.categoria_id ? String(row.categoria_id) : "",
      titulo: row.titulo,
      estado: row.estado || "Publicado",
      revista: row.revista,
      issn: row.issn,
      respaldo: row.respaldo,
    });
    setShowModal(true);
  };

  const close = () => setShowModal(false);

  const submit = async () => {
    if (!form.autorPrincipal || !form.anio || !form.titulo || !form.categoria_id) {
      alert("Completa al menos Autor principal, Año, Categoría y Título.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        autores: form.autores,
        autor_principal: form.autorPrincipal,
        ano: Number(form.anio),
        categoria_id: Number(form.categoria_id),
        titulo_articulo: form.titulo,
        revista: form.revista,
        estado: form.estado,
        nombre_revista: form.revista,
        ISSN: form.issn,
        link_verificacion: form.respaldo,
      };

      if (mode === "create") {
        await createPublicacion(payload);

        const pubs = await getMisPublicaciones();
        const mapped = pubs.map((p) => ({
          id: p.publicacion_id,
          categoria_id: p.categoria_id,
          categoria: p.categoria_nombre,
          autores: p.autores || "",
          autorPrincipal: p.autor_principal || "",
          anio: p.ano ? String(p.ano) : "",
          titulo: p.titulo_articulo || "",
          revista: p.nombre_revista || "",
          estado: p.estado || "Publicado",
          issn: p.ISSN || "",
          respaldo: p.link_verificacion || "",
        }));
        setRows(mapped);
      } else {
        await updatePublicacion(editingId, payload);

        const pubs = await getMisPublicaciones();
        const mapped = pubs.map((p) => ({
          id: p.publicacion_id,
          categoria_id: p.categoria_id,
          categoria: p.categoria_nombre,
          autores: p.autores || "",
          autorPrincipal: p.autor_principal || "",
          anio: p.ano ? String(p.ano) : "",
          titulo: p.titulo_articulo || "",
          revista: p.nombre_revista || "",
          estado: p.estado || "Publicado",
          issn: p.ISSN || "",
          respaldo: p.link_verificacion || "",
        }));
        setRows(mapped);
      }

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

  return (
    <div>
      <h3 className="mb-3">Publicaciones</h3>

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
                    <th>Autores</th>
                    <th>Autor principal</th>
                    <th>Año</th>
                    <th>Indexados</th>
                    <th>Revista</th>
                    <th>Título</th>
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
                      <td>{r.revista}</td>
                      <td>{r.titulo}</td>
                      <td>
                        <span
                          className={
                            "badge-status " +
                            (r.estado === "Publicado"
                              ? "badge-publicado"
                              : r.estado === "En revisión"
                              ? "badge-revision"
                              : r.estado === "Aceptado")
                          }
                        >
                          {r.estado}
                        </span>
                      </td>
                      <td>{r.issn}</td>
                      <td>
                        <a
                          href={r.respaldo ? r.respaldo : "#"}
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
        submitText={saving ? "Guardando..." : mode === "create" ? "Crear" : "Guardar cambios"}
      >
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Autores
            </label>
            <input
              className="form-control input-dark"
              value={form.autores}
              onChange={(e) => setForm({ ...form, autores: e.target.value })}
              placeholder="Ej: García J., Martínez L."
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Autor principal*
            </label>
            <input
              className="form-control input-dark"
              value={form.autorPrincipal}
              onChange={(e) => setForm({ ...form, autorPrincipal: e.target.value })}
              placeholder="Ej: García J."
            />
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Año*
            </label>
            <input
              className="form-control input-dark"
              value={form.anio}
              onChange={(e) => setForm({ ...form, anio: e.target.value })}
              placeholder="2024"
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Indexados*
            </label>
            <select
              className="form-select input-dark"
              value={form.categoria_id}
              onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
            >
              <option value="" disabled>
                Seleccione...
              </option>
              {categorias.map((c) => (
                <option key={c.categoria_id} value={String(c.categoria_id)}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-5">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Revista
            </label>
            <input
              className="form-control input-dark"
              value={form.revista}
              onChange={(e) => setForm({ ...form, revista: e.target.value })}
              placeholder="Nombre de la revista"
            />
          </div>

          <div className="col-12 col-md-8">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Título*
            </label>
            <input
              className="form-control input-dark"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              placeholder="Título del artículo"
            />
          </div>

          <div className="col-12 col-md-4">
            <EstadoSelect
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
            />
          </div>

          <div className="col-12 col-md-6">
            <IssnInput
              value={form.issn}
              onChange={(e) => setForm({ ...form, issn: e.target.value })}
            />
          </div>

          <div className="col-12 col-md-6">
            <RespaldoInput
              value={form.respaldo}
              onChange={(e) => setForm({ ...form, respaldo: e.target.value })}
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
