const FILAS = [
  {
    label:      "Promedio de publicaciones WOS últimos 5 años",
    keyClaustro: "prom_wos_claustro",
    keyCuerpo:   "prom_wos_cuerpo",
  },
  {
    label:      "Promedio de publicaciones WOS, por académico, últimos 5 años",
    keyClaustro: "prom_wos_acad_claustro",
    keyCuerpo:   "prom_wos_acad_cuerpo",
  },
  {
    label:      "Promedio de Libros o capítulos de libros, últimos 5 años",
    keyClaustro: "prom_libros_claustro",
    keyCuerpo:   "prom_libros_cuerpo",
  },
  {
    label:      "Promedio de Proyectos FONDECYT, en calidad de IP, últimos 5 años",
    keyClaustro: "prom_fondecyt_claustro",
    keyCuerpo:   "prom_fondecyt_cuerpo",
  },
];

const ReporteTablaPromedios = ({ promedios, onChange }) => {
  const anioActual = new Date().getFullYear();
  const anioInicio = anioActual - 4;

  const handleChange = (key, value) => {
    const num = value === "" ? "" : Number(value);
    if (num !== "" && num < 0) return;
    onChange({ ...promedios, [key]: num });
  };

  return (
    <div className="mt-4">
      <div className="table-wrap">
        <div className="table-responsive">
          <table className="table table-dark table-dark-custom align-middle small text-center">
            <thead>
              <tr>
                <th className="text-start"></th>
                <th>Claustro</th>
                <th>Cuerpo Académico</th>
              </tr>
            </thead>
            <tbody>
              {FILAS.map((fila) => (
                <tr key={fila.keyClaustro}>
                  <td className="text-start">
                    {fila.label} ({anioInicio}-{anioActual})
                  </td>
                  <td>
                    <input
                      type="number"
                      className="text-center excel-input"
                      value={promedios[fila.keyClaustro] ?? 0}
                      min={0}
                      step={0.1}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => handleChange(fila.keyClaustro, e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="text-center excel-input"
                      value={promedios[fila.keyCuerpo] ?? 0}
                      min={0}
                      step={0.1}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => handleChange(fila.keyCuerpo, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReporteTablaPromedios;