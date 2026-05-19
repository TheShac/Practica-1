import {
  getReporteGeneralService, updateReporteGeneralService,
  getPromediosService, updatePromediosService,
  buildReporteGeneralExcel,
} from './reporte.service.js';

const handle = (fn) => async (req, res) => {
  try {
    res.json(await fn(req));
  } catch (err) {
    console.error(err);
    res.status(err.status ?? 500).json({ message: err.message });
  }
};

// ── Reporte general ────────────────────────────────────────────────────────

export const reporteGeneralHandler       = handle(() => getReporteGeneralService());
export const updateReporteGeneralHandler = handle((req) => updateReporteGeneralService(req.body));

// ── Promedios ──────────────────────────────────────────────────────────────

export const getPromediosHandler    = handle(() => getPromediosService());
export const updatePromediosHandler = handle((req) => updatePromediosService(req.body));

// ── Excel — stream directo a res, no pasa por handle ──────────────────────

export async function exportReporteGeneralExcel(req, res) {
  try {
    const wb = await buildReporteGeneralExcel();
    const anio = new Date().getFullYear();
    res.setHeader('Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition',
      `attachment; filename=reporte_general_${anio}.xlsx`);
    await wb.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generando reporte Excel' });
  }
}