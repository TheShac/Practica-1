import { useMemo, useState } from "react";
import FormModal from "../../components/FormModal.jsx";

const emptyForm = {
  autores: "",
  autorPrincipal: "",
  anio: "",
  titulo: "",
  revista: "",
  estado: "Publicado",
  issn: "",
  respaldo: "",
};

export default function Publicaciones() {
  const [rows, setRows] = useState([
    {
      id: 1,
      autores: "García J., Martínez L.",
      autorPrincipal: "García J.",
      anio: "2024",
      titulo: "Machine Learning approaches for medical image…",
      revista: "IEEE Transactions on Medical Imaging",
      estado: "Publicado",
      issn: "0278-0062",
      respaldo: "Ver",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const modalTitle = useMemo(() => {
    return mode === "create" ? "Nueva Publicación" : "Editar Publicación";
  }, [mode]);

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
      autorPrincipal: row.autorPrincipal,
      anio: row.anio,
      titulo: row.titulo,
      revista: row.revista,
      estado: row.estado,
      issn: row.issn,
      respaldo: row.respaldo === "Ver" ? "" : row.respaldo,
    });
    setShowModal(true);
  };

  const close = () => setShowModal(false);

  const submit = () => {
    if (!form.autorPrincipal || !form.anio || !form.titulo) {
      alert("Completa al menos Autor principal, Año y Título.");
      return;
    }

    if (mode === "create") {
      const newRow = {
        id: Date.now(),
        autores: form.autores,
        autorPrincipal: form.autorPrincipal,
        anio: form.anio,
        titulo: form.titulo,
        revista: form.revista,
        estado: form.estado,
        issn: form.issn,
        respaldo: form.respaldo ? form.respaldo : "Ver",
      };
      setRows((prev) => [newRow, ...prev]);
    } else {
      setRows((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? {
                ...r,
                autores: form.autores,
                autorPrincipal: form.autorPrincipal,
                anio: form.anio,
                titulo: form.titulo,
                revista: form.revista,
                estado: form.estado,
                issn: form.issn,
                respaldo: form.respaldo ? form.respaldo : "Ver",
              }
            : r
        )
      );
    }

    setShowModal(false);
  };

  const remove = (id) => {
    if (!confirm("¿Eliminar esta publicación?")) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div>
      <h3 className="mb-3">Publicaciones</h3>

      <div className="panel-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={{ color: "var(--muted)" }}>Tabla de publicaciones</div>

          <button className="btn btn-primary" onClick={openCreate}>
            <i className="bi bi-plus-lg me-2" />
            Nueva Publicación
          </button>
        </div>

        <div className="table-wrap">
          <div className="table-responsive">
            <table className="table table-dark table-dark-custom align-middle">
              <thead>
                <tr>
                  <th>Autores</th>
                  <th>Autor principal</th>
                  <th>Año</th>
                  <th>Título</th>
                  <th>Revista</th>
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
                    <td>{r.titulo}</td>
                    <td>{r.revista}</td>
                    <td>
                      <span className={`badge ${r.estado === "Publicado" ? "bg-success" : "bg-secondary"}`}>
                        {r.estado}
                      </span>
                    </td>
                    <td>{r.issn}</td>
                    <td>
                      <a href={r.respaldo !== "Ver" ? r.respaldo : "#"} target="_blank" rel="noreferrer">
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
      </div>

      <FormModal
        show={showModal}
        title={modalTitle}
        onClose={close}
        onSubmit={submit}
        submitText={mode === "create" ? "Crear" : "Guardar cambios"}
      >
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label" style={{ color: "var(--muted)" }}>Autores</label>
            <input
              className="form-control input-dark"
              value={form.autores}
              onChange={(e) => setForm({ ...form, autores: e.target.value })}
              placeholder="Ej: García J., Martínez L."
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label" style={{ color: "var(--muted)" }}>Autor principal</label>
            <input
              className="form-control input-dark"
              value={form.autorPrincipal}
              onChange={(e) => setForm({ ...form, autorPrincipal: e.target.value })}
              placeholder="Ej: García J."
            />
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label" style={{ color: "var(--muted)" }}>Año</label>
            <input
              className="form-control input-dark"
              value={form.anio}
              onChange={(e) => setForm({ ...form, anio: e.target.value })}
              placeholder="2024"
            />
          </div>

          <div className="col-12 col-md-5">
            <label className="form-label" style={{ color: "var(--muted)" }}>Revista</label>
            <input
              className="form-control input-dark"
              value={form.revista}
              onChange={(e) => setForm({ ...form, revista: e.target.value })}
              placeholder="Nombre de la revista"
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label" style={{ color: "var(--muted)" }}>Estado</label>
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

          <div className="col-12">
            <label className="form-label" style={{ color: "var(--muted)" }}>Título</label>
            <input
              className="form-control input-dark"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              placeholder="Título del artículo"
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label" style={{ color: "var(--muted)" }}>ISSN</label>
            <input
              className="form-control input-dark"
              value={form.issn}
              onChange={(e) => setForm({ ...form, issn: e.target.value })}
              placeholder="0000-0000"
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label" style={{ color: "var(--muted)" }}>Respaldo (link)</label>
            <input
              className="form-control input-dark"
              value={form.respaldo}
              onChange={(e) => setForm({ ...form, respaldo: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
