import { useEffect, useMemo, useState } from "react";
import FormModal from "../../components/FormModal.jsx";
import { createLibro, deleteLibro, getMisLibros, updateLibro } from "../../services/api.js";

const emptyForm = {
  autores: "",               // Autor(es)
  autor_principal: "",       // Autor/a principal
  ano: "",                   // Año
  nombre_libro: "",          // Nombre libro
  lugar: "",                 // Lugar
  editorial: "",             // Editorial
  estado: "Publicado",       // Estado
  link_verificacion: "",     // Respaldo
};

export default function Libros() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const modalTitle = useMemo(() => {
    return mode === "create" ? "Nuevo Libro" : "Editar Libro";
  }, [mode]);

  const load = async () => {
    const data = await getMisLibros();
    setRows(
      data.map((b) => ({
        id: b.libro_id,
        autores: b.autores || "",
        autor_principal: b.autor_principal || "",
        ano: b.ano ? String(b.ano) : "",
        nombre_libro: b.nombre_libro || "",
        lugar: b.lugar || "",
        editorial: b.editorial || "",
        estado: b.estado || "Publicado",
        link_verificacion: b.link_verificacion || "",
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
        alert(err.message || "Error cargando libros");
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
    // Requisitos mínimos según tu orden: al menos Nombre libro y Año suelen ser clave
    if (!form.nombre_libro || !form.ano) {
      alert("Completa al menos Año y Nombre libro.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        autores: form.autores,
        autor_principal: form.autor_principal,
        ano: form.ano ? Number(form.ano) : null,
        nombre_libro: form.nombre_libro,
        lugar: form.lugar,
        editorial: form.editorial,
        estado: form.estado,
        link_verificacion: form.link_verificacion,
      };

      if (mode === "create") {
        await createLibro(payload);
      } else {
        await updateLibro(editingId, payload);
      }

      await load();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error guardando libro");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar este libro?")) return;
    try {
      await deleteLibro(id);
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Error eliminando libro");
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
      <h3 className="mb-3">Libros</h3>

      <div className="panel-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={{ color: "var(--muted)" }}>Tabla de libros</div>

          <button className="btn btn-primary" onClick={openCreate} disabled={loading}>
            <i className="bi bi-plus-lg me-2" />
            Nuevo Libro
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
          {/* Autor(es) */}
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

          {/* Autor/a principal */}
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

          {/* Año */}
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

          {/* Estado */}
          <div className="col-12 col-md-4">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Estado
            </label>
            <select
              className="form-select input-dark"
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
            >
              <option value="Publicado">Publicado</option>
              <option value="En revisión">En revisión</option>
              <option value="Aceptado">Aceptado</option>
              <option value="Rechazado">Rechazado</option>
            </select>
          </div>

          {/* Nombre libro */}
          <div className="col-12">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Nombre libro*
            </label>
            <input
              className="form-control input-dark"
              value={form.nombre_libro}
              onChange={(e) => setForm({ ...form, nombre_libro: e.target.value })}
              placeholder="Nombre del libro"
            />
          </div>

          {/* Lugar */}
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

          {/* Editorial */}
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

          {/* Respaldo */}
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
