import { useMemo, useState } from "react";
import FormModal from "../../components/FormModal.jsx";

const emptyForm = {
  autor: "",
  anio: "",
  titulo: "",
  programa: "",
  institucion: "",
  link: "",
};

export default function Tesis() {
  const [rows, setRows] = useState([
    {
      id: 1,
      autor: "Roberto Sánchez",
      anio: "2023",
      titulo: "Aplicación de redes neuronales en diagnóstico médico",
      programa: "Maestría en Ciencias Computacionales",
      institucion: "Universidad Nacional",
      link: "Ver",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const modalTitle = useMemo(() => {
    return mode === "create" ? "Nueva Tesis" : "Editar Tesis";
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
      autor: row.autor,
      anio: row.anio,
      titulo: row.titulo,
      programa: row.programa,
      institucion: row.institucion,
      link: row.link === "Ver" ? "" : row.link,
    });
    setShowModal(true);
  };

  const close = () => setShowModal(false);

  const submit = () => {
    // validación simple
    if (!form.autor || !form.anio || !form.titulo) {
      alert("Completa al menos Autor, Año y Título.");
      return;
    }

    if (mode === "create") {
      const newRow = {
        id: Date.now(),
        autor: form.autor,
        anio: form.anio,
        titulo: form.titulo,
        programa: form.programa,
        institucion: form.institucion,
        link: form.link ? form.link : "Ver",
      };
      setRows((prev) => [newRow, ...prev]);
    } else {
      setRows((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? {
                ...r,
                autor: form.autor,
                anio: form.anio,
                titulo: form.titulo,
                programa: form.programa,
                institucion: form.institucion,
                link: form.link ? form.link : "Ver",
              }
            : r
        )
      );
    }

    setShowModal(false);
  };

  const remove = (id) => {
    if (!confirm("¿Eliminar esta tesis?")) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div>
      <h3 className="mb-3">Tesis</h3>

      <div className="panel-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={{ color: "var(--muted)" }}>Tabla de guía de tesis</div>

          <button className="btn btn-primary" onClick={openCreate}>
            <i className="bi bi-plus-lg me-2" />
            Nueva Tesis
          </button>
        </div>

        <div className="table-wrap">
          <div className="table-responsive">
            <table className="table table-dark table-dark-custom align-middle">
              <thead>
                <tr>
                  <th>Autor</th>
                  <th>Año</th>
                  <th>Título</th>
                  <th>Programa</th>
                  <th>Institución</th>
                  <th>Link</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.autor}</td>
                    <td>{r.anio}</td>
                    <td>{r.titulo}</td>
                    <td>{r.programa}</td>
                    <td>{r.institucion}</td>
                    <td>
                      <a href={r.link !== "Ver" ? r.link : "#"} target="_blank" rel="noreferrer">
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
                    <td colSpan="7" style={{ color: "var(--muted)" }}>
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
            <label className="form-label" style={{ color: "var(--muted)" }}>Autor</label>
            <input
              className="form-control input-dark"
              value={form.autor}
              onChange={(e) => setForm({ ...form, autor: e.target.value })}
              placeholder="Nombre del autor"
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

          <div className="col-12 col-md-3">
            <label className="form-label" style={{ color: "var(--muted)" }}>Link</label>
            <input
              className="form-control input-dark"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="col-12">
            <label className="form-label" style={{ color: "var(--muted)" }}>Título</label>
            <input
              className="form-control input-dark"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              placeholder="Título de la tesis"
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label" style={{ color: "var(--muted)" }}>Programa</label>
            <input
              className="form-control input-dark"
              value={form.programa}
              onChange={(e) => setForm({ ...form, programa: e.target.value })}
              placeholder="Ej: Maestría en..."
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label" style={{ color: "var(--muted)" }}>Institución</label>
            <input
              className="form-control input-dark"
              value={form.institucion}
              onChange={(e) => setForm({ ...form, institucion: e.target.value })}
              placeholder="Ej: Universidad..."
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
