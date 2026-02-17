import { useEffect, useMemo, useState } from "react";
import FormModal from "../../components/FormModal";
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

function formatDate(date) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

export default function Patente() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const modalTitle = useMemo(() => {
    return mode === "create" ? "Nueva Patente" : "Editar Patente";
  }, [mode]);

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
    setShowModal(true);
  };

  const openEdit = (row) => {
    setMode("edit");
    setEditingId(row.id);
    setForm(row);
    setShowModal(true);
  };

  const close = () => setShowModal(false);

  const submit = async () => {
    if (!form.nombre_patente.trim()) {
      alert("Nombre patente obligatorio");
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

  return (
    <div>
      <h3 className="mb-3">Patentes</h3>

      <div className="panel-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={{ color: "var(--muted)" }}>
            Tabla de patentes
          </div>

          <button className="btn btn-primary" onClick={openCreate} disabled={loading}>
            <i className="bi bi-plus-lg me-2" />
            Nueva Patente
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
                        <td>
                        {r.fecha_solicitud
                            ? new Date(r.fecha_solicitud).toISOString().split("T")[0]
                            : ""}
                        </td>

                        <td>
                        {r.fecha_publicacion
                            ? new Date(r.fecha_publicacion).toISOString().split("T")[0]
                            : ""}
                        </td>
                        <td>{r.num_registro}</td>
                        <td>{r.estado}</td>
                        <td>
                        <a
                          href={r.link_verificacion || "#"}
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
        submitText={
          saving
            ? "Guardando..."
            : mode === "create"
            ? "Crear"
            : "Guardar cambios"
        }
      >
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label">Inventor(es)</label>
            <input
              className="form-control input-dark"
              value={form.inventores}
              onChange={(e) =>
                setForm({ ...form, inventores: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label className="form-label">Nombre Patente*</label>
            <input
              className="form-control input-dark"
              value={form.nombre_patente}
              onChange={(e) =>
                setForm({ ...form, nombre_patente: e.target.value })
              }
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label">Fecha de Solicitud</label>
            <input
              type="date"
              className="form-control input-dark"
              value={form.fecha_solicitud}
              onChange={(e) =>
                setForm({ ...form, fecha_solicitud: e.target.value })
              }
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label">Fecha de Publicación</label>
            <input
              type="date"
              className="form-control input-dark"
              value={form.fecha_publicacion}
              onChange={(e) =>
                setForm({ ...form, fecha_publicacion: e.target.value })
              }
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label">N° de registro</label>
            <input
              className="form-control input-dark"
              value={form.num_registro}
              onChange={(e) =>
                setForm({ ...form, num_registro: e.target.value })
              }
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Estado</label>
            <input
              className="form-control input-dark"
              value={form.estado}
              onChange={(e) =>
                setForm({ ...form, estado: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label className="form-label">Respaldo(link)</label>
            <input
              className="form-control input-dark"
              value={form.link_verificacion}
              onChange={(e) =>
                setForm({
                  ...form,
                  link_verificacion: e.target.value,
                })
              }
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
