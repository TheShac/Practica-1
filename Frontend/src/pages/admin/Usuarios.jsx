import { useEffect, useState } from "react";
import FormModal from "@/components/overlays/formModal/FormModal.jsx";
import BtnNuevo from "@/components/ui/buttons/BtnCreate.jsx";
import Toast from "@/components/ui/feedback/Toast.jsx";
import {
  getUsuarios, getRoles, getRolesAcademico, getUsuarioPerfil,
  createUsuario, updateUsuario, updateUsuarioPerfil,
  updatePassword, deleteUsuario,
} from "../../services/admin/admin.service.js";

const emptyBasic = {
  rut: "", primer_nombre: "", segundo_nombre: "",
  primer_apellido: "", segundo_apellido: "",
  telefono: "", ano_ingreso: "", lineas_investigacion: "",
  rol_id: "", rolaca_id: "", password: "",
};

const emptyPerfil = {
  primer_nombre: "", segundo_nombre: "",
  primer_apellido: "", segundo_apellido: "",
  telefono: "", ano_ingreso: "", lineas_investigacion: "",
  rol_id: "", rolaca_id: "",
  correos: [],
  grado_academico: { nombre_grado: "", institucion_grado: "", pais_grado: "", ano_grado: "" },
  titulaciones: [],
};

export default function AdminUsuarios() {
  const [usuarios, setUsuarios]     = useState([]);
  const [roles, setRoles]           = useState([]);
  const [rolesAca, setRolesAca]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit]     = useState(false);
  const [showPass, setShowPass]     = useState(false);

  const [formCreate, setFormCreate] = useState(emptyBasic);
  const [formEdit, setFormEdit]     = useState(emptyPerfil);
  const [editingId, setEditingId]   = useState(null);
  const [editingRolId, setEditingRolId] = useState(null);
  const [newPassword, setNewPassword]   = useState("");

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") =>
    setToast({ show: true, message, type });

  const hideToast = () =>
    setToast((t) => ({ ...t, show: false }));

  useEffect(() => {
    async function load() {
      try {
        const [u, r, ra] = await Promise.all([getUsuarios(), getRoles(), getRolesAcademico()]);
        setUsuarios(u);
        setRoles(r);
        setRolesAca(ra);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const reloadUsuarios = async () => setUsuarios(await getUsuarios());

  // ── CREATE ──────────────────────────────────────────────
  const openCreate = () => { setFormCreate(emptyBasic); setShowCreate(true); };

   const handleCreate = async () => {
        if (!formCreate.rut || !formCreate.primer_nombre || !formCreate.primer_apellido || !formCreate.password || !formCreate.rol_id) {
        showToast("RUT, nombre, apellido, rol y contraseña son obligatorios.", "error"); return;
        }
        setSaving(true);
        try {
        const created = await createUsuario(formCreate);
        setUsuarios((prev) => [created, ...prev]);
        setShowCreate(false);
        showToast("Usuario creado correctamente.");
        } catch (err) {
        showToast(err.message, "error");
        } finally { setSaving(false); }
    };

  // ── EDIT ────────────────────────────────────────────────
  const openEdit = async (u) => {
    setEditingId(u.usuario_id);
    setEditingRolId(u.rol_id);
    if (u.rol_id === 3) {
      try {
        const perfil = await getUsuarioPerfil(u.usuario_id);
        setFormEdit({
          primer_nombre:        perfil.usuario.primer_nombre,
          segundo_nombre:       perfil.usuario.segundo_nombre || "",
          primer_apellido:      perfil.usuario.primer_apellido,
          segundo_apellido:     perfil.usuario.segundo_apellido || "",
          telefono:             perfil.usuario.telefono || "",
          ano_ingreso:          perfil.usuario.ano_ingreso || "",
          lineas_investigacion: perfil.usuario.lineas_investigacion || "",
          rol_id:               perfil.usuario.rol_id,
          rolaca_id:            perfil.usuario.rolaca_id || "",
          correos:              perfil.correos || [],
          grado_academico:      perfil.grado_academico || { nombre_grado: "", institucion_grado: "", pais_grado: "", ano_grado: "" },
          titulaciones:         perfil.titulaciones || [],
        });
      } catch (err) { showToast(err.message, "error"); return; }
    } else {
      setFormEdit({
        ...emptyPerfil,
        primer_nombre:        u.primer_nombre,
        segundo_nombre:       u.segundo_nombre || "",
        primer_apellido:      u.primer_apellido,
        segundo_apellido:     u.segundo_apellido || "",
        lineas_investigacion: u.lineas_investigacion || "",
        rol_id:               u.rol_id,
        rolaca_id:            u.rolaca_id || "",
      });
    }
    setShowEdit(true);
  };

  const handleEdit = async () => {
    setSaving(true);
    try {
      await updateUsuario(editingId, {
        primer_nombre:        formEdit.primer_nombre,
        segundo_nombre:       formEdit.segundo_nombre || null,
        primer_apellido:      formEdit.primer_apellido,
        segundo_apellido:     formEdit.segundo_apellido || null,
        telefono:             formEdit.telefono || null,
        ano_ingreso:          formEdit.ano_ingreso || null,
        lineas_investigacion: formEdit.lineas_investigacion || null,
        rol_id:               formEdit.rol_id,
        rolaca_id:            formEdit.rolaca_id || null,
      });
      if (editingRolId === 3 || Number(formEdit.rol_id) === 3) {
        await updateUsuarioPerfil(editingId, {
          primer_nombre:        formEdit.primer_nombre,
          segundo_nombre:       formEdit.segundo_nombre,
          primer_apellido:      formEdit.primer_apellido,
          segundo_apellido:     formEdit.segundo_apellido,
          telefono:             formEdit.telefono,
          ano_ingreso:          formEdit.ano_ingreso,
          lineas_investigacion: formEdit.lineas_investigacion,
          correos:              formEdit.correos,
          grado_academico:      formEdit.grado_academico,
          titulaciones:         formEdit.titulaciones,
        });
      }
      await reloadUsuarios();
      setShowEdit(false);
      showToast("Usuario actualizado correctamente.");
    } catch (err) { showToast(err.message, "error"); }
    finally { setSaving(false); }
  };

  // ── PASSWORD ─────────────────────────────────────────────
  const openPass = (u) => { setEditingId(u.usuario_id); setNewPassword(""); setShowPass(true); };

  const handlePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      showToast("La contraseña debe tener al menos 6 caracteres.", "error"); return;
    }
    setSaving(true);
    try {
      await updatePassword(editingId, newPassword);
      setShowPass(false);
      showToast("Contraseña actualizada correctamente.");
    } catch (err) {
      showToast(err.message, "error");
    } finally { setSaving(false); }
  };

  // ── DELETE ───────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este usuario? Esta acción no se puede deshacer.")) return;
    try {
      await deleteUsuario(id);
      setUsuarios((prev) => prev.filter((u) => u.usuario_id !== id));
      showToast("Usuario eliminado correctamente.");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // ── HELPERS ──────────────────────────────────────────────
  const addCorreo      = () => setFormEdit((p) => ({ ...p, correos: [...p.correos, { mail: "" }] }));
  const removeCorreo   = (i) => setFormEdit((p) => ({ ...p, correos: p.correos.filter((_, idx) => idx !== i) }));
  const addTitulacion  = () => setFormEdit((p) => ({ ...p, titulaciones: [...p.titulaciones, { titulo: "", institucion_titulacion: "", pais_titulacion: "", ano_titulacion: "" }] }));
  const removeTitulacion = (i) => setFormEdit((p) => ({ ...p, titulaciones: p.titulaciones.filter((_, idx) => idx !== i) }));

  const isAcademico = Number(formEdit.rol_id) === 3;

  return (
    <div>
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={hideToast} />

      <h3 className="mb-3 perfil-title">Gestión de Usuarios</h3>
      <div className="panel-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={{ color: "var(--muted)" }}>Usuarios registrados en el sistema</div>
          <BtnNuevo label="Nuevo Usuario" onClick={openCreate} disabled={loading} />
        </div>

        {error && <div className="text-danger mb-2">{error}</div>}

        {loading ? (
          <div style={{ color: "var(--muted)" }}>Cargando...</div>
        ) : (
          <div className="table-wrap">
            <div className="table-responsive">
              <table className="table table-dark table-dark-custom align-middle fa-table">
                <thead>
                  <tr>
                    <th>RUT</th>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th>Tipo Contrato</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.usuario_id}>
                      <td>{u.rut}</td>
                      <td>{u.primer_nombre} {u.primer_apellido}</td>
                      <td><span className="badge-status badge-aceptado">{u.rol_nombre}</span></td>
                      <td>{u.rolaca_id ? rolesAca.find((r) => r.rolaca_id === u.rolaca_id)?.tipo_academico : "—"}</td>
                      <td className="text-center" style={{ whiteSpace: "nowrap" }}>
                        <button className="btn btn-sm me-2" style={{ borderColor: "#f97316", color: "#f97316" }} onClick={() => openEdit(u)}>
                          <i className="bi bi-pencil" />
                        </button>
                        <button className="btn btn-sm me-2" style={{ borderColor: "#0ea5e9", color: "#0ea5e9" }} onClick={() => openPass(u)}>
                          <i className="bi bi-key" />
                        </button>
                        <button className="btn btn-sm" style={{ borderColor: "#ef4444", color: "#ef4444" }} onClick={() => handleDelete(u.usuario_id)}>
                          <i className="bi bi-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {usuarios.length === 0 && (
                    <tr><td colSpan="5" style={{ color: "var(--muted)" }}>Sin usuarios.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── MODAL CREAR ── */}
      <FormModal show={showCreate} title="Nuevo Usuario" onClose={() => setShowCreate(false)} onSubmit={handleCreate} submitText={saving ? "Guardando..." : "Crear Usuario"}>
        <div className="row g-3">
          <div className="col-12 col-md-4">
            <label className="form-label" style={{ color: "var(--muted)" }}>RUT*</label>
            <input className="form-control input-dark" placeholder="12.345.678-9" value={formCreate.rut} onChange={(e) => setFormCreate({ ...formCreate, rut: e.target.value })} />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" style={{ color: "var(--muted)" }}>Primer nombre*</label>
            <input className="form-control input-dark" value={formCreate.primer_nombre} onChange={(e) => setFormCreate({ ...formCreate, primer_nombre: e.target.value })} />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" style={{ color: "var(--muted)" }}>Segundo nombre</label>
            <input className="form-control input-dark" value={formCreate.segundo_nombre} onChange={(e) => setFormCreate({ ...formCreate, segundo_nombre: e.target.value })} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" style={{ color: "var(--muted)" }}>Primer apellido*</label>
            <input className="form-control input-dark" value={formCreate.primer_apellido} onChange={(e) => setFormCreate({ ...formCreate, primer_apellido: e.target.value })} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" style={{ color: "var(--muted)" }}>Segundo apellido</label>
            <input className="form-control input-dark" value={formCreate.segundo_apellido} onChange={(e) => setFormCreate({ ...formCreate, segundo_apellido: e.target.value })} />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" style={{ color: "var(--muted)" }}>Teléfono</label>
            <input className="form-control input-dark" value={formCreate.telefono} onChange={(e) => setFormCreate({ ...formCreate, telefono: e.target.value })} />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" style={{ color: "var(--muted)" }}>Año ingreso</label>
            <input className="form-control input-dark" placeholder="2024" value={formCreate.ano_ingreso} onChange={(e) => setFormCreate({ ...formCreate, ano_ingreso: e.target.value })} />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" style={{ color: "var(--muted)" }}>Rol*</label>
            <select className="form-select input-dark" value={formCreate.rol_id} onChange={(e) => setFormCreate({ ...formCreate, rol_id: Number(e.target.value), rolaca_id: "" })}>
              <option value="">Seleccione...</option>
              {roles.map((r) => <option key={r.rol_id} value={r.rol_id}>{r.nombre}</option>)}
            </select>
          </div>
          {Number(formCreate.rol_id) === 3 && (
            <div className="col-12 col-md-6">
              <label className="form-label" style={{ color: "var(--muted)" }}>Tipo contrato</label>
              <select className="form-select input-dark" value={formCreate.rolaca_id} onChange={(e) => setFormCreate({ ...formCreate, rolaca_id: Number(e.target.value) })}>
                <option value="">Seleccione...</option>
                {rolesAca.map((r) => <option key={r.rolaca_id} value={r.rolaca_id}>{r.tipo_academico}</option>)}
              </select>
            </div>
          )}
          <div className="col-12">
            <label className="form-label" style={{ color: "var(--muted)" }}>Líneas de investigación</label>
            <textarea className="form-control input-dark" rows={2} value={formCreate.lineas_investigacion} onChange={(e) => setFormCreate({ ...formCreate, lineas_investigacion: e.target.value })} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" style={{ color: "var(--muted)" }}>Contraseña*</label>
            <input type="password" className="form-control input-dark" value={formCreate.password} onChange={(e) => setFormCreate({ ...formCreate, password: e.target.value })} />
          </div>
        </div>
      </FormModal>

      {/* ── MODAL EDITAR ── */}
      <FormModal show={showEdit} title="Editar Usuario" onClose={() => setShowEdit(false)} onSubmit={handleEdit} submitText={saving ? "Guardando..." : "Guardar Cambios"}>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label" style={{ color: "var(--muted)" }}>Primer nombre</label>
            <input className="form-control input-dark" value={formEdit.primer_nombre} onChange={(e) => setFormEdit({ ...formEdit, primer_nombre: e.target.value })} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" style={{ color: "var(--muted)" }}>Segundo nombre</label>
            <input className="form-control input-dark" value={formEdit.segundo_nombre} onChange={(e) => setFormEdit({ ...formEdit, segundo_nombre: e.target.value })} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" style={{ color: "var(--muted)" }}>Primer apellido</label>
            <input className="form-control input-dark" value={formEdit.primer_apellido} onChange={(e) => setFormEdit({ ...formEdit, primer_apellido: e.target.value })} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" style={{ color: "var(--muted)" }}>Segundo apellido</label>
            <input className="form-control input-dark" value={formEdit.segundo_apellido} onChange={(e) => setFormEdit({ ...formEdit, segundo_apellido: e.target.value })} />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" style={{ color: "var(--muted)" }}>Teléfono</label>
            <input className="form-control input-dark" value={formEdit.telefono} onChange={(e) => setFormEdit({ ...formEdit, telefono: e.target.value })} />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" style={{ color: "var(--muted)" }}>Año ingreso</label>
            <input className="form-control input-dark" value={formEdit.ano_ingreso} onChange={(e) => setFormEdit({ ...formEdit, ano_ingreso: e.target.value })} />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" style={{ color: "var(--muted)" }}>Rol</label>
            <select className="form-select input-dark" value={formEdit.rol_id} onChange={(e) => setFormEdit({ ...formEdit, rol_id: Number(e.target.value), rolaca_id: "" })}>
              <option value="">Seleccione...</option>
              {roles.map((r) => <option key={r.rol_id} value={r.rol_id}>{r.nombre}</option>)}
            </select>
          </div>
          {isAcademico && (
            <div className="col-12 col-md-6">
              <label className="form-label" style={{ color: "var(--muted)" }}>Tipo contrato</label>
              <select className="form-select input-dark" value={formEdit.rolaca_id} onChange={(e) => setFormEdit({ ...formEdit, rolaca_id: Number(e.target.value) })}>
                <option value="">Seleccione...</option>
                {rolesAca.map((r) => <option key={r.rolaca_id} value={r.rolaca_id}>{r.tipo_academico}</option>)}
              </select>
            </div>
          )}
          <div className="col-12">
            <label className="form-label" style={{ color: "var(--muted)" }}>Líneas de investigación</label>
            <textarea className="form-control input-dark" rows={2} value={formEdit.lineas_investigacion} onChange={(e) => setFormEdit({ ...formEdit, lineas_investigacion: e.target.value })} />
          </div>

          {isAcademico && (
            <>
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label mb-0" style={{ color: "var(--muted)" }}>Correos</label>
                  <button type="button" className="btn btn-sm btn-outline-light" onClick={addCorreo}>
                    <i className="bi bi-plus" /> Agregar
                  </button>
                </div>
                {formEdit.correos.map((c, i) => (
                  <div key={i} className="d-flex gap-2 mb-2">
                    <input className="form-control input-dark" placeholder="correo@ejemplo.com"
                      value={c.mail} onChange={(e) => {
                        const updated = [...formEdit.correos];
                        updated[i] = { ...updated[i], mail: e.target.value };
                        setFormEdit({ ...formEdit, correos: updated });
                      }} />
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeCorreo(i)}>
                      <i className="bi bi-trash" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="col-12">
                <label className="form-label" style={{ color: "var(--muted)" }}>Grado académico</label>
              </div>
              <div className="col-12 col-md-6">
                <input className="form-control input-dark" placeholder="Nombre del grado"
                  value={formEdit.grado_academico?.nombre_grado || ""}
                  onChange={(e) => setFormEdit({ ...formEdit, grado_academico: { ...formEdit.grado_academico, nombre_grado: e.target.value } })} />
              </div>
              <div className="col-12 col-md-6">
                <input className="form-control input-dark" placeholder="Institución"
                  value={formEdit.grado_academico?.institucion_grado || ""}
                  onChange={(e) => setFormEdit({ ...formEdit, grado_academico: { ...formEdit.grado_academico, institucion_grado: e.target.value } })} />
              </div>
              <div className="col-12 col-md-6">
                <input className="form-control input-dark" placeholder="País"
                  value={formEdit.grado_academico?.pais_grado || ""}
                  onChange={(e) => setFormEdit({ ...formEdit, grado_academico: { ...formEdit.grado_academico, pais_grado: e.target.value } })} />
              </div>
              <div className="col-12 col-md-6">
                <input className="form-control input-dark" placeholder="Año"
                  value={formEdit.grado_academico?.ano_grado || ""}
                  onChange={(e) => setFormEdit({ ...formEdit, grado_academico: { ...formEdit.grado_academico, ano_grado: e.target.value } })} />
              </div>

              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label mb-0" style={{ color: "var(--muted)" }}>Titulaciones</label>
                  <button type="button" className="btn btn-sm btn-outline-light" onClick={addTitulacion}>
                    <i className="bi bi-plus" /> Agregar
                  </button>
                </div>
                {formEdit.titulaciones.map((t, i) => (
                  <div key={i} className="row g-2 mb-2">
                    <div className="col-12 col-md-6">
                      <input className="form-control input-dark" placeholder="Título"
                        value={t.titulo} onChange={(e) => {
                          const updated = [...formEdit.titulaciones];
                          updated[i] = { ...updated[i], titulo: e.target.value };
                          setFormEdit({ ...formEdit, titulaciones: updated });
                        }} />
                    </div>
                    <div className="col-12 col-md-6">
                      <input className="form-control input-dark" placeholder="Institución"
                        value={t.institucion_titulacion} onChange={(e) => {
                          const updated = [...formEdit.titulaciones];
                          updated[i] = { ...updated[i], institucion_titulacion: e.target.value };
                          setFormEdit({ ...formEdit, titulaciones: updated });
                        }} />
                    </div>
                    <div className="col-8 col-md-5">
                      <input className="form-control input-dark" placeholder="País"
                        value={t.pais_titulacion} onChange={(e) => {
                          const updated = [...formEdit.titulaciones];
                          updated[i] = { ...updated[i], pais_titulacion: e.target.value };
                          setFormEdit({ ...formEdit, titulaciones: updated });
                        }} />
                    </div>
                    <div className="col-8 col-md-5">
                      <input className="form-control input-dark" placeholder="Año"
                        value={t.ano_titulacion} onChange={(e) => {
                          const updated = [...formEdit.titulaciones];
                          updated[i] = { ...updated[i], ano_titulacion: e.target.value };
                          setFormEdit({ ...formEdit, titulaciones: updated });
                        }} />
                    </div>
                    <div className="col-4 col-md-2 d-flex align-items-center">
                      <button type="button" className="btn btn-sm btn-outline-danger w-100" onClick={() => removeTitulacion(i)}>
                        <i className="bi bi-trash" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </FormModal>

      {/* ── MODAL CONTRASEÑA ── */}
      <FormModal show={showPass} title="Cambiar Contraseña" onClose={() => setShowPass(false)} onSubmit={handlePassword} submitText={saving ? "Guardando..." : "Cambiar Contraseña"}>
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label" style={{ color: "var(--muted)" }}>Nueva contraseña</label>
            <input type="password" className="form-control input-dark" value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
          </div>
        </div>
      </FormModal>
    </div>
  );
}