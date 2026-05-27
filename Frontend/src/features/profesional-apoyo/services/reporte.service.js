import { fetcher } from "@/core/api/fetcher";
 
export const getReporteGeneral           = (programa)                       => fetcher.get(`/profesional-apoyo/reporte-general?programa=${programa}`);
export const updateReporteGeneral        = (programa, reporte, wosGlobal)   => fetcher.put(`/profesional-apoyo/reporte-general?programa=${programa}`, { reporte, wosGlobal });
export const getReportePromedios         = (programa)                       => fetcher.get(`/profesional-apoyo/promedios?programa=${programa}`);
export const updateReportePromedios      = (programa, data)                 => fetcher.put(`/profesional-apoyo/promedios?programa=${programa}`, data);
export const downloadReporteGeneralExcel = (programa)                       => fetcher.get(`/profesional-apoyo/export-excel?programa=${programa}`);