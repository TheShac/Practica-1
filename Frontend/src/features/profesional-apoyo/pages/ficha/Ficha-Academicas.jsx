import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAcademicos,
  downloadFichaExcel,
  downloadFichaExcelMagister,
} from "@/features/profesional-apoyo/services/ficha.service.js";
import FichaAcademicaModal from "@/features/profesional-apoyo/components/fichaModal/FichaAcademicaModal.jsx";

const ITEMS_PER_PAGE = 15;

// programas = [{ programa, tipo_academico }, ...]
function ProgramaBadges({ programas = [] }) {
  if (!programas.length) return <span style={{ color: "var(--muted)" }}>Sin programa</span>;
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

export default function FichaAcademicas() {
  const [academicos, setAcademicos]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [search, setSearch]               = useState("");
  const [programaFilter, setProgramaFilter] = useState("");
  const [tipoFilter, setTipoFilter]       = useState("");
  const [selected, setSelected]           = useState(null);
  const [currentPage, setCurrentPage]     = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAcademicos();
        setAcademicos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Opciones únicas de programa y tipo para los filtros
  const programasDisponibles = useMemo(() => {
    const set = new Set();
    academicos.forEach(a => (a.programas || []).forEach(p => set.add(p.programa)));
    return [...set];
  }, [academicos]);

  const tiposDisponibles = useMemo(() => {
    const set = new Set();
    academicos.forEach(a => (a.programas || []).forEach(p => set.add(p.tipo_academico)));
    return [...set];
  }, [academicos]);

  const filteredAcademicos = useMemo(() => {
    return academicos.filter((a) => {
      const fullName = `${a.primer_nombre} ${a.segundo_nombre || ""} ${a.primer_apellido} ${a.segundo_apellido || ""}`.toLowerCase();
      const email    = a.correos?.toLowerCase() || "";
      const rut      = a.rut?.toLowerCase() || "";
      const query    = search.toLowerCase();

      const matchSearch = fullName.includes(query) || email.includes(query) || rut.includes(query);

      const matchPrograma = programaFilter
        ? (a.programas || []).some(p => p.programa === programaFilter)
        : true;

      const matchTipo = tipoFilter
        ? (a.programas || []).some(p => p.tipo_academico === tipoFilter)
        : true;

      return matchSearch && matchPrograma && matchTipo;
    });
  }, [academicos, search, programaFilter, tipoFilter]);

  const totalPages = Math.ceil(filteredAcademicos.length / ITEMS_PER_PAGE);

  const paginatedAcademicos = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAcademicos.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAcademicos, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [search, programaFilter, tipoFilter]);

  function changePage(page) {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  }

  async function handleDownload(usuarioId) {
    try {
      const blob = await downloadFichaExcel(usuarioId);
      const url  = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = `ficha_doctorado_${usuarioId}.xlsx`;
      document.body.appendChild(link); link.click();
      link.remove(); window.URL.revokeObjectURL(url);
    } catch {
      alert("Error al descargar ficha académica");
    }
  }

  async function handleDownloadM(usuarioId) {
    try {
      const blob = await downloadFichaExcelMagister(usuarioId);
      const url  = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = `ficha_magister_${usuarioId}.xlsx`;
      document.body.appendChild(link); link.click();
      link.remove(); window.URL.revokeObjectURL(url);
    } catch {
      alert("Error al descargar ficha magister");
    }
  }

  return (
    <div>
      <h3 className="mb-3 perfil-title">Fichas Académicas</h3>

      <div className="panel-card">
        <div className="mb-3">
          <div style={{ color: "var(--muted)" }}>Listado de académicos registrados</div>

          <div className="d-flex gap-3 mt-3 flex-wrap align-items-center">
            {/* BUSCADOR */}
            <div className="fa-search-box position-relative">
              <i className="bi bi-search" style={{ position: "absolute", top: "50%", left: 12, transform: "translateY(-50%)", color: "var(--muted)" }} />
              <input
                type="text"
                className="form-control input-dark"
                style={{ paddingLeft: 38 }}
                placeholder="Buscar por nombre, rut, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* FILTRO PROGRAMA */}
            <select
              className="form-select input-dark"
              style={{ width: 180 }}
              value={programaFilter}
              onChange={(e) => setProgramaFilter(e.target.value)}
            >
              <option value="">Todos los programas</option>
              {programasDisponibles.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            {/* FILTRO TIPO */}
            <select
              className="form-select input-dark"
              style={{ width: 180 }}
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              {tiposDisponibles.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <div style={{ color: "var(--muted)", fontSize: 14 }}>
              {filteredAcademicos.length} resultado(s)
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ color: "var(--muted)" }}>Cargando...</div>
        ) : error ? (
          <div className="text-danger">{error}</div>
        ) : (
          <>
            <div className="table-wrap">
              <div className="table-responsive">
                <table className="table table-dark table-dark-custom align-middle fa-table">
                  <thead>
                    <tr>
                      <th>RUT</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Programa / Tipo</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAcademicos.map((a) => (
                      <tr key={a.usuario_id}>
                        <td>{a.rut}</td>
                        <td>{a.primer_nombre} {a.segundo_nombre || ""} {a.primer_apellido} {a.segundo_apellido || ""}</td>
                        <td>{a.correos ? a.correos.split("||").join(", ") : "Sin correo"}</td>
                        <td><ProgramaBadges programas={a.programas || []} /></td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm me-2"
                            style={{ borderColor: "#f97316", color: "#f97316" }}
                            onClick={() => navigate(`/secretaria/ficha/${a.usuario_id}/editar`)}
                          >
                            <i className="bi bi-pencil" />
                          </button>

                          <button
                            className="btn btn-sm btn-outline-light me-2"
                            onClick={() => setSelected(a)}
                          >
                            <i className="bi bi-eye" />
                          </button>

                          <button
                            className="btn btn-sm me-2"
                            style={{ borderColor: "#0ea5e9", color: "#0ea5e9" }}
                            onClick={() => handleDownload(a.usuario_id)}
                            title="Descargar ficha Doctorado"
                          >
                            <i className="bi bi-download me-1" />
                            <span style={{ fontWeight: 700, fontSize: 14 }}>D</span>
                          </button>

                          <button
                            className="btn btn-sm"
                            style={{ borderColor: "#eab308", color: "#eab308" }}
                            onClick={() => handleDownloadM(a.usuario_id)}
                            title="Descargar ficha Magíster"
                          >
                            <i className="bi bi-download me-1" />
                            <span style={{ fontWeight: 700, fontSize: 14 }}>M</span>
                          </button>
                        </td>
                      </tr>
                    ))}

                    {paginatedAcademicos.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ color: "var(--muted)" }}>Sin registros.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4 gap-2 fa-pagination">
                <button className="btn btn-sm btn-outline-light" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>«</button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`btn btn-sm ${currentPage === i + 1 ? "btn-primary" : "btn-outline-light"}`}
                    onClick={() => changePage(i + 1)}
                  >{i + 1}</button>
                ))}
                <button className="btn btn-sm btn-outline-light" disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>»</button>
              </div>
            )}
          </>
        )}
      </div>

      <FichaAcademicaModal
        show={!!selected}
        academico={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}