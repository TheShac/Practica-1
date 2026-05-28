import { useEffect, useState } from "react";
import BtnNuevo  from "@/shared/components/ui/buttons/BtnCreate.jsx";
import Toast     from "@/shared/components/ui/feedback/Toast.jsx";

import { getUsuarios, getUsuarioPerfil, createUsuario, updateUsuario, updateUsuarioPerfil, updatePassword, deleteUsuario } from "@/features/admin/services/usuario.service.js";
import { getRoles, getRolesAcademico } from "@/features/admin/services/roles.service.js";

import ModalCrearUsuario    from "./components/ModalCrearUsuario.jsx";
import ModalEditarUsuario   from "./components/ModalEditarUsuario.jsx";
import ModalCambiarPassword from "./components/ModalCambiarPassword.jsx";

const emptyBasic = {
  rut: "", primer_nombre: "", segundo_nombre: "",
  primer_apellido: "", segundo_apellido: "",
  telefono: "", ano_ingreso: "", lineas_investigacion: "",
  rol_id: "", password: "", programas: [],
};

const emptyPerfil = {
  rut: "",
  primer_nombre: "", segundo_nombre: "",
  primer_apellido: "", segundo_apellido: "",
  telefono: "", ano_ingreso: "", lineas_investigacion: "",
  rol_id: "", programas: [], correos: [],
  grado_academico: { nombre_grado: "", institucion_grado: "", pais_grado: "", ano_grado: "" },
  titulaciones: [],
};

function ProgramaBadges({ programas = [] }) {
  if (!programas.length) return <span style={{ color: "var(--muted)" }}>—</span>;
  return (
    <div className="d-flex flex-wrap gap-1">
      {programas.map((p) => (
        <span
          key={p.programa}
          className={`badge-status ${p.programa === "DOCTORADO" ? "badge-aceptado" : "badge-aceptado"}`}
        >
          {p.programa} — {p.tipo_academico}
        </span>
      ))}
    </div>
  );
}

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles]       = useState([]);
  const [rolesAca, setRolesAca] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit]     = useState(false);
  const [showPass, setShowPass]     = useState(false);

  const [formCreate, setFormCreate]     = useState(emptyBasic);
  const [formEdit, setFormEdit]         = useState(emptyPerfil);
  const [editingId, setEditingId]       = useState(null);
  const [editingRolId, setEditingRolId] = useState(null);
  const [newPassword, setNewPassword]   = useState("");

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const showToast = (message, type = "success") => setToast({ show: true, message, type });
  const hideToast = () => setToast((t) => ({ ...t, show: false }));

  useEffect(() => {
    async function load() {
      try {
        const [u, r, ra] = await Promise.all([getUsuarios(), getRoles(), getRolesAcademico()]);
        setUsuarios(u); setRoles(r); setRolesAca(ra);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const reloadUsuarios = async () => setUsuarios(await getUsuarios());

  // ── CREATE ───────────────────────────────────────────────
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
    } catch (err) { showToast(err.message, "error"); }
    finally { setSaving(false); }
  };

  // ── EDIT ─────────────────────────────────────────────────
  const openEdit = async (u) => {
    setEditingId(u.usuario_id);
    setEditingRolId(Number(u.rol_id));
    if (Number(u.rol_id) === 3) {
      try {
        const perfil = await getUsuarioPerfil(u.usuario_id);
        setFormEdit({
          rut:                  perfil.usuario.rut || u.rut || "",
          primer_nombre:        perfil.usuario.primer_nombre,
          segundo_nombre:       perfil.usuario.segundo_nombre || "",
          primer_apellido:      perfil.usuario.primer_apellido,
          segundo_apellido:     perfil.usuario.segundo_apellido || "",
          telefono:             perfil.usuario.telefono || "",
          ano_ingreso:          perfil.usuario.ano_ingreso || "",
          lineas_investigacion: perfil.usuario.lineas_investigacion || "",
          rol_id:               Number(perfil.usuario.rol_id),
          programas:            (perfil.usuario.programas || []).map(p => ({
            programa_id:    Number(p.programa_id),
            rolaca_id:      Number(p.rolaca_id),
            programa:       p.programa,
            tipo_academico: p.tipo_academico,
          })),
          correos:         perfil.correos || [],
          grado_academico: perfil.grado_academico || { nombre_grado: "", institucion_grado: "", pais_grado: "", ano_grado: "" },
          titulaciones:    perfil.titulaciones || [],
        });
      } catch (err) { showToast(err.message, "error"); return; }
    } else {
      setFormEdit({
        ...emptyPerfil,
        rut:                  u.rut || "",
        primer_nombre:        u.primer_nombre,
        segundo_nombre:       u.segundo_nombre || "",
        primer_apellido:      u.primer_apellido,
        segundo_apellido:     u.segundo_apellido || "",
        telefono:             u.telefono || "",
        ano_ingreso:          u.ano_ingreso || "",
        lineas_investigacion: u.lineas_investigacion || "",
        rol_id:               Number(u.rol_id),
        programas:            (u.programas || []).map(p => ({
          programa_id: Number(p.programa_id),
          rolaca_id:   Number(p.rolaca_id),
        })),
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
        programas:            formEdit.programas,
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
    } catch (err) { showToast(err.message, "error"); }
    finally { setSaving(false); }
  };

  // ── DELETE ───────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este usuario? Esta acción no se puede deshacer.")) return;
    try {
      await deleteUsuario(id);
      setUsuarios((prev) => prev.filter((u) => u.usuario_id !== id));
      showToast("Usuario eliminado correctamente.");
    } catch (err) { showToast(err.message, "error"); }
  };

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
                    <th>Programa / Tipo</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.usuario_id}>
                      <td>{u.rut}</td>
                      <td>{u.primer_nombre} {u.primer_apellido}</td>
                      <td><span className="badge-status badge-aceptado">{u.rol_nombre}</span></td>
                      <td><ProgramaBadges programas={u.programas || []} /></td>
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

      <ModalCrearUsuario
        show={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        saving={saving}
        roles={roles}
        rolesAca={rolesAca}
        form={formCreate}
        setForm={setFormCreate}
      />

      <ModalEditarUsuario
        show={showEdit}
        onClose={() => setShowEdit(false)}
        onSubmit={handleEdit}
        saving={saving}
        roles={roles}
        rolesAca={rolesAca}
        form={formEdit}
        setForm={setFormEdit}
        editingRolId={editingRolId}
      />

      <ModalCambiarPassword
        show={showPass}
        onClose={() => setShowPass(false)}
        onSubmit={handlePassword}
        saving={saving}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
    </div>
  );
}