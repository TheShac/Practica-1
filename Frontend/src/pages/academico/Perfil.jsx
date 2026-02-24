import { useEffect, useState } from "react";
import {
  getPerfilAcademico,
  updatePerfilAcademico,
} from "../../services/user.service";

export default function PerfilAcademico() {
  const [perfil, setPerfil] = useState(null);
  const [formData, setFormData] = useState(null);
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const usuario = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPerfil = async () => {
      const data = await getPerfilAcademico(usuario.usuario_id);
      setPerfil(data);
      setFormData(data);
      setLoading(false);
    };

    fetchPerfil();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGuardar = async () => {
    await updatePerfilAcademico(usuario.usuario_id, formData);
    setPerfil(formData);
    setEditando(false);
  };

  const handleCancelar = () => {
    setFormData(perfil);
    setEditando(false);
  };

  if (loading) return <p>Cargando...</p>;
  if (!perfil) return <p>No se encontró perfil</p>;

  return (
  <div className="perfil-wrapper">

    <div className="perfil-header">
      <h1 className="perfil-title">Mi Perfil</h1>

      <div className="perfil-actions">
        {!editando ? (
          <button
            className="btn-primary"
            onClick={() => setEditando(true)}
          >
            Editar Perfil
          </button>
        ) : (
          <>
            <button
              className="btn-primary"
              onClick={handleGuardar}
            >
              Guardar
            </button>
            <button
              className="btn-primary"
              onClick={handleCancelar}
            >
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>

      {/* INFORMACIÓN PERSONAL */}
      <div className="perfil-card">
        <h2>Información Personal</h2>
        <div className="perfil-grid">

          <div>
            <label>Primer Nombre</label>
            <input
              name="primer_nombre"
              value={formData.primer_nombre || ""}
              onChange={handleChange}
              disabled={!editando}
            />
          </div>

          <div>
            <label>Segundo Nombre</label>
            <input
              name="segundo_nombre"
              value={formData.segundo_nombre || ""}
              onChange={handleChange}
              disabled={!editando}
            />
          </div>

          <div>
            <label>Primer Apellido</label>
            <input
              name="primer_apellido"
              value={formData.primer_apellido || ""}
              onChange={handleChange}
              disabled={!editando}
            />
          </div>

          <div>
            <label>Segundo Apellido</label>
            <input
              name="segundo_apellido"
              value={formData.segundo_apellido || ""}
              onChange={handleChange}
              disabled={!editando}
            />
          </div>

          <div>
            <label>RUT</label>
            <input value={perfil.rut} disabled />
          </div>

          <div>
            <label>Líneas de Investigación</label>
            <input
              name="lineas_investigacion"
              value={formData.lineas_investigacion || ""}
              onChange={handleChange}
              disabled={!editando}
            />
          </div>
        </div>
      </div>

      {/* INFORMACIÓN LABORAL */}
      <div className="perfil-card">
        <h2>Información Laboral</h2>
        <div className="perfil-grid">
          <div>
            <label>Tipo de Contrato</label>
            <input value={perfil.contrato || ""} disabled />
          </div>

          <div>
            <label>Rol</label>
            <input value={perfil.rol_nombre} disabled />
          </div>
        </div>
      </div>

      {/* CONTACTO */}
      <div className="perfil-card">
        <h2>Contacto</h2>
        <div className="perfil-grid">
          <div>
            <label>Correo</label>
            <input
              name="correo"
              value={formData.correo || ""}
              onChange={handleChange}
              disabled={!editando}
            />
          </div>

          <div>
            <label>Teléfono</label>
            <input
              name="telefono"
              value={formData.telefono || ""}
              onChange={handleChange}
              disabled={!editando}
            />
          </div>
        </div>
      </div>
    </div>
  );
}