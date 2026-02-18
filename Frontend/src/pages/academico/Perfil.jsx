import { useEffect, useState } from "react";
import { getPerfilAcademico } from "../../services/user.service";

export default function PerfilAcademico() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const usuario = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const data = await getPerfilAcademico(usuario.usuario_id);
        setPerfil(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, []);

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p>{error}</p>;
  if (!perfil) return <p>No se encontró el perfil.</p>;

  return (
    <div className="perfil-wrapper">
      <h1 className="perfil-title">Mi Perfil</h1>

      {/* INFORMACIÓN PERSONAL */}
      <div className="perfil-card">
        <h2>Información Personal</h2>
        <div className="perfil-grid">
          <div>
            <label>Nombre Completo</label>
            <input
              value={`${perfil.primer_nombre} ${perfil.segundo_nombre || ""} ${perfil.primer_apellido} ${perfil.segundo_apellido || ""}`}
              disabled
            />
          </div>

          <div>
            <label>RUT</label>
            <input value={perfil.rut} disabled />
          </div>

          <div>
            <label>Líneas de Investigación</label>
            <input value={perfil.lineas_investigacion || ""} disabled />
          </div>
        </div>
      </div>

      {/* INFORMACIÓN LABORAL */}
      <div className="perfil-card">
        <h2>Información Laboral</h2>
        <div className="perfil-grid">
          <div>
            <label>Tipo de Contrato</label>
            <input value={perfil.contrato || "No definido"} disabled />
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
            <input value={perfil.correo} disabled />
          </div>
        </div>
        <div className="perfil-grid">
          <div>
            <label>Telefono</label>
            <input value={perfil.telefono || "Sin registro"} disabled />
          </div>
          </div>
      </div>
    </div>
  );
}
