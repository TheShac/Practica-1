import { useEffect, useMemo, useState } from "react";
import { getFichaAcademica } from "../services/ficha.service";

export default function FichaAcademicaModal({
  show,
  academico,
  onClose,
}) {
  const [ficha, setFicha] = useState(null);
  const [loading, setLoading] = useState(false);

  const nombreCompleto = useMemo(() => {
    if (!academico) return "";
    return `
      ${academico.primer_nombre}
      ${academico.segundo_nombre || ""}
      ${academico.primer_apellido}
      ${academico.segundo_apellido || ""}
    `;
  }, [academico]);

  useEffect(() => {
    if (!show || !academico) return;

    async function loadFicha() {
      try {
        setLoading(true);
        const data = await getFichaAcademica(
          academico.usuario_id
        );
        setFicha(data);
      } finally {
        setLoading(false);
      }
    }

    loadFicha();
  }, [show, academico]);

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  if (!show || !academico) return null;

  const tesis = ficha?.tesis || [];
  const publicaciones = ficha?.publicaciones || [];
  const libros = ficha?.libros || [];
  const capitulos = ficha?.capitulos || [];
  const investigaciones = ficha?.investigaciones || [];
  const patentes = ficha?.patentes || [];

  const magisterGuia = tesis.filter(
    t => t.nivel_programa === "MAGISTER" && t.rol_guia === "GUIA"
  );

  const magisterCoGuia = tesis.filter(
    t => t.nivel_programa === "MAGISTER" && t.rol_guia === "CO_GUIA"
  );

  const doctoradoGuia = tesis.filter(
    t => t.nivel_programa === "DOCTORADO" && t.rol_guia === "GUIA"
  );

  const doctoradoCoGuia = tesis.filter(
    t => t.nivel_programa === "DOCTORADO" && t.rol_guia === "CO_GUIA"
  );

  const wos = publicaciones.filter(p => p.categoria === "WoS");
  const scopus = publicaciones.filter(p => p.categoria === "SCOPUS");
  const scielo = publicaciones.filter(p => p.categoria === "SCIELO");
  const otrasIndexadas = publicaciones.filter(
    p =>
      p.categoria !== "WoS" &&
      p.categoria !== "SCOPUS" &&
      p.categoria !== "SCIELO"
  );

  return (
    <div className="fa-modal-overlay" onClick={onClose}>
      <div
        className="fa-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="fa-modal-header">
          <h4 className="fa-modal-title">
            Ficha Académica: {nombreCompleto}
          </h4>
          <button type="button" className="btn-close btn-close-white" onClick={onClose}/>
        </div>

        <div className="fa-info-box">
          <Info label="Nombre Académico/a" value={nombreCompleto} />
          <Info label="RUT" value={academico.rut} />
          <Info label="Correo Institucional" value={academico.correo} />
          <Info label="Tipo de Vinculo" value={academico.contrato} />
          <Info label="Línea(s) de investigación" value={academico.lineas_investigacion} />
        </div>

        {loading ? (
          <div className="fa-section">Cargando información...</div>
        ) : (
          <>
            <Section title="Tesis de magíster dirigidas en los últimos 5 años (finalizadas)">
              <SubBlock subtitle="Como guía de tesis" items={magisterGuia} />
              <SubBlock subtitle="Como co-guía de tesis" items={magisterCoGuia} />
            </Section>

            <Section title="Tesis de doctorado dirigidas en los últimos 5 años (finalizadas)">
              <SubBlock subtitle="Como guía de tesis" items={doctoradoGuia} />
              <SubBlock subtitle="Como co-guía de tesis" items={doctoradoCoGuia} />
            </Section>

            <Section title="Listado de publicaciones en los últimos 5 años">
              <SubBlock subtitle="Publicaciones indexadas WoS" items={wos} field="titulo_articulo" />
              <SubBlock subtitle="Publicaciones indexadas SCOPUS" items={scopus} field="titulo_articulo" />
              <SubBlock subtitle="Publicaciones indexadas SCIELO" items={scielo} field="titulo_articulo" />
              <SubBlock subtitle="Otras publicaciones indexadas (identificar tipo de indexación: LATINDEX u otra)" items={otrasIndexadas} field="titulo_articulo" />
              <SubBlock subtitle="Publicaciones no indexadas LIBRO" items={libros} field="nombre_libro" />
              <SubBlock subtitle="Publicaciones no indexadas CAPÍTULOS DE LIBRO" items={capitulos} field="nombre_capitulo" />
              <SubBlock subtitle="Patentes" items={patentes} field="nombre_patente" />
            </Section>

            <Section title="Listado de proyectos de investigación, últimos 5 años">
              {investigaciones.length === 0 ? (
                <div className="fa-empty">Sin registros.</div>
              ) : (
                investigaciones.map((i, index) => (
                  <div
                    key={index}
                    className="fa-empty"
                    style={{ marginBottom: "15px" }}
                  >
                    <strong>{i.titulo}</strong>
                    <div>{i.ano_adjudicacion}</div>
                    <div>{i.rol_proyecto}</div>
                  </div>
                ))
              )}
            </Section>
          </>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <label>{label}</label>
      <p>{value || "No definido"}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="fa-section" style={{ marginBottom: "45px" }}>
      <h5>{title}</h5>
      <div style={{ marginTop: "20px" }}>
        {children}
      </div>
    </div>
  );
}

function SubBlock({ 
  items = [], 
  field = "titulo_tesis", 
  subtitle 
}) {
  return (
    <div style={{ marginBottom: "25px" }}>
      {subtitle && (
        <h6 style={{ marginBottom: "10px", fontWeight: "600" }}>
          {subtitle}
        </h6>
      )}

      {items.length === 0 ? (
        <div className="fa-empty">Sin registros.</div>
      ) : (
        items.map((item, index) => (
          <div
            key={index}
            className="fa-empty"
            style={{ marginBottom: "15px" }}
          >
            <strong>{item[field]}</strong>
            {item.autor && <div>Autor: {item.autor}</div>}
            {item.ano && <div>Año: {item.ano}</div>}
            {item.estado && <div>Estado: {item.estado}</div>}
          </div>
        ))
      )}
    </div>
  );
}
