import { useEffect, useMemo, useState } from "react";
import FormModal from "../../components/FormModal.jsx";
import EstadoSelect from "@/components/forms/statusSelect/EstadoSelect.jsx";
import {
  createCapLibro,
  deleteCapLibro,
  getMisCapLibros,
  updateCapLibro,
} from "../../services/api.js";

const emptyForm = {
  autores: "",
  autor_principal: "",
  ano: "",
  nombre_capitulo: "",
  nombre_libro: "",
  lugar: "",
  editorial: "",
  estado: "Publicado",
  link_verificacion: "",
};

export default function CapLibro() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const modalTitle = useMemo(() => {
    return mode === "create" ? "Nuevo Capítulo de Libro" : "Editar Capítulo de Libro";
  }, [mode]);

  const load = async () => {
    const data = await getMisCapLibros();
    setRows(
      data.map((c) => ({
        id: c.cap_id,
        autores: c.autores || "",
        autor_principal: c.autor_principal || "",
        ano: c.ano ? String(c.ano) : "",
        nombre_capitulo: c.nombre_capitulo || "",
        nombre_libro: c.nombre_libro || "",
        lugar: c.lugar || "",
        editorial: c.editorial || "",
        estado: c.estado || "Publicado",
        link_verificacion: c.link_verificacion || "",
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
        alert(err.message || "Error cargando capítulos de libro");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openCreate = () => {
    setMode("create");
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (row) => {
    setMode("edit");
    setEditingId(row.id);
    setForm({
      autores: row.autores,
      autor_principal: row.autor_principal,
      ano: row.ano,
      nombre_capitulo: row.nombre_capitulo,
      nombre_libro: row.nombre_libro,
      lugar: row.lugar,
      editorial: row.editorial,
      estado: row.estado || "Publicado",
      link_verificacion: row.link_verificacion,
    });
    setShowModal(true);
  };

  const close = () => setShowModal(false);

  const submit = async () => {
    if (!form.ano || !form.nombre_capitulo) {
      alert("Completa al menos Año y Nombre del capítulo.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        autores: form.autores,
        autor_principal: form.autor_principal,
        ano: form.ano ? Number(form.ano) : null,
        nombre_capitulo: form.nombre_capitulo,
        nombre_libro: form.nombre_libro,
        lugar: form.lugar,
        editorial: form.editorial,
        estado: form.estado,
        link_verificacion: form.link_verificacion,
      };

      if (mode === "create") {
        await createCapLibro(payload);
      } else {
        await updateCapLibro(editingId, payload);
      }

      await load();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error guardando capítulo de libro");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar este capítulo de libro?")) return;
    try {
      await deleteCapLibro(id);
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Error eliminando capítulo de libro");
    }
  };

  const badgeClass =
    (estado) =>
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
      <h3 className="mb-3 perfil-title">Capítulos de libro</h3>

      <div className="panel-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={{ color: "var(--muted)" }}>Tabla de capítulos de libro</div>

          <button className="btn btn-primary" onClick={openCreate} disabled={loading}>
            <i className="bi bi-plus-lg me-2" />
            Nuevo Capítulo
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
                    <th>Autor(es)</th>
                    <th>Autor/a principal</th>
                    <th>Año</th>
                    <th>Nombre del capítulo</th>
                    <th>Nombre libro</th>
                    <th>Lugar</th>
                    <th>Editorial</th>
                    <th>Estado</th>
                    <th>Respaldo</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.autores}</td>
                      <td>{r.autor_principal}</td>
                      <td>{r.ano}</td>
                      <td>{r.nombre_capitulo}</td>
                      <td>{r.nombre_libro}</td>
                      <td>{r.lugar}</td>
                      <td>{r.editorial}</td>
                      <td>
                        <span className={badgeClass(r.estado)}>{r.estado}</span>
                      </td>
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
                        <button className="btn btn-sm btn-outline-light me-2" onClick={() => openEdit(r)}>
                          Editar
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => remove(r.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}

                  {rows.length === 0 && (
                    <tr>
                      <td colSpan="10" style={{ color: "var(--muted)" }}>
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
              Autor(es)
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
              Autor/a principal
            </label>
            <input
              className="form-control input-dark"
              value={form.autor_principal}
              onChange={(e) => setForm({ ...form, autor_principal: e.target.value })}
              placeholder="Ej: García J."
            />
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Año*
            </label>
            <input
              className="form-control input-dark"
              value={form.ano}
              onChange={(e) => setForm({ ...form, ano: e.target.value })}
              placeholder="2024"
            />
          </div>

          <div className="col-12 col-md-4">
              <EstadoSelect
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
              />
          </div>

          <div className="col-12">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Nombre del capítulo*
            </label>
            <input
              className="form-control input-dark"
              value={form.nombre_capitulo}
              onChange={(e) => setForm({ ...form, nombre_capitulo: e.target.value })}
              placeholder="Nombre del capítulo"
            />
          </div>

          <div className="col-12">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Nombre libro
            </label>
            <input
              className="form-control input-dark"
              value={form.nombre_libro}
              onChange={(e) => setForm({ ...form, nombre_libro: e.target.value })}
              placeholder="Nombre del libro"
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Lugar
            </label>
            <input
              className="form-control input-dark"
              value={form.lugar}
              onChange={(e) => setForm({ ...form, lugar: e.target.value })}
              placeholder="Lugar"
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Editorial
            </label>
            <input
              className="form-control input-dark"
              value={form.editorial}
              onChange={(e) => setForm({ ...form, editorial: e.target.value })}
              placeholder="Editorial"
            />
          </div>

          <div className="col-12">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Respaldo (link)
            </label>
            <input
              className="form-control input-dark"
              value={form.link_verificacion}
              onChange={(e) => setForm({ ...form, link_verificacion: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
