import { useEffect, useMemo, useState } from "react";
import FormModal from "../../components/FormModal.jsx";
import BtnNuevo from "@/components/ui/buttons/BtnCreate.jsx";

import {
  getMisIntervenciones,
  createIntervencion,
  updateIntervencion,
  deleteIntervencion,
} from "../../services/Intervencion.service.js";

const emptyForm = {
  titulo: "",
  fuente_financiamiento: "",
  ano_adjudicacion: "",
  periodo_ejecucion: "",
  rol_proyecto: "",
  link_verificacion: "",
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

  const load = async () => {
    const data = await getMisIntervenciones();

    setRows(
      data.map((p) => ({
        id: p.proyecto_id,
        titulo: p.titulo || "",
        fuente_financiamiento: p.fuente_financiamiento || "",
        ano_adjudicacion: p.ano_adjudicacion
          ? String(p.ano_adjudicacion)
          : "",
        periodo_ejecucion: p.periodo_ejecucion || "",
        rol_proyecto: p.rol_proyecto || "",
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
        alert(err.message || "Error cargando proyectos");
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
      titulo: row.titulo,
      fuente_financiamiento: row.fuente_financiamiento,
      ano_adjudicacion: row.ano_adjudicacion,
      periodo_ejecucion: row.periodo_ejecucion,
      rol_proyecto: row.rol_proyecto,
      link_verificacion: row.link_verificacion,
    });

    setShowModal(true);
  };

  const close = () => setShowModal(false);

  const submit = async () => {
    if (!form.titulo || !form.ano_adjudicacion) {
      alert("Completa al menos Título y Año.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        titulo: form.titulo,
        fuente_financiamiento: form.fuente_financiamiento,
        ano_adjudicacion: form.ano_adjudicacion
          ? Number(form.ano_adjudicacion)
          : null,
        periodo_ejecucion: form.periodo_ejecucion,
        rol_proyecto: form.rol_proyecto,
        link_verificacion: form.link_verificacion,
      };

      if (mode === "create") {
        await createIntervencion(payload);
      } else {
        await updateIntervencion(editingId, payload);
      }

      await load();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error guardando proyecto");
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
      alert(err.message || "Error eliminando proyecto");
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
          <BtnNuevo label="Nueva Proyecto" onClick={openCreate} disabled={loading} />
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
                    <th>Fuente financiamiento</th>
                    <th>Año</th>
                    <th>Periodo</th>
                    <th>Rol</th>
                    <th>Respaldo</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.titulo}</td>
                      <td>{r.fuente_financiamiento}</td>
                      <td>{r.ano_adjudicacion}</td>
                      <td>{r.periodo_ejecucion}</td>
                      <td>{r.rol_proyecto}</td>

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
                      <td colSpan="7" style={{ color: "var(--muted)" }}>
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
              Fuente de financiamiento
            </label>
            <input
              className="form-control input-dark"
              value={form.fuente_financiamiento}
              onChange={(e) =>
                setForm({
                  ...form,
                  fuente_financiamiento: e.target.value,
                })
              }
            />
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Año*
            </label>
            <input
              className="form-control input-dark"
              value={form.ano_adjudicacion}
              onChange={(e) =>
                setForm({
                  ...form,
                  ano_adjudicacion: e.target.value,
                })
              }
            />
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Rol
            </label>
            <input
              className="form-control input-dark"
              value={form.rol_proyecto}
              onChange={(e) =>
                setForm({
                  ...form,
                  rol_proyecto: e.target.value,
                })
              }
            />
          </div>

          <div className="col-12">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Periodo de ejecución
            </label>
            <input
              className="form-control input-dark"
              value={form.periodo_ejecucion}
              onChange={(e) =>
                setForm({
                  ...form,
                  periodo_ejecucion: e.target.value,
                })
              }
            />
          </div>

          <div className="col-12">
            <label className="form-label" style={{ color: "var(--muted)" }}>
              Respaldo (link)
            </label>
            <input
              className="form-control input-dark"
              value={form.link_verificacion}
              onChange={(e) =>
                setForm({
                  ...form,
                  link_verificacion: e.target.value,
                })
              }
              placeholder="https://..."
            />
          </div>

        </div>
      </FormModal>
    </div>
  );
}