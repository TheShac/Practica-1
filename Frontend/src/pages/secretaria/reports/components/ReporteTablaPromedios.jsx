const ReporteTablaPromedios = ({ promedioWosClaustro, promedioWosCuerpo, promedioLibrosClaustro, promedioLibrosCuerpo }) => (
  <div className="mt-4">
    <div className="table-wrap">
      <div className="table-responsive">
        <table className="table table-dark table-dark-custom align-middle small text-center">
          <thead>
            <tr>
              <th></th>
              <th>Claustro</th>
              <th>Cuerpo Académico</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-start">Promedio de publicaciones WOS últimos 5 años</td>
              <td>{promedioWosClaustro}</td>
              <td>{promedioWosCuerpo}</td>
            </tr>
            <tr>
              <td className="text-start">Promedio de publicaciones WOS, por académico, últimos 5 años (2019-2023)</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr>
              <td className="text-start">Promedio de Libros o capítulos de libros, últimos 5 años (2019-2023)</td>
              <td>{promedioLibrosClaustro}</td>
              <td>{promedioLibrosCuerpo}</td>
            </tr>
            <tr>
              <td className="text-start">Promedio de Proyectos FONDECYT, en calidad de IP, últimos 5 años (2019-2023)</td>
              <td>0</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default ReporteTablaPromedios;