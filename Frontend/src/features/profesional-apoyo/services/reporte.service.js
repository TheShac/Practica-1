import { fetcher } from "@/core/api/fetcher";

export const getReporteGeneral         = ()                    => fetcher.get("/profesional-apoyo/reporte-general");
export const updateReporteGeneral      = (reporte, wosGlobal)  => fetcher.put("/profesional-apoyo/reporte-general", { reporte, wosGlobal });
export const getReportePromedios       = ()                    => fetcher.get("/profesional-apoyo/promedios");
export const updateReportePromedios    = (data)                => fetcher.put("/profesional-apoyo/promedios", data);
export const downloadReporteGeneralExcel = ()                  => fetcher.get("/profesional-apoyo/export-excel");