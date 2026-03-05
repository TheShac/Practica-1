import { useEffect, useMemo, useState } from "react";
import FormModal from "@/components/FormModal.jsx";
import BtnNuevo from "@/components/ui/buttons/BtnCreate.jsx";

import {
  getMisIntervenciones,
  createIntervencion,
  updateIntervencion,
  deleteIntervencion,
} from "../../services/Intervencion.service.js";

const emptyForm = {
  titulo: "",
  institucion: "",
  anio: "",
  rol: "",
  descripcion: "",
  respaldo: "",
};

export default function ProyectoIntervencion() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const modalTitle = useMemo(() => {
    return mode === "create"
      ? "Nuevo Proyecto de Intervención"
      : "Editar Proyecto de Intervención";
  }, [mode]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const proyectos = await getMisIntervenciones();

      const mapped = proyectos.map((p) => ({
        id: p.proyecto_id,
        titulo: p.titulo_proyecto || "",
        institucion: p.institucion || "",
        anio: p.ano ? String(p.ano) : "",
        rol: p.rol || "",
        descripcion: p.descripcion || "",
        respaldo: p.link_verificacion || "",
      }));

      setRows(mapped);
    } catch (err) {
      console.error(err);
      alert("Error cargando proyectos");
    } finally {
      setLoading(false);
    }
  };

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
      titulo: row.titulo,
      institucion: row.institucion,
      anio: row.anio,
      rol: row.rol,
      descripcion: row.descripcion,
      respaldo: row.respaldo,
    });
    setShowModal(true);
  };

  const close = () => setShowModal(false);

  const submit = async () => {
    if (!form.titulo || !form.anio) {
      alert("Completa al menos Título y Año.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        titulo_proyecto: form.titulo,
        institucion: form.institucion,
        ano: Number(form.anio),
        rol: form.rol,
        descripcion: form.descripcion,
        link_verificacion: form.respaldo,
      };

      if (mode === "create") {
        await createIntervencion(payload);
      } else {
        await updateIntervencion(editingId, payload);
      }

      await loadData();
      setShowModal(false);

    } catch (err) {
      console.error(err);
      alert("Error guardando proyecto");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar este proyecto?")) return;

    try {
      await deleteIntervencion(id);
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error eliminando proyecto");
    }
  };

  return (
    <div>
      <h3 className="mb-3">Proyectos de Intervención</h3>

      <div className="panel-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={{ color: "var(--muted)" }}>
            Tabla de proyectos de intervención
          </div>

          <BtnNuevo
            label="Nuevo Proyecto"
            onClick={openCreate}
            disabled={loading}
          />
        </div>

        {loading ? (
          <div style={{ color: "var(--muted)" }}>Cargando...</div>
        ) : (
          <div className="table-wrap">
            <div className="table-responsive">
              <table className="table table-dark table-dark-custom align-middle">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Institución</th>
                    <th>Año</th>
                    <th>Rol</th>
                    <th>Respaldo</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.titulo}</td>
                      <td>{r.institucion}</td>
                      <td>{r.anio}</td>
                      <td>{r.rol}</td>

                      <td>
                        <a
                          href={r.respaldo || "#"}
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
                      <td colSpan="6" style={{ color: "var(--muted)" }}>
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
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Título*
            </label>
            <input
              className="form-control input-dark"
              value={form.titulo}
              onChange={(e) =>
                setForm({ ...form, titulo: e.target.value })
              }
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Institución
            </label>
            <input
              className="form-control input-dark"
              value={form.institucion}
              onChange={(e) =>
                setForm({ ...form, institucion: e.target.value })
              }
            />
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Año*
            </label>
            <input
              className="form-control input-dark"
              value={form.anio}
              onChange={(e) =>
                setForm({ ...form, anio: e.target.value })
              }
            />
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Rol
            </label>
            <input
              className="form-control input-dark"
              value={form.rol}
              onChange={(e) =>
                setForm({ ...form, rol: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Descripción
            </label>
            <textarea
              className="form-control input-dark"
              rows="3"
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Respaldo (link)
            </label>
            <input
              className="form-control input-dark"
              value={form.respaldo}
              onChange={(e) =>
                setForm({ ...form, respaldo: e.target.value })
              }
              placeholder="https://..."
            />
          </div>

        </div>

      </FormModal>
    </div>
  );
}