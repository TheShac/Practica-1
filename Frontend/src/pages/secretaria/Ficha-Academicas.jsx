import { useEffect, useMemo, useState } from "react";
import { getAcademicos } from "../../services/api";
import FichaAcademicaModal from "../../components/FichaAcademicaModal.jsx";

const ITEMS_PER_PAGE = 15;

export default function FichaAcademicas() {
  const [academicos, setAcademicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [contratoFilter, setContratoFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  const contratosDisponibles = useMemo(() => {
    const tipos = academicos.map((a) => a.contrato).filter(Boolean);
    return [...new Set(tipos)];
  }, [academicos]);

  const filteredAcademicos = useMemo(() => {
    return academicos.filter((a) => {
      const fullName =
        `${a.primer_nombre} ${a.segundo_nombre || ""} ${a.primer_apellido} ${a.segundo_apellido || ""}`.toLowerCase();

      const email = a.correos?.toLowerCase() || "";
      const contrato = a.contrato?.toLowerCase() || "";
      const rut = a.rut?.toLowerCase() || "";
      const query = search.toLowerCase();

      const matchSearch =
        fullName.includes(query) ||
        email.includes(query) ||
        contrato.includes(query) ||
        rut.includes(query);

      const matchContrato = contratoFilter
        ? contrato === contratoFilter.toLowerCase()
        : true;

      return matchSearch && matchContrato;
    });
  }, [academicos, search, contratoFilter]);

  const totalPages = Math.ceil(filteredAcademicos.length / ITEMS_PER_PAGE);

  const paginatedAcademicos = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredAcademicos.slice(start, end);
  }, [filteredAcademicos, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, contratoFilter]);

  function changePage(page) {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  function openModal(academico) {
    setSelected(academico);
  }

  function closeModal() {
    setSelected(null);
  }
  
  return (
    <div>
      <h3 className="mb-3">Fichas Académicas</h3>

      <div className="panel-card">
        {/* HEADER */}
        <div className="mb-3">
          <div style={{ color: "var(--muted)" }}>
            Listado de académicos registrados
          </div>

          <div className="d-flex gap-3 mt-3 flex-wrap align-items-center">
            {/* BUSCADOR */}
            <div className="fa-search-box position-relative">
              <i
                className="bi bi-search"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 12,
                  transform: "translateY(-50%)",
                  color: "var(--muted)",
                }}
              />
              <input
                type="text"
                className="form-control input-dark"
                style={{ paddingLeft: 38 }}
                placeholder="Buscar por nombre, rut, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* FILTRO CONTRATO */}
            <select
              className="form-select input-dark"
              style={{ width: 220 }}
              value={contratoFilter}
              onChange={(e) => setContratoFilter(e.target.value)}
            >
              <option value="">Todos los contratos</option>
              {contratosDisponibles.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* CONTADOR */}
            <div style={{ color: "var(--muted)", fontSize: 14 }}>
              {filteredAcademicos.length} resultado(s)
            </div>
          </div>
        </div>

        {/* TABLA */}
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
                      <th>Contrato</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAcademicos.map((a) => (
                      <tr key={a.usuario_id}>
                        <td>{a.rut}</td>

                        <td>
                          {a.primer_nombre} {a.segundo_nombre || ""}{" "}
                          {a.primer_apellido} {a.segundo_apellido || ""}
                        </td>

                        <td>
                          {a.correos
                            ? a.correos.split("||").join(", ")
                            : "Sin correo"}
                        </td>

                        <td>
                          <span className="badge-status badge-aceptado">
                            {a.contrato || "Sin contrato"}
                          </span>
                        </td>

                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-light me-2"
                            onClick={() => openModal(a)}
                          >
                            <i className="bi bi-eye" />
                          </button>

                          <button className="btn btn-sm btn-outline-success">
                            <i className="bi bi-download" />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {paginatedAcademicos.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ color: "var(--muted)" }}>
                          Sin registros.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PAGINACIÓN */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4 gap-2 fa-pagination">
                <button
                  className="btn btn-sm btn-outline-light"
                  disabled={currentPage === 1}
                  onClick={() => changePage(currentPage - 1)}
                >
                  «
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`btn btn-sm ${
                      currentPage === i + 1
                        ? "btn-primary"
                        : "btn-outline-light"
                    }`}
                    onClick={() => changePage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  className="btn btn-sm btn-outline-light"
                  disabled={currentPage === totalPages}
                  onClick={() => changePage(currentPage + 1)}
                >
                  »
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL NUEVO */}
      <FichaAcademicaModal
        show={!!selected}
        academico={selected}
        onClose={closeModal}
      />
    </div>
  );
}
