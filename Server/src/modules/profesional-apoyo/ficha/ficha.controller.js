import {
  getFichaAcademicaService,
  buildFichaExcel,
  buildFichaMagisterExcel,
} from './ficha.service.js';

const handle = (fn) => async (req, res) => {
  try {
    res.json(await fn(req));
  } catch (err) {
    console.error(err);
    res.status(err.status ?? 500).json({ message: err.message });
  }
};

export const getFichaAcademica = handle((req) =>
  getFichaAcademicaService(req.params.usuarioId)
);

// Excel — stream directo, no pasa por handle
export async function exportFichaAcademicaExcel(req, res) {
  try {
    const wb = await buildFichaExcel(req.params.usuarioId);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=ficha_${req.params.usuarioId}.xlsx`);
    await wb.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(err.status ?? 500).json({ message: err.message });
  }
}

export async function exportFichaAcademicaMagisterExcel(req, res) {
  try {
    const wb = await buildFichaMagisterExcel(req.params.usuarioId);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=ficha_magister_${req.params.usuarioId}.xlsx`);
    await wb.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(err.status ?? 500).json({ message: err.message });
  }
}