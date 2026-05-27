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

export const reporteGeneralHandler       = handle((req) => getReporteGeneralService(req));
export const updateReporteGeneralHandler = handle((req) => updateReporteGeneralService(req));

// ── Promedios ──────────────────────────────────────────────────────────────

export const getPromediosHandler    = handle((req) => getPromediosService(req));
export const updatePromediosHandler = handle((req) => updatePromediosService(req));

// ── Excel — stream directo a res, no pasa por handle ──────────────────────

export async function exportReporteGeneralExcel(req, res) {
  try {
    const programa_id = parseInt(req.query.programa);
    if (!programa_id || (programa_id !== 1 && programa_id !== 2)) {
      return res.status(400).json({ message: 'programa debe ser 1 (MAGISTER) o 2 (DOCTORADO)' });
    }
 
    const wb    = await buildReporteGeneralExcel(programa_id);
    const label = programa_id === 1 ? 'magister' : 'doctorado';
    const anio  = new Date().getFullYear();
 
    res.setHeader('Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition',
      `attachment; filename=reporte_general_${label}_${anio}.xlsx`);
    await wb.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generando reporte Excel' });
  }
}