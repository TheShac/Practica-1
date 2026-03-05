import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getFichaAcademica } from "../../../../services/ficha.service";
import { getAcademicos } from "../../../../services/api";
import FormModal from "../../../../components/FormModal";

import {
  createLibroParaAcademico,
  updateLibroParaAcademico,
  deleteLibroParaAcademico,
  createPublicacionParaAcademico,
  updatePublicacionParaAcademico,
  deletePublicacionParaAcademico,
  createCapLibroParaAcademico,
  updateCapLibroParaAcademico,
  deleteCapLibroParaAcademico,
  createTesisParaAcademico,
  updateTesisParaAcademico,
  deleteTesisParaAcademico,
  createInvestigacionParaAcademico,
  updateInvestigacionParaAcademico,
  deleteInvestigacionParaAcademico,
  createPatenteParaAcademico,
  updatePatenteParaAcademico,
  deletePatenteParaAcademico,
} from "../../../../services/api.service";

const SECCIONES_CONFIG = {
  magister: {
    titulo:    "Tesis Magíster",
    icono:     "bi-mortarboard-fill",
    idKey:     "tesis_id",
    campo:     "titulo_tesis",
    columnas:  ["titulo_tesis", "autor", "nombre_programa", "institucion", "ano", "rol_guia"],
    emptyForm: { titulo_tesis: "", nombre_programa: "", institucion: "", tesis_dirigida: "", ano: "", autor: "", link_verificacion: "", rol_guia: "" },
    campos: [
      { key: "titulo_tesis",      label: "Título*",          col: "col-12",   required: true  },
      { key: "autor",             label: "Autor",            col: "col-md-6", required: false },
      { key: "nombre_programa",   label: "Programa",         col: "col-md-6", required: false },
      { key: "institucion",       label: "Institución",      col: "col-md-6", required: false },
      { key: "tesis_dirigida",    label: "Tesis dirigida",   col: "col-md-6", required: false },
      { key: "rol_guia",          label: "Rol guía",         col: "col-md-6", required: false },
      { key: "ano",               label: "Año",              col: "col-md-6", required: false },
      { key: "link_verificacion", label: "Respaldo (link)",  col: "col-12",   required: false },
    ],
  },
  doctorado: {
    titulo:    "Tesis Doctorado",
    icono:     "bi-building-fill",
    idKey:     "tesis_id",
    campo:     "titulo_tesis",
    columnas:  ["titulo_tesis", "autor", "nombre_programa", "institucion", "ano", "rol_guia"],
    emptyForm: { titulo_tesis: "", nombre_programa: "", institucion: "", tesis_dirigida: "", ano: "", autor: "", link_verificacion: "", rol_guia: "" },
    campos: [
      { key: "titulo_tesis",      label: "Título*",          col: "col-12",   required: true  },
      { key: "autor",             label: "Autor",            col: "col-md-6", required: false },
      { key: "nombre_programa",   label: "Programa",         col: "col-md-6", required: false },
      { key: "institucion",       label: "Institución",      col: "col-md-6", required: false },
      { key: "tesis_dirigida",    label: "Tesis dirigida",   col: "col-md-6", required: false },
      { key: "rol_guia",          label: "Rol guía",         col: "col-md-6", required: false },
      { key: "ano",               label: "Año",              col: "col-md-6", required: false },
      { key: "link_verificacion", label: "Respaldo (link)",  col: "col-12",   required: false },
    ],
  },
  publicaciones: {
    titulo:    "Publicaciones",
    icono:     "bi-file-earmark-text-fill",
    idKey:     "publicacion_id",
    campo:     "titulo_articulo",
    columnas:  ["titulo_articulo", "nombre_revista", "autor_principal", "ano", "estado"],
    emptyForm: { titulo_articulo: "", nombre_revista: "", ISSN: "", ano: "", autor_principal: "", autores: "", link_verificacion: "", estado: "" },
    campos: [
      { key: "titulo_articulo",   label: "Título artículo*", col: "col-12",   required: true  },
      { key: "nombre_revista",    label: "Revista",          col: "col-md-6", required: false },
      { key: "ISSN",              label: "ISSN",             col: "col-md-6", required: false },
      { key: "autor_principal",   label: "Autor principal",  col: "col-md-6", required: false },
      { key: "autores",           label: "Otros autores",    col: "col-md-6", required: false },
      { key: "ano",               label: "Año",              col: "col-md-6", required: false },
      { key: "estado",            label: "Estado",           col: "col-md-6", required: false },
      { key: "link_verificacion", label: "Respaldo (link)",  col: "col-12",   required: false },
    ],
  },
  libros: {
    titulo:    "Libros",
    icono:     "bi-book-fill",
    idKey:     "libro_id",
    campo:     "nombre_libro",
    columnas:  ["nombre_libro", "editorial", "autor_principal", "ano", "estado"],
    emptyForm: { nombre_libro: "", editorial: "", lugar: "", ano: "", autor_principal: "", autores: "", link_verificacion: "", estado: "" },
    campos: [
      { key: "nombre_libro",      label: "Nombre libro*",    col: "col-12",   required: true  },
      { key: "editorial",         label: "Editorial",        col: "col-md-6", required: false },
      { key: "lugar",             label: "Lugar",            col: "col-md-6", required: false },
      { key: "autor_principal",   label: "Autor principal",  col: "col-md-6", required: false },
      { key: "autores",           label: "Otros autores",    col: "col-md-6", required: false },
      { key: "ano",               label: "Año",              col: "col-md-6", required: false },
      { key: "estado",            label: "Estado",           col: "col-md-6", required: false },
      { key: "link_verificacion", label: "Respaldo (link)",  col: "col-12",   required: false },
    ],
  },
  capitulos: {
    titulo:    "Capítulos de Libro",
    icono:     "bi-bookmark-fill",
    idKey:     "cap_id",
    campo:     "nombre_capitulo",
    columnas:  ["nombre_capitulo", "nombre_libro", "editorial", "ano", "estado"],
    emptyForm: { nombre_capitulo: "", nombre_libro: "", editorial: "", lugar: "", ano: "", autor_principal: "", autores: "", link_verificacion: "", estado: "" },
    campos: [
      { key: "nombre_capitulo",   label: "Nombre capítulo*", col: "col-12",   required: true  },
      { key: "nombre_libro",      label: "Libro",            col: "col-md-6", required: false },
      { key: "editorial",         label: "Editorial",        col: "col-md-6", required: false },
      { key: "lugar",             label: "Lugar",            col: "col-md-6", required: false },
      { key: "autor_principal",   label: "Autor principal",  col: "col-md-6", required: false },
      { key: "autores",           label: "Otros autores",    col: "col-md-6", required: false },
      { key: "ano",               label: "Año",              col: "col-md-6", required: false },
      { key: "estado",            label: "Estado",           col: "col-md-6", required: false },
      { key: "link_verificacion", label: "Respaldo (link)",  col: "col-12",   required: false },
    ],
  },
  investigaciones: {
    titulo:    "Investigaciones",
    icono:     "bi-search",
    idKey:     "investigacion_id",
    campo:     "titulo",
    columnas:  ["titulo", "fuente_financiamiento", "ano_adjudicacion", "periodo_ejecucion", "rol_proyecto"],
    emptyForm: { titulo: "", fuente_financiamiento: "", ano_adjudicacion: "", periodo_ejecucion: "", rol_proyecto: "", link_verificacion: "" },
    campos: [
      { key: "titulo",                label: "Título*",               col: "col-12",   required: true  },
      { key: "fuente_financiamiento", label: "Fuente financiamiento", col: "col-md-6", required: false },
      { key: "ano_adjudicacion",      label: "Año adjudicación",      col: "col-md-3", required: false },
      { key: "periodo_ejecucion",     label: "Período ejecución",     col: "col-md-3", required: false, placeholder: "Ej: 2023-2026" },
      { key: "rol_proyecto",          label: "Rol en el proyecto",    col: "col-12",   required: false },
      { key: "link_verificacion",     label: "Respaldo (link)",       col: "col-12",   required: false },
    ],
  },
  patentes: {
    titulo:    "Patentes",
    icono:     "bi-award-fill",
    idKey:     "patente_id",
    campo:     "nombre_patente",
    columnas:  ["nombre_patente", "inventores", "num_registro", "estado", "fecha_solicitud"],
    emptyForm: { nombre_patente: "", inventores: "", num_registro: "", fecha_solicitud: "", fecha_publicacion: "", estado: "", link_verificacion: "" },
    campos: [
      { key: "nombre_patente",    label: "Nombre patente*",   col: "col-12",   required: true  },
      { key: "inventores",        label: "Inventores",        col: "col-12",   required: false },
      { key: "num_registro",      label: "N° registro",       col: "col-md-6", required: false },
      { key: "estado",            label: "Estado",            col: "col-md-6", required: false },
      { key: "fecha_solicitud",   label: "Fecha solicitud",   col: "col-md-6", required: false },
      { key: "fecha_publicacion", label: "Fecha publicación", col: "col-md-6", required: false },
      { key: "link_verificacion", label: "Respaldo (link)",   col: "col-12",   required: false },
    ],
  },
};

const SECCIONES_LIST = Object.entries(SECCIONES_CONFIG).map(([key, cfg]) => ({
  key,
  titulo: cfg.titulo,
  icono:  cfg.icono,
}));

// ── Helpers ───────────────────────────────────────────────────────────────────
function nombreCompleto(academico) {
  if (!academico) return "";
  return [
    academico.primer_nombre,
    academico.segundo_nombre,
    academico.primer_apellido,
    academico.segundo_apellido,
  ]
    .filter(Boolean)
    .join(" ");
}

function labelCol(key) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function EditarFicha() {
  const { usuarioId } = useParams();

  const [data, setData]                   = useState(null);
  const [academico, setAcademico]         = useState(null);
  const [seccionActiva, setSeccionActiva] = useState(null);
  const [loading, setLoading]             = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode]           = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState({});
  const [errors, setErrors]       = useState({});
  const [saving, setSaving]       = useState(false);

  const config = seccionActiva ? SECCIONES_CONFIG[seccionActiva] : null;

  const servicios = useMemo(() => ({
    magister: {
      create: (f) => createTesisParaAcademico(usuarioId, { ...f, nivel_programa: "MAGISTER" }),
      update: (id, f) => updateTesisParaAcademico(usuarioId, id, f),
      delete: (id) => deleteTesisParaAcademico(usuarioId, id),
    },
    doctorado: {
      create: (f) => createTesisParaAcademico(usuarioId, { ...f, nivel_programa: "DOCTORADO" }),
      update: (id, f) => updateTesisParaAcademico(usuarioId, id, f),
      delete: (id) => deleteTesisParaAcademico(usuarioId, id),
    },
    publicaciones: {
      create: (f) => createPublicacionParaAcademico(usuarioId, f),
      update: (id, f) => updatePublicacionParaAcademico(usuarioId, id, f),
      delete: (id) => deletePublicacionParaAcademico(usuarioId, id),
    },
    libros: {
      create: (f) => createLibroParaAcademico(usuarioId, f),
      update: (id, f) => updateLibroParaAcademico(usuarioId, id, f),
      delete: (id) => deleteLibroParaAcademico(usuarioId, id),
    },
    capitulos: {
      create: (f) => createCapLibroParaAcademico(usuarioId, f),
      update: (id, f) => updateCapLibroParaAcademico(usuarioId, id, f),
      delete: (id) => deleteCapLibroParaAcademico(usuarioId, id),
    },
    investigaciones: {
      create: (f) => createInvestigacionParaAcademico(usuarioId, f),
      update: (id, f) => updateInvestigacionParaAcademico(usuarioId, id, f),
      delete: (id) => deleteInvestigacionParaAcademico(usuarioId, id),
    },
    patentes: {
      create: (f) => createPatenteParaAcademico(usuarioId, f),
      update: (id, f) => updatePatenteParaAcademico(usuarioId, id, f),
      delete: (id) => deletePatenteParaAcademico(usuarioId, id),
    },
  }), [usuarioId]);

  const modalTitle = useMemo(() => {
    if (!config) return "";
    return mode === "create"
      ? `Nueva entrada — ${config.titulo}`
      : `Editar — ${config.titulo}`;
  }, [mode, config]);

  const loadFicha = async () => {
    const res = await getFichaAcademica(usuarioId);
    setData(res);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [fichaRes, academicosRes] = await Promise.all([
          getFichaAcademica(usuarioId),
          getAcademicos(),
        ]);
        setData(fichaRes);
        const found = academicosRes.find(
          (a) => String(a.usuario_id) === String(usuarioId)
        );
        setAcademico(found || null);
      } catch (error) {
        console.error("Error cargando ficha:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [usuarioId]);

  function validate() {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    config?.campos.forEach(({ key, label, required }) => {
      if (required && !String(form[key] ?? "").trim()) {
        newErrors[key] = `${label.replace("*", "")} es obligatorio`;
      }
    });

    ["ano", "ano_adjudicacion"].forEach((anoKey) => {
      const val = form[anoKey];
      if (val) {
        if (!/^\d{4}$/.test(val))
          newErrors[anoKey] = "Debe tener 4 dígitos";
        else if (Number(val) < 1900 || Number(val) > currentYear)
          newErrors[anoKey] = `Entre 1900 y ${currentYear}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const openCreate = () => {
    setMode("create");
    setEditingId(null);
    setForm(config?.emptyForm ?? {});
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (row) => {
    setMode("edit");
    setEditingId(row[config.idKey] ?? null);
    setForm({ ...row });
    setErrors({});
    setShowModal(true);
  };

  const close = () => setShowModal(false);

  const submit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const svc = servicios[seccionActiva];
      if (mode === "create") {
        await svc.create(form);
      } else {
        await svc.update(editingId, form);
      }
      await loadFicha();
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar este registro?")) return;
    try {
      await servicios[seccionActiva].delete(id);
      await loadFicha();
    } catch (err) {
      alert(err.message);
    }
  };

  const itemsSeccion = () => {
    if (!seccionActiva) return [];
    switch (seccionActiva) {
      case "magister":        return data.tesis?.filter(t => t.nivel_programa === "MAGISTER") ?? [];
      case "doctorado":       return data.tesis?.filter(t => t.nivel_programa === "DOCTORADO") ?? [];
      case "publicaciones":   return data.publicaciones ?? [];
      case "libros":          return data.libros ?? [];
      case "capitulos":       return data.capitulos ?? [];
      case "investigaciones": return data.investigaciones ?? [];
      case "patentes":        return data.patentes ?? [];
      default:                return [];
    }
  };

  if (loading) {
    return <div style={{ color: "var(--muted)" }}>Cargando...</div>;
  }

  if (!data) {
    return <div style={{ color: "var(--muted)" }}>No se encontró información.</div>;
  }

  return (
    <div>
      <h3 className="mb-3">
        Ficha Académica{academico ? ` — ${nombreCompleto(academico)}` : ""}
      </h3>

      {/* CARDS DE SECCIÓN */}
      <div className="panel-card">
        <div style={{ color: "var(--muted)" }} className="mb-4">
          Selecciona una sección para ver y gestionar sus registros
        </div>

        <div className="row g-3">
          {SECCIONES_LIST.map((sec) => {
            const isActive = seccionActiva === sec.key;
            return (
              <div className="col-md-4 col-lg-3" key={sec.key}>
                <div
                  className={`panel-card mb-0 d-flex align-items-center gap-3 ${isActive ? "border border-primary" : ""}`}
                  style={{ cursor: "pointer", transition: "border-color 0.2s" }}
                  onClick={() => setSeccionActiva(sec.key)}
                >
                  <i
                    className={`bi ${sec.icono} fs-4 ${isActive ? "text-primary" : ""}`}
                    style={{ color: isActive ? undefined : "var(--muted)" }}
                  />
                  <span
                    className="fw-semibold small"
                    style={{ color: isActive ? undefined : "var(--muted)" }}
                  >
                    {sec.titulo}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LISTADO */}
      {config && (
        <div className="mt-4">
          <div className="panel-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div style={{ color: "var(--muted)" }}>{config.titulo}</div>
              <button className="btn btn-primary btn-sm" onClick={openCreate}>
                <i className="bi bi-plus-lg me-2" />
                Nuevo
              </button>
            </div>

            {itemsSeccion().length === 0 ? (
              <div style={{ color: "var(--muted)" }}>Sin registros.</div>
            ) : (
              <div className="table-wrap">
                <div className="table-responsive">
                  <table className="table table-dark table-dark-custom align-middle">
                    <thead>
                      <tr>
                        <th>#</th>
                        {config.columnas.map((col) => (
                          <th key={col}>{labelCol(col)}</th>
                        ))}
                        <th className="text-end">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsSeccion().map((item, index) => (
                        <tr key={item[config.idKey] ?? index}>
                          <td style={{ color: "var(--muted)", width: "40px" }}>
                            {index + 1}
                          </td>
                          {config.columnas.map((col) => (
                            <td key={col}>{item[col] ?? "—"}</td>
                          ))}
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-light me-2"
                              onClick={() => openEdit(item)}
                            >
                              <i className="bi bi-pencil me-1" />
                              Editar
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => remove(item[config.idKey])}
                            >
                              <i className="bi bi-trash me-1" />
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL */}
      {config && (
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
            {config.campos.map(({ key, label, col, placeholder }) => (
              <div className={`col-12 ${col}`} key={key}>
                <label className="form-label">{label}</label>
                <input
                  className={`form-control input-dark${errors[key] ? " is-invalid" : ""}`}
                  value={form[key] ?? ""}
                  placeholder={placeholder ?? ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
                {errors[key] && (
                  <div className="invalid-feedback">{errors[key]}</div>
                )}
              </div>
            ))}
          </div>
        </FormModal>
      )}
    </div>
  );
}