import { useEffect, useState } from "react";
import { getUsuarios, updateUsuario } from "@/features/admin/services/usuario.service.js";
import { getRoles, getRolesAcademico, createRol, updateRol, deleteRol, createRolAcademico, updateRolAcademico, deleteRolAcademico } from "@/features/admin/services/roles.service.js";

const PROGRAMAS = [
  { programa_id: 1, nombre: "MAGISTER" },
  { programa_id: 2, nombre: "DOCTORADO" },
]

export default function AdminRoles() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles]       = useState([]);
  const [rolesAca, setRolesAca] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [savingU, setSavingU]   = useState(null);
  const [error, setError]       = useState("");

  // Edición inline de roles del sistema
  const [editingRol, setEditingRol]       = useState(null);
  const [editingRolAca, setEditingRolAca] = useState(null);
  const [newRol, setNewRol]               = useState("");
  const [newRolAca, setNewRolAca]         = useState("");

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

  // ── ASIGNACIÓN DE ROL POR USUARIO ───────────────────────
  const handleRolChange = (
    usuario_id,
    field,
    value
  ) => {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.usuario_id === usuario_id
          ? {
              ...u,
              [field]: value,
            }
          : u
      )
    );
  };

  const handleGuardarUsuario = async (u) => {
    setSavingU(u.usuario_id);

    try {
      await updateUsuario(
        u.usuario_id,
        {
          rol_id:
            u.rol_id || null,

          programas:
            u.programas?.map(
              (p) => ({
                programa_id:
                  p.programa_id,
                rolaca_id:
                  p.rolaca_id,
              })
            ) || [],
        }
      );
    } catch {
      alert(
        "No se pudo guardar el usuario"
      );
    } finally {
      setSavingU(null);
    }
  };

  // ── CRUD ROL ─────────────────────────────────────────────
  const handleCreateRol = async () => {
    if (!newRol.trim()) return;
    try {
      const created = await createRol(newRol.trim());
      setRoles((prev) => [...prev, created]);
      setNewRol("");
    } catch (err) { alert(err.message); }
  };

  const handleUpdateRol = async () => {
    if (!editingRol?.nombre.trim()) return;
    try {
      const updated = await updateRol(editingRol.rol_id, editingRol.nombre.trim());
      setRoles((prev) => prev.map((r) => r.rol_id === updated.rol_id ? updated : r));
      setEditingRol(null);
    } catch (err) { alert(err.message); }
  };

  const handleDeleteRol = async (rol_id) => {
    if (!confirm("¿Eliminar este rol? Los usuarios con este rol quedarán sin rol asignado.")) return;
    try {
      await deleteRol(rol_id);
      setRoles((prev) => prev.filter((r) => r.rol_id !== rol_id));
    } catch (err) { alert(err.message); }
  };

  // ── CRUD ROL ACADÉMICO ───────────────────────────────────
  const handleCreateRolAca = async () => {
    if (!newRolAca.trim()) return;
    try {
      const created = await createRolAcademico(newRolAca.trim());
      setRolesAca((prev) => [...prev, created]);
      setNewRolAca("");
    } catch (err) { alert(err.message); }
  };

  const handleUpdateRolAca = async () => {
    if (!editingRolAca?.tipo_academico.trim()) return;
    try {
      const updated = await updateRolAcademico(editingRolAca.rolaca_id, editingRolAca.tipo_academico.trim());
      setRolesAca((prev) => prev.map((r) => r.rolaca_id === updated.rolaca_id ? updated : r));
      setEditingRolAca(null);
    } catch (err) { alert(err.message); }
  };

  const handleDeleteRolAca = async (rolaca_id) => {
    if (!confirm("¿Eliminar este tipo de contrato?")) return;
    try {
      await deleteRolAcademico(rolaca_id);
      setRolesAca((prev) => prev.filter((r) => r.rolaca_id !== rolaca_id));
    } catch (err) { alert(err.message); }
  };

  if (loading) return <div style={{ color: "var(--muted)" }}>Cargando...</div>;

  return (
    <div>
      <h3 className="mb-3 perfil-title">Gestión de Roles</h3>

      {error && <div className="text-danger mb-3">{error}</div>}

      {/* ── SECCIÓN 1: Roles del sistema ── */}
      <div className="row g-4 mb-4">

        {/* Roles */}
        <div className="col-12 col-md-6">
          <div className="panel-card">
            <div className="perfil-title" style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>Roles del sistema</div>
            <table className="table table-dark table-dark-custom align-middle fa-table mb-3">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((r) => (
                  <tr key={r.rol_id}>
                    <td>
                      {editingRol?.rol_id === r.rol_id ? (
                        <input
                          className="form-control form-control-sm input-dark"
                          value={editingRol.nombre}
                          onChange={(e) => setEditingRol({ ...editingRol, nombre: e.target.value })}
                        />
                      ) : r.nombre}
                    </td>
                    <td className="text-center" style={{ whiteSpace: "nowrap" }}>
                      {editingRol?.rol_id === r.rol_id ? (
                        <>
                          <button className="btn btn-sm me-2" style={{ borderColor: "#22c55e", color: "#22c55e" }} onClick={handleUpdateRol}>
                            <i className="bi bi-check-lg" />
                          </button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditingRol(null)}>
                            <i className="bi bi-x" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-sm me-2" style={{ borderColor: "#f97316", color: "#f97316" }} onClick={() => setEditingRol({ ...r })}>
                            <i className="bi bi-pencil" />
                          </button>
                          <button className="btn btn-sm" style={{ borderColor: "#ef4444", color: "#ef4444" }} onClick={() => handleDeleteRol(r.rol_id)}>
                            <i className="bi bi-trash" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex gap-2">
              <input
                className="form-control input-dark"
                placeholder="Nuevo rol..."
                value={newRol}
                onChange={(e) => setNewRol(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateRol()}
              />
              <button className="btn btn-sm btn-outline-light" onClick={handleCreateRol}>
                <i className="bi bi-plus-lg" />
              </button>
            </div>
          </div>
        </div>

        {/* Tipos de contrato */}
        <div className="col-12 col-md-6">
          <div className="panel-card">
            <div className="perfil-title" style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>Tipos de contrato académico</div>
            <table className="table table-dark table-dark-custom align-middle fa-table mb-3">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rolesAca.map((r) => (
                  <tr key={r.rolaca_id}>
                    <td>
                      {editingRolAca?.rolaca_id === r.rolaca_id ? (
                        <input
                          className="form-control form-control-sm input-dark"
                          value={editingRolAca.tipo_academico}
                          onChange={(e) => setEditingRolAca({ ...editingRolAca, tipo_academico: e.target.value })}
                        />
                      ) : r.tipo_academico}
                    </td>
                    <td className="text-center" style={{ whiteSpace: "nowrap" }}>
                      {editingRolAca?.rolaca_id === r.rolaca_id ? (
                        <>
                          <button className="btn btn-sm me-2" style={{ borderColor: "#22c55e", color: "#22c55e" }} onClick={handleUpdateRolAca}>
                            <i className="bi bi-check-lg" />
                          </button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditingRolAca(null)}>
                            <i className="bi bi-x" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-sm me-2" style={{ borderColor: "#f97316", color: "#f97316" }} onClick={() => setEditingRolAca({ ...r })}>
                            <i className="bi bi-pencil" />
                          </button>
                          <button className="btn btn-sm" style={{ borderColor: "#ef4444", color: "#ef4444" }} onClick={() => handleDeleteRolAca(r.rolaca_id)}>
                            <i className="bi bi-trash" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex gap-2">
              <input
                className="form-control input-dark"
                placeholder="Nuevo tipo de contrato..."
                value={newRolAca}
                onChange={(e) => setNewRolAca(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateRolAca()}
              />
              <button className="btn btn-sm btn-outline-light" onClick={handleCreateRolAca}>
                <i className="bi bi-plus-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECCIÓN 2: Asignación de roles por usuario ── */}
      <div className="panel-card">
        <div
          className="perfil-title"
          style={{
            fontWeight: 600,
            fontSize: 15,
            marginBottom: 4,
          }}
        >
          Asignación de roles por usuario
        </div>

        <div
          style={{
            color: "var(--muted)",
            fontSize: 13,
            marginBottom: 12,
          }}
        >
          Configura el rol del sistema y la
          participación académica en
          Magister y Doctorado.
        </div>

        <div className="table-wrap">
          <div className="table-responsive">
            <table className="table table-dark table-dark-custom align-middle fa-table">
              <thead>
                <tr>
                  <th>RUT</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>MAGISTER</th>
                  <th>DOCTORADO</th>
                  <th className="text-center">
                    Guardar
                  </th>
                </tr>
              </thead>

              <tbody>
                {usuarios.map((u) => {
                  const rolAcademico =
                    roles.find(
                      (r) =>
                        r.nombre?.toLowerCase() ===
                        "academico"
                    );

                  const esAcademico =
                    Number(u.rol_id) ===
                    Number(
                      rolAcademico?.rol_id
                    );

                  const getPrograma =
                    (programa_id) =>
                      u.programas?.find(
                        (p) =>
                          Number(
                            p.programa_id
                          ) ===
                          Number(programa_id)
                      );

                  return (
                    <tr key={u.usuario_id}>
                      <td>{u.rut}</td>

                      <td>
                        {u.primer_nombre}{" "}
                        {u.primer_apellido}
                      </td>

                      {/* ROL */}
                      <td>
                        <select
                          className="form-select input-dark form-select-sm"
                          value={
                            u.rol_id || ""
                          }
                          onChange={(e) => {
                            const value =
                              Number(
                                e.target.value
                              ) || null;

                            setUsuarios(
                              (prev) =>
                                prev.map(
                                  (user) => {
                                    if (
                                      user.usuario_id !==
                                      u.usuario_id
                                    ) {
                                      return user;
                                    }

                                    const nuevoAcademico =
                                      value ===
                                      Number(
                                        rolAcademico?.rol_id
                                      );

                                    return {
                                      ...user,
                                      rol_id:
                                        value,
                                      programas:
                                        nuevoAcademico
                                          ? user.programas ||
                                            []
                                          : [],
                                    };
                                  }
                                )
                            );
                          }}
                        >
                          <option value="">
                            Seleccionar
                          </option>

                          {roles.map(
                            (r) => (
                              <option
                                key={
                                  r.rol_id
                                }
                                value={
                                  r.rol_id
                                }
                              >
                                {r.nombre}
                              </option>
                            )
                          )}
                        </select>
                      </td>

                      {/* MAGISTER */}
                      <td>
                        {esAcademico ? (
                          <select
                            className="form-select input-dark form-select-sm"
                            value={
                              getPrograma(
                                1
                              )?.rolaca_id ||
                              ""
                            }
                            onChange={(e) => {
                              const rolaca_id =
                                Number(
                                  e.target
                                    .value
                                ) ||
                                null;

                              setUsuarios(
                                (
                                  prev
                                ) =>
                                  prev.map(
                                    (
                                      user
                                    ) => {
                                      if (
                                        user.usuario_id !==
                                        u.usuario_id
                                      ) {
                                        return user;
                                      }

                                      let programas =
                                        user.programas ||
                                        [];

                                      const existe =
                                        programas.find(
                                          (
                                            p
                                          ) =>
                                            p.programa_id ===
                                            1
                                        );

                                      if (
                                        !rolaca_id
                                      ) {
                                        programas =
                                          programas.filter(
                                            (
                                              p
                                            ) =>
                                              p.programa_id !==
                                              1
                                          );
                                      } else if (
                                        existe
                                      ) {
                                        programas =
                                          programas.map(
                                            (
                                              p
                                            ) =>
                                              p.programa_id ===
                                              1
                                                ? {
                                                    ...p,
                                                    rolaca_id,
                                                  }
                                                : p
                                          );
                                      } else {
                                        programas =
                                          [
                                            ...programas,
                                            {
                                              programa_id: 1,
                                              rolaca_id,
                                            },
                                          ];
                                      }

                                      return {
                                        ...user,
                                        programas,
                                      };
                                    }
                                  )
                              );
                            }}
                          >
                            <option value="">
                              Sin asignar
                            </option>

                            {rolesAca.map(
                              (r) => (
                                <option
                                  key={
                                    r.rolaca_id
                                  }
                                  value={
                                    r.rolaca_id
                                  }
                                >
                                  {
                                    r.tipo_academico
                                  }
                                </option>
                              )
                            )}
                          </select>
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* DOCTORADO */}
                      <td>
                        {esAcademico ? (
                          <select
                            className="form-select input-dark form-select-sm"
                            value={
                              getPrograma(
                                2
                              )?.rolaca_id ||
                              ""
                            }
                            onChange={(e) => {
                              const rolaca_id =
                                Number(
                                  e.target
                                    .value
                                ) ||
                                null;

                              setUsuarios(
                                (
                                  prev
                                ) =>
                                  prev.map(
                                    (
                                      user
                                    ) => {
                                      if (
                                        user.usuario_id !==
                                        u.usuario_id
                                      ) {
                                        return user;
                                      }

                                      let programas =
                                        user.programas ||
                                        [];

                                      const existe =
                                        programas.find(
                                          (
                                            p
                                          ) =>
                                            p.programa_id ===
                                            2
                                        );

                                      if (
                                        !rolaca_id
                                      ) {
                                        programas =
                                          programas.filter(
                                            (
                                              p
                                            ) =>
                                              p.programa_id !==
                                              2
                                          );
                                      } else if (
                                        existe
                                      ) {
                                        programas =
                                          programas.map(
                                            (
                                              p
                                            ) =>
                                              p.programa_id ===
                                              2
                                                ? {
                                                    ...p,
                                                    rolaca_id,
                                                  }
                                                : p
                                          );
                                      } else {
                                        programas =
                                          [
                                            ...programas,
                                            {
                                              programa_id: 2,
                                              rolaca_id,
                                            },
                                          ];
                                      }

                                      return {
                                        ...user,
                                        programas,
                                      };
                                    }
                                  )
                              );
                            }}
                          >
                            <option value="">
                              Sin asignar
                            </option>

                            {rolesAca.map(
                              (r) => (
                                <option
                                  key={
                                    r.rolaca_id
                                  }
                                  value={
                                    r.rolaca_id
                                  }
                                >
                                  {
                                    r.tipo_academico
                                  }
                                </option>
                              )
                            )}
                          </select>
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* GUARDAR */}
                      <td className="text-center">
                        <button
                          className="btn btn-sm"
                          style={{
                            borderColor:
                              "#22c55e",
                            color:
                              "#22c55e",
                          }}
                          disabled={
                            savingU ===
                            u.usuario_id
                          }
                          onClick={() =>
                            handleGuardarUsuario(
                              u
                            )
                          }
                        >
                          {savingU ===
                          u.usuario_id ? (
                            <i className="bi bi-hourglass-split" />
                          ) : (
                            <i className="bi bi-check-lg" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {usuarios.length ===
                  0 && (
                  <tr>
                    <td colSpan="6">
                      Sin usuarios.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}