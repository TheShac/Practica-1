import React, { useEffect, useMemo, useState } from "react";
import { getReporteGeneral, updateReporteGeneral, downloadReporteGeneralExcel } from "../../../services/reporteGeneral.service";
import ReporteSeccionGrupo from "./components/ReporteSeccionGrupo";
import ReporteTablaPromedios from "./components/ReporteTablaPromedios";
import BtnNuevo from "@/components/ui/buttons/BtnCreate.jsx";

const FIELDS_DEFAULT = {
  total_wos_scopus_5_anios: 0, total_scielo_5_anios: 0, otros_articulos: 0,
  libros_area: 0, libros_otro: 0, cap_area: 0, cap_otro: 0,
  edicion_area: 0, edicion_otro: 0, proyectos_fondecyt: 0, otros_proyectos: 0,
};

const calcularTotales = (lista) => ({
  total_wos_scopus:      lista.reduce((a, b) => a + b.total_wos_scopus_5_anios, 0),
  total_scielo:          lista.reduce((a, b) => a + b.total_scielo_5_anios, 0),
  otros_articulos:       lista.reduce((a, b) => a + b.otros_articulos, 0),
  libros_area:           lista.reduce((a, b) => a + b.libros_area, 0),
  libros_otro:           lista.reduce((a, b) => a + b.libros_otro, 0),
  cap_area:              lista.reduce((a, b) => a + b.cap_area, 0),
  cap_otro:              lista.reduce((a, b) => a + b.cap_otro, 0),
  edicion_area:          lista.reduce((a, b) => a + b.edicion_area, 0),
  edicion_otro:          lista.reduce((a, b) => a + b.edicion_otro, 0),
  proyectos_fondecyt:    lista.reduce((a, b) => a + b.proyectos_fondecyt, 0),
  otros_proyectos:       lista.reduce((a, b) => a + b.otros_proyectos, 0),
});

const totalLibros = (t) => t.libros_area + t.libros_otro + t.cap_area + t.cap_otro;

export default function ReportesSecretaria() {
  const [data, setData]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [wosClaustro, setWosClaustro] = useState(0);
  const [wosColaborador, setWosColaborador] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getReporteGeneral();
        setData(result.map(item => ({ ...FIELDS_DEFAULT, ...item })));

        setWosClaustro(result.find(r => r.tipo_academico === "Claustro")?.total_wos_global || 0);
        setWosColaborador(result.find(r => r.tipo_academico === "Colaborador")?.total_wos_global || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const claustro     = useMemo(() => data.filter(a => a.tipo_academico === "Claustro"), [data]);
  const colaboradores = useMemo(() => data.filter(a => a.tipo_academico === "Colaborador"), [data]);

  const totalClaustro      = calcularTotales(claustro);
  const totalColaboradores = calcularTotales(colaboradores);

  const promedioWosClaustro  = claustro.length > 0 ? (wosClaustro / claustro.length).toFixed(1) : 0;
  const promedioWosCuerpo    = data.length > 0 ? ((wosClaustro + wosColaborador) / data.length).toFixed(1) : 0;
  const promedioLibrosClaustro = claustro.length > 0 ? (totalLibros(totalClaustro) / claustro.length).toFixed(1) : 0;
  const promedioLibrosCuerpo   = data.length > 0 ? ((totalLibros(totalClaustro) + totalLibros(totalColaboradores)) / data.length).toFixed(1) : 0;

  const handleChange = (id, field, value) => {
    const newValue = value === "" ? "" : Number(value);
    if (newValue < 0) return;
    setData(prev => prev.map(item => item.usuario_id === id ? { ...item, [field]: newValue } : item));
  };

  const handleGuardar = async () => {
    try {
      await updateReporteGeneral(data, { Claustro: wosClaustro, Colaborador: wosColaborador });
      alert("Reporte guardado correctamente");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDescargarExcel = async () => {
    try {
      const blob = await downloadReporteGeneralExcel();
      const url  = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href     = url;
      link.download = `reporte_general_${new Date().getFullYear()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error al descargar el reporte");
    }
  };

  const anioActual = new Date().getFullYear();
  const anioInicio = anioActual - 4;

  return (
    <div>
      <h3 className="mb-3">Reporte General Académico</h3>
      <div className="panel-card">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-outline-success btn-sm" onClick={handleDescargarExcel}>
            <i className="bi bi-file-earmark-excel me-2" />
            Descargar Excel
          </button>
          <BtnNuevo label="Guardar Cambios" onClick={handleGuardar} disabled={loading} />
        </div>

        {loading && <div style={{ color: "var(--muted)" }}>Cargando...</div>}
        {error   && <div className="text-danger">{error}</div>}

        {!loading && !error && (
          <div className="table-wrap">
            <div className="table-responsive">
              <table className="table table-dark table-dark-custom align-middle text-center fa-table small">
                <thead>
                  <tr>
                    <th style={{ minWidth: 160, verticalAlign: "middle" }}>Nombre Académico</th>
                    <th style={{ minWidth: 80, verticalAlign: "middle" }}>Año ingreso al programa</th>
                    <th style={{ minWidth: 120, verticalAlign: "middle" }}>Total publ. WoS/SCOPUS (1)</th>
                    <th style={{ minWidth: 120, verticalAlign: "middle" }}>Artículos Scielo/Latindex/ERIH</th>
                    <th style={{ minWidth: 100, verticalAlign: "middle" }}>Otros artículos</th>
                    <th style={{ minWidth: 180, verticalAlign: "middle" }}>Libros en editorial de relevancia en el área, referato externo y comité editorial</th>
                    <th style={{ minWidth: 140, verticalAlign: "middle" }}>Libro en otra editorial</th>
                    <th style={{ minWidth: 180, verticalAlign: "middle" }}>Capitulo de libro en editorial de relevancia en el área, referato externo y comité editorial</th>
                    <th style={{ minWidth: 140, verticalAlign: "middle" }}>Capítulo de libro en otra editorial</th>
                    <th style={{ minWidth: 200, verticalAlign: "middle" }}>Edición crítica y traducción anotada de un libro en editorial de relevancia en el área, referato externo y comité editorial</th>
                    <th style={{ minWidth: 160, verticalAlign: "middle" }}>Edición crítica y traducción anotada de un libro en otra editorial</th>
                    <th style={{ minWidth: 200, verticalAlign: "middle" }}>Proyectos FONDECYT, FONDEF, FONDAP, BASALES, CORFO, ANILLO, FONIS, FONIDE o Instituto Milenio como investigador responsable (2)</th>
                    <th style={{ minWidth: 180, verticalAlign: "middle" }}>Otros proyectos con: <br/>1) evaluación externa por pares. <br/>2) Financiamiento externo. <br/>3) investigación de carácter claramente disciplinar</th>
                  </tr>
                </thead>
                <tbody>
                  <ReporteSeccionGrupo
                    titulo="CLAUSTRO"
                    estiloHeader={{ background: "rgba(218,161,54,.15)", color: "var(--gold)" }}
                    rows={claustro}
                    totales={totalClaustro}
                    wos={wosClaustro}
                    onWosChange={setWosClaustro}
                    onCellChange={handleChange}
                  />
                  <ReporteSeccionGrupo
                    titulo="COLABORADORES"
                    estiloHeader={{ background: "rgba(42,64,106,.35)", color: "#ffffff" }}
                    rows={colaboradores}
                    totales={totalColaboradores}
                    wos={wosColaborador}
                    onWosChange={setWosColaborador}
                    onCellChange={handleChange}
                  />
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-3" style={{ color: "var(--muted)", fontSize: 13 }}>
          <div>(1) Sólo se registran artículos como primer autor.</div>
          <div>(2) Se registran los proyectos obtenidos desde {anioInicio}, sin considerar los proyectos en curso.</div>
        </div>

        <ReporteTablaPromedios
          promedioWosClaustro={promedioWosClaustro}
          promedioWosCuerpo={promedioWosCuerpo}
          promedioLibrosClaustro={promedioLibrosClaustro}
          promedioLibrosCuerpo={promedioLibrosCuerpo}
        />

      </div>
    </div>
  );
}