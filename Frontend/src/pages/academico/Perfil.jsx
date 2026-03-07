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

  const usuarioStorage = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const data = await getPerfilAcademico(
          usuarioStorage.usuario_id
        );

        setPerfil(data);

        setFormData({
          ...data.usuario,

          ano_ingreso: data.usuario?.ano_ingreso || "",
          telefono: data.usuario?.telefono || "",
          lineas_investigacion:
            data.usuario?.lineas_investigacion || "",

          contrato: data.usuario?.contrato || "",
          rol_nombre: data.usuario?.rol_nombre || "",

          correos: data.correos || [],

          grado_academico: data.grado_academico || {
            nombre_grado: "",
            institucion_grado: "",
            pais_grado: "",
            ano_grado: "",
          },

          titulaciones: data.titulaciones || [],
        });

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchPerfil();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGradoChange = (e) => {
    setFormData({
      ...formData,
      grado_academico: {
        ...formData.grado_academico,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleCorreoChange = (index, value) => {
    const nuevos = [...formData.correos];
    nuevos[index].mail = value;
    setFormData({ ...formData, correos: nuevos });
  };

  const agregarCorreo = () => {
    setFormData({
      ...formData,
      correos: [...formData.correos, { mail: "" }],
    });
  };

  const eliminarCorreo = (index) => {
    const nuevos = formData.correos.filter((_, i) => i !== index);
    setFormData({ ...formData, correos: nuevos });
  };

  const handleTitulacionChange = (index, field, value) => {
    const nuevas = [...formData.titulaciones];
    nuevas[index][field] = value;
    setFormData({ ...formData, titulaciones: nuevas });
  };

  const agregarTitulacion = () => {
    setFormData({
      ...formData,
      titulaciones: [
        ...formData.titulaciones,
        {
          titulo: "",
          institucion_titulacion: "",
          pais_titulacion: "",
          ano_titulacion: "",
        },
      ],
    });
  };

  const eliminarTitulacion = (index) => {
    const nuevas = formData.titulaciones.filter((_, i) => i !== index);
    setFormData({ ...formData, titulaciones: nuevas });
  };

  const handleGuardar = async () => {
    console.log(formData);
    await updatePerfilAcademico(
      usuarioStorage.usuario_id,
      formData
    );
    setEditando(false);
    window.location.reload();
  };

  const handleCancelar = () => {
    window.location.reload();
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
              <button className="btn-primary" onClick={handleGuardar}>
                Guardar
              </button>
              <button className="btn-primary" onClick={handleCancelar}>
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

          <div className="form-group">
            <label>Primer Nombre</label>
            <input name="primer_nombre"
              value={formData.primer_nombre || ""}
              onChange={handleChange}
              disabled={!editando}
            />
          </div>

          <div className="form-group">
            <label>Segundo Nombre</label>
            <input name="segundo_nombre"
              value={formData.segundo_nombre || ""}
              onChange={handleChange}
              disabled={!editando}
            />
          </div>

          <div className="form-group">
            <label>Primer Apellido</label>
            <input name="primer_apellido"
              value={formData.primer_apellido || ""}
              onChange={handleChange}
              disabled={!editando}
            />
          </div>

          <div className="form-group">
            <label>Segundo Apellido</label>
            <input name="segundo_apellido"
              value={formData.segundo_apellido || ""}
              onChange={handleChange}
              disabled={!editando}
            />
          </div>

          <div className="form-group">
            <label>RUT</label>
            <input 
            name="rut"
            value={formData.rut} disabled 
            onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Año de Ingreso al Programa</label>
            <input
              type="number"
              name="ano_ingreso"
              value={formData.ano_ingreso || ""}
              onChange={handleChange}
              disabled={!editando}
            />
          </div>

          <div className="form-group">
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

          <div className="form-group">
            <label>Tipo de Contrato</label>
            <input value={formData.contrato || ""} disabled />
          </div>

          <div className="form-group">
            <label>Rol</label>
            <input value={formData.rol_nombre || ""} disabled />
          </div>

        </div>
      </div>

      {/* CONTACTO */}
      <div className="perfil-card">
        <h2>Contacto</h2>

        {/* TELÉFONO */}
        <div className="perfil-grid">
          <div className="form-group">
            <label>Teléfono</label>
            <input
              name="telefono"
              value={formData.telefono || ""}
              onChange={handleChange}
              disabled={!editando}
            />
          </div>
        </div>

        <div style={{ margin: "25px 0 15px 0" }}>
          <label>Correos Electrónicos</label>
        </div>

        {formData.correos.map((correo, index) => (
          <div key={index} className="perfil-correo-row">
            <input
              style={{ flex: 1 }}
              value={correo.mail}
              placeholder="correo@ejemplo.cl"
              onChange={(e) =>
                handleCorreoChange(index, e.target.value)
              }
              disabled={!editando}
            />

            {editando && (
              <button
                type="button"
                className="btn-danger-soft"
                onClick={() => eliminarCorreo(index)}
              >
                Eliminar
              </button>
            )}
          </div>
        ))}

        {editando && (
          <button
            type="button"
            className="btn-primary"
            onClick={agregarCorreo}
            style={{ marginTop: "10px" }}
          >
            + Agregar Correo
          </button>
        )}
      </div>

      {/* GRADO ACADÉMICO */}
      <div className="perfil-card">
        <h2>Grado Académico</h2>
        <div className="perfil-grid">
          <div className="form-group">
            <label>Nombre del Grado</label>
            <input
              name="nombre_grado"
              value={formData.grado_academico?.nombre_grado || ""}
              onChange={handleGradoChange}
              disabled={!editando}
              placeholder="Nombre del Grado"
            />
          </div>

          <div className="form-group">
            <label>Institucion Grado</label>
            <input
              name="institucion_grado"
              value={formData.grado_academico?.institucion_grado || ""}
              onChange={handleGradoChange}
              disabled={!editando}
              placeholder="Institución"
            />
          </div>

          <div className="form-group">
            <label>Pais del Grado</label>
            <input
              name="pais_grado"
              value={formData.grado_academico?.pais_grado || ""}
              onChange={handleGradoChange}
              disabled={!editando}
              placeholder="País"
            />
          </div>

          <div className="form-group">
          <label>Año del Grado</label>
          <input
            type="number"
            name="ano_grado"
            value={formData.grado_academico?.ano_grado || ""}
            onChange={handleGradoChange}
            disabled={!editando}
            placeholder="Año"
          />
          </div>

        </div>
      </div>

      {/* TITULACIONES */}
        <div className="perfil-card">
        <h2>Titulaciones</h2>

        {formData.titulaciones.map((t, index) => (
          <div key={index} className="perfil-titulacion-item">

          <div className="perfil-grid">
            <div className="form-group">
              <label>Nombre del Titulo</label>
              <input
                placeholder="Título"
                value={t.titulo}
                onChange={(e) =>
                  handleTitulacionChange(index, "titulo", e.target.value)
                }
                disabled={!editando}
              />
            </div>

            <div className="form-group">
              <label>Nombre de la Institucion</label>
              <input
                placeholder="Institución"
                value={t.institucion_titulacion}
                onChange={(e) =>
                  handleTitulacionChange(index, "institucion_titulacion", e.target.value)
                }
                disabled={!editando}
              />
            </div>
            <div className="form-group">
              <label>Pais de la Titulacion</label>
              <input
                placeholder="País"
                value={t.pais_titulacion}
                onChange={(e) =>
                  handleTitulacionChange(index, "pais_titulacion", e.target.value)
                }
                disabled={!editando}
              />
            </div>

            <div className="form-group">
            <label>Año de Titulacion</label>
            <input
              type="number"
              placeholder="Año"
              value={t.ano_titulacion}
              onChange={(e) =>
                handleTitulacionChange(index, "ano_titulacion", e.target.value)
              }
              disabled={!editando}
            />
            </div>
      </div>

      {editando && (
        <div className="perfil-titulacion-actions">
          <button
            type="button"
            className="btn-danger-soft"
            onClick={() => eliminarTitulacion(index)}
          >
            Eliminar Titulación
          </button>
        </div>
      )}

    </div>
  ))}

  {editando && (
    <button
      type="button"
      className="btn-primary"
      onClick={agregarTitulacion}
    >
      Agregar Titulación
    </button>
  )}
    </div>
</div>
  );
}