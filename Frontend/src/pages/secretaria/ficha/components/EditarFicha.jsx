import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getFichaAcademica } from "../../../../services/ficha.service";
import { getAcademicos, getCategorias } from "../../../../services/api";
import FormModal from "../../../../components/FormModal";
import EstadoSelect from "../../../../components/forms/statusSelect/EstadoSelect";
import RespaldoInput from "@/components/forms/backupLink/RespaldoInput.jsx";
import IssnInput from "@/components/ui/inputs/IssnInput.jsx";

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

import {
  listIntervencionesDeAcademico,
  createIntervencionParaAcademico,
  updateIntervencionParaAcademico,
  deleteIntervencionParaAcademico,
} from "../../../../services/Intervencion.service.js";

import {
  createConsultoriaParaAcademico,
  updateConsultoriaParaAcademico,
  deleteConsultoriaParaAcademico,
} from "../../../../services/consultoria.service.js";

const SECCIONES_CONFIG = {
  magister: {
    titulo:    "Tesis Magíster",
    icono:     "bi-mortarboard-fill",
    idKey:     "tesis_id",
    campo:     "titulo_tesis",
    columnas:  ["titulo_tesis", "autor", "nombre_programa", "institucion", "ano", "rol_guia", "link_verificacion"],
    emptyForm: { titulo_tesis: "", nombre_programa: "", institucion: "", ano: "", autor: "", link_verificacion: "", rol_guia: "GUIA" },
    campos: [
      { key: "autor",             label: "Autor*",          col: "col-md-6", required: true  },
      { key: "ano",               label: "Año*",            col: "col-md-6", required: true  },
      { key: "titulo_tesis",      label: "Título*",         col: "col-12",   required: true  },
      { key: "nombre_programa",   label: "Programa*",       col: "col-md-6", required: true  },
      { key: "institucion",       label: "Institución*",    col: "col-md-6", required: true  },
      { key: "rol_guia",          label: "Rol guía",        col: "col-md-6", required: false, tipo: "rol_guia" },
      { key: "link_verificacion", label: "Respaldo (link)", col: "col-12",   required: false, tipo: "respaldo" },
    ],
  },
  doctorado: {
    titulo:    "Tesis Doctorado",
    icono:     "bi-building-fill",
    idKey:     "tesis_id",
    campo:     "titulo_tesis",
    columnas:  ["titulo_tesis", "autor", "nombre_programa", "institucion", "ano", "rol_guia", "tesis_dirigida", "link_verificacion"],
    emptyForm: { titulo_tesis: "", nombre_programa: "", institucion: "", tesis_dirigida: "", ano: "", autor: "", link_verificacion: "", rol_guia: "GUIA" },
    campos: [
      { key: "autor",             label: "Autor*",                                          col: "col-md-6", required: true  },
      { key: "ano",               label: "Año*",                                            col: "col-md-6", required: true  },
      { key: "titulo_tesis",      label: "Título*",                                         col: "col-12",   required: true  },
      { key: "nombre_programa",   label: "Programa*",                                       col: "col-md-6", required: true  },
      { key: "institucion",       label: "Institución*",                                    col: "col-md-6", required: true  },
      { key: "rol_guia",          label: "Rol guía",                                        col: "col-md-6", required: false, tipo: "rol_guia" },
      { key: "tesis_dirigida",    label: "¿Dirigida en el mismo programa?",                 col: "col-md-6", required: true,  tipo: "tesis_dirigida" },
      { key: "link_verificacion", label: "Respaldo (link)",                                 col: "col-12",   required: false, tipo: "respaldo" },
    ],
  },
  publicaciones: {
    titulo:    "Publicaciones",
    icono:     "bi-file-earmark-text-fill",
    idKey:     "publicacion_id",
    campo:     "titulo_articulo",
    columnas:  ["autores", "autor_principal", "ano", "categoria_nombre", "nombre_revista", "titulo_articulo", "estado", "ISSN", "link_verificacion"],
    emptyForm: { autores: "", autor_principal: "", ano: "", categoria_id: "", nombre_revista: "", titulo_articulo: "", estado: "Publicado", ISSN: "", link_verificacion: "" },
    campos: [
      { key: "autores",           label: "Autores",          col: "col-md-6", required: false },
      { key: "autor_principal",   label: "Autor principal",  col: "col-md-6", required: false },
      { key: "ano",               label: "Año",              col: "col-md-4", required: false },
      { key: "categoria_id",      label: "Indexados*",       col: "col-md-4", required: true,  tipo: "categorias" },
      { key: "nombre_revista",    label: "Revista",          col: "col-md-4", required: false },
      { key: "titulo_articulo",   label: "Título artículo*", col: "col-12",   required: true  },
      { key: "estado",            label: "Estado",           col: "col-md-6", required: false, tipo: "estado" },
      { key: "ISSN",              label: "ISSN",             col: "col-md-6", required: false, tipo: "issn" },
      { key: "link_verificacion", label: "Respaldo (link)",  col: "col-12",   required: false, tipo: "respaldo" },
    ],
  },
  libros: {
    titulo:    "Libros",
    icono:     "bi-book-fill",
    idKey:     "libro_id",
    campo:     "nombre_libro",
    columnas:  ["autores", "autor_principal", "ano", "nombre_libro", "lugar", "editorial", "estado", "link_verificacion"],
    emptyForm: { autores: "", autor_principal: "", ano: "", nombre_libro: "", lugar: "", editorial: "", estado: "Publicado", link_verificacion: "" },
    campos: [
      { key: "autores",           label: "Autor(es)",       col: "col-md-6", required: false },
      { key: "autor_principal",   label: "Autor/a principal",col: "col-md-6", required: false },
      { key: "ano",               label: "Año*",            col: "col-md-3", required: true  },
      { key: "estado",            label: "Estado",          col: "col-md-4", required: false, tipo: "estado" },
      { key: "nombre_libro",      label: "Nombre libro*",   col: "col-12",   required: true  },
      { key: "lugar",             label: "Lugar",           col: "col-md-6", required: false },
      { key: "editorial",         label: "Editorial",       col: "col-md-6", required: false },
      { key: "link_verificacion", label: "Respaldo (link)", col: "col-12",   required: false, tipo: "respaldo" },
    ],
  },
  capitulos: {
    titulo:    "Capítulos de Libro",
    icono:     "bi-bookmark-fill",
    idKey:     "cap_id",
    campo:     "nombre_capitulo",
    columnas:  ["autores", "autor_principal", "ano", "nombre_capitulo", "nombre_libro", "lugar", "editorial", "estado", "link_verificacion"],
    emptyForm: { autores: "", autor_principal: "", ano: "", nombre_capitulo: "", nombre_libro: "", lugar: "", editorial: "", estado: "Publicado", link_verificacion: "" },
    campos: [
      { key: "autores",           label: "Autor(es)",            col: "col-md-6", required: false },
      { key: "autor_principal",   label: "Autor/a principal",    col: "col-md-6", required: false },
      { key: "ano",               label: "Año*",                 col: "col-md-3", required: true  },
      { key: "estado",            label: "Estado",               col: "col-md-4", required: false, tipo: "estado" },
      { key: "nombre_capitulo",   label: "Nombre del capítulo*", col: "col-12",   required: true  },
      { key: "nombre_libro",      label: "Nombre libro",         col: "col-12",   required: false },
      { key: "lugar",             label: "Lugar",                col: "col-md-6", required: false },
      { key: "editorial",         label: "Editorial",            col: "col-md-6", required: false },
      { key: "link_verificacion", label: "Respaldo (link)",      col: "col-12",   required: false, tipo: "respaldo" },
    ],
  },
  investigaciones: {
    titulo:    "Investigaciones",
    icono:     "bi-search",
    idKey:     "investigacion_id",
    campo:     "titulo",
    columnas:  ["titulo", "fuente_financiamiento", "ano_adjudicacion", "periodo_ejecucion", "rol_proyecto", "link_verificacion"],
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
    columnas:  ["inventores", "nombre_patente", "fecha_solicitud", "fecha_publicacion", "num_registro", "estado", "link_verificacion"],
    emptyForm: { inventores: "", nombre_patente: "", fecha_solicitud: "", fecha_publicacion: "", num_registro: "", estado: "", link_verificacion: "" },
    campos: [
      { key: "inventores",        label: "Inventor(es)",          col: "col-12",   required: false },
      { key: "nombre_patente",    label: "Nombre Patente*",       col: "col-12",   required: true  },
      { key: "fecha_solicitud",   label: "Fecha de Solicitud",    col: "col-md-4", required: false, tipo: "date" },
      { key: "fecha_publicacion", label: "Fecha de Publicación",  col: "col-md-4", required: false, tipo: "date" },
      { key: "num_registro",      label: "N° de registro",        col: "col-md-4", required: false },
      { key: "estado",            label: "Estado",                col: "col-md-4", required: false, tipo: "estado" },
      { key: "link_verificacion", label: "Respaldo (link)",       col: "col-12",   required: false, tipo: "respaldo" },
    ],
  },

  intervenciones: {
    titulo:    "Proy. Intervención",
    icono:     "bi-briefcase",
    idKey:     "proyecto_id",
    campo:     "titulo",
    columnas:  ["titulo", "fuente_financiamiento", "ano_adjudicacion", "periodo_ejecucion", "rol_proyecto", "link_verificacion"],
    emptyForm: { titulo: "", fuente_financiamiento: "", ano_adjudicacion: "", periodo_ejecucion: "", rol_proyecto: "", link_verificacion: "" },
    campos: [
      { key: "titulo",                label: "Título*",                  col: "col-12",   required: true  },
      { key: "fuente_financiamiento", label: "Fuente financiamiento",    col: "col-md-6", required: false },
      { key: "ano_adjudicacion",      label: "Año adjudicación",         col: "col-md-3", required: false },
      { key: "periodo_ejecucion",     label: "Período ejecución",        col: "col-md-3", required: false },
      { key: "rol_proyecto",          label: "Rol",                      col: "col-md-4", required: false },
      { key: "link_verificacion",     label: "Respaldo (link)",          col: "col-12",   required: false, tipo: "respaldo" },
    ],
  },

  consultorias: {
    titulo:    "Consultorías",
    icono:     "bi-briefcase-fill",
    idKey:     "consultoria_id",
    campo:     "titulo",
    columnas:  ["titulo", "institucion_contratante", "ano_adjudicacion", "periodo_ejecucion", "objetivo", "link_verificacion"],
    emptyForm: { titulo: "", institucion_contratante: "", ano_adjudicacion: "", periodo_ejecucion: "", objetivo: "", link_verificacion: "" },
    campos: [
      { key: "titulo",                  label: "Título*",                  col: "col-12",   required: true  },
      { key: "institucion_contratante", label: "Institución contratante",  col: "col-md-6", required: false },
      { key: "ano_adjudicacion",        label: "Año adjudicación",         col: "col-md-3", required: false },
      { key: "periodo_ejecucion",       label: "Período ejecución",        col: "col-md-3", required: false },
      { key: "objetivo",                label: "Objetivo",                 col: "col-12",   required: false, tipo: "textarea" },
      { key: "link_verificacion",       label: "Respaldo (link)",          col: "col-12",   required: false, tipo: "respaldo" },
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
  if (key === "link_verificacion") return "Respaldo";
  if (key === "categoria_nombre")  return "Indexados";
  if (key === "ano_adjudicacion")  return "Año Adjud.";
  if (key === "ISSN")              return "ISSN";
  if (key === "autor_principal")   return "Autor Principal";
  if (key === "nombre_revista")    return "Revista";
  if (key === "titulo_articulo")   return "Título Artículo";
  if (key === "nombre_capitulo")   return "Nombre del Capítulo";
  if (key === "nombre_libro")      return "Nombre Libro";
  if (key === "autor_principal")   return "Autor/a Principal";
  if (key === "autores")           return "Autor(es)";
  if (key === "ano")               return "Año";
  if (key === "estado")            return "Estado";
  if (key === "inventores")        return "Inventor(es)";
  if (key === "nombre_patente")    return "Nombre Patente";
  if (key === "fecha_solicitud")   return "Fecha Solicitud";
  if (key === "fecha_publicacion") return "Fecha Publicación";
  if (key === "num_registro")      return "N° Registro";
  if (key === "rol_guia")          return "Rol";
  if (key === "titulo_tesis")      return "Título";
  if (key === "nombre_programa")   return "Programa";
  if (key === "fuente_financiamiento")  return "Fuente Financiamiento";
  if (key === "rol_proyecto")           return "Rol";
  if (key === "periodo_ejecucion")      return "Período";
  if (key === "institucion_contratante") return "Institución";
  if (key === "objetivo")               return "Objetivo";
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function EditarFicha() {
  const { usuarioId } = useParams();

  const [data, setData]                   = useState(null);
  const [academico, setAcademico]         = useState(null);
  const [categorias, setCategorias]       = useState([]);
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
    intervenciones: {
      create: (f) => createIntervencionParaAcademico(usuarioId, f),
      update: (id, f) => updateIntervencionParaAcademico(usuarioId, id, f),
      delete: (id) => deleteIntervencionParaAcademico(usuarioId, id),
    },
    consultorias: {
      create: (f) => createConsultoriaParaAcademico(usuarioId, f),
      update: (id, f) => updateConsultoriaParaAcademico(usuarioId, id, f),
      delete: (id) => deleteConsultoriaParaAcademico(usuarioId, id),
    },
  }), [usuarioId]);

  const modalTitle = useMemo(() => {
    if (!config) return "";
    return mode === "create"
      ? `Nueva entrada — ${config.titulo}`
      : `Editar — ${config.titulo}`;
  }, [mode, config]);

  const loadFicha = async () => {
    const [fichaRes, intervencionesRes, consultoriasRes] = await Promise.all([
      getFichaAcademica(usuarioId),
      listIntervencionesDeAcademico(usuarioId),
      fetch(`${import.meta.env.VITE_API_URL}/consultorias/academico/${usuarioId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }).then((r) => r.json()),
    ]);
    setData({
      ...fichaRes,
      intervenciones: intervencionesRes,
      consultorias:   consultoriasRes,
    });
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [fichaRes, academicosRes, categoriasRes, intervencionesRes, consultoriasRes] =
          await Promise.all([
            getFichaAcademica(usuarioId),
            getAcademicos(),
            getCategorias(),
            listIntervencionesDeAcademico(usuarioId),
            fetch(`${import.meta.env.VITE_API_URL}/consultorias/academico/${usuarioId}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }).then((r) => r.json()),
          ]);
        setData({
          ...fichaRes,
          intervenciones: intervencionesRes,
          consultorias:   consultoriasRes,
        });
        setCategorias(categoriasRes);
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
    const emptyForm = config?.emptyForm ?? {};
    // para publicaciones pre-seleccionar primera categoría
    if (seccionActiva === "publicaciones" && categorias.length > 0 && !emptyForm.categoria_id) {
      emptyForm.categoria_id = String(categorias[0].categoria_id);
    }
    setForm(emptyForm);
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
    if (!seccionActiva || !data) return [];
    switch (seccionActiva) {
      case "magister":        return data.tesis?.filter(t => t.nivel_programa === "MAGISTER") ?? [];
      case "doctorado":       return data.tesis?.filter(t => t.nivel_programa === "DOCTORADO") ?? [];
      case "publicaciones":   return data.publicaciones ?? [];
      case "libros":          return data.libros ?? [];
      case "capitulos":       return data.capitulos ?? [];
      case "investigaciones": return data.investigaciones ?? [];
      case "patentes":        return data.patentes ?? [];
      case "intervenciones":  return data.intervenciones ?? [];
      case "consultorias":    return data.consultorias ?? [];
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
                        <th className="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsSeccion().map((item, index) => (
                        <tr key={item[config.idKey] ?? index}>
                          <td style={{ color: "var(--muted)", width: "40px" }}>
                            {index + 1}
                          </td>
                          {config.columnas.map((col) => (
                            <td key={col}>
                              {col === "link_verificacion" ? (
                                  <a
                                    href={item[col] ? item[col] : "#"}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Ver
                                  </a>
                              ) : col === "fecha_solicitud" || col === "fecha_publicacion" ? (
                                item[col] ? new Date(item[col]).toISOString().split("T")[0] : "—"
                              ) : (
                                item[col] ?? "—"
                              )}
                            </td>
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
            {config.campos.map(({ key, label, col, placeholder, tipo }) => (
              <div className={`col-12 ${col}`} key={key}>
                {/* ── EstadoSelect para campos con tipo "estado" ── */}
                {tipo === "estado" ? (
                  <EstadoSelect
                    label={label}
                    value={form[key] ?? "Publicado"}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                ) : tipo === "respaldo" ? (
                  <RespaldoInput
                    label={label}
                    value={form[key] ?? ""}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                ) : tipo === "issn" ? (
                  <IssnInput
                    value={form[key] ?? ""}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                ) : tipo === "date" ? (
                  <div>
                    <label className="form-label" style={{ color: "var(--muted)" }}>{label}</label>
                    <input
                      type="date"
                      className="form-control input-dark"
                      value={form[key] ?? ""}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    />
                  </div>
                ) : tipo === "rol_guia" ? (
                  <div>
                    <label className="form-label" style={{ color: "var(--muted)" }}>{label}</label>
                    <select
                      className="form-select input-dark"
                      value={form[key] ?? "GUIA"}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    >
                      <option value="GUIA">Guía</option>
                      <option value="CO_GUIA">Co-Guía</option>
                    </select>
                  </div>
                ) : tipo === "tesis_dirigida" ? (
                  <div>
                    <label className="form-label" style={{ color: "var(--muted)" }}>{label}</label>
                    <select
                      className={`form-select input-dark${errors[key] ? " is-invalid" : ""}`}
                      value={form[key] ?? ""}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    >
                      <option value="" disabled>Seleccione...</option>
                      <option value="Si">Sí</option>
                      <option value="No">No</option>
                    </select>
                    {errors[key] && <div className="invalid-feedback">{errors[key]}</div>}
                  </div>
                ) : tipo === "categorias" ? (
                  <div>
                    <label className="form-label" style={{ color: "var(--muted)" }}>
                      {label}
                    </label>
                    <select
                      className={`form-select input-dark${errors[key] ? " is-invalid" : ""}`}
                      value={form[key] ?? ""}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    >
                      <option value="" disabled>Seleccione...</option>
                      {categorias.map((c) => (
                        <option key={c.categoria_id} value={String(c.categoria_id)}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                    {errors[key] && (
                      <div className="invalid-feedback">{errors[key]}</div>
                    )}
                  </div>
                ) : tipo === "textarea" ? (
                  <div>
                    <label className="form-label" style={{ color: "var(--muted)" }}>{label}</label>
                    <textarea
                      className={`form-control input-dark${errors[key] ? " is-invalid" : ""}`}
                      rows={3}
                      value={form[key] ?? ""}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder ?? ""}
                    />
                    {errors[key] && <div className="invalid-feedback">{errors[key]}</div>}
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            ))}
          </div>
        </FormModal>
      )}
    </div>
  );
}