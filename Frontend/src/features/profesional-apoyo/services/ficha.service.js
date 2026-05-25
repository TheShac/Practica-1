import { fetcher } from "@/core/api/fetcher";

export const downloadFichaExcel         = (usuarioId) => fetcher.get(`/ficha/${usuarioId}/export`);
export const downloadFichaExcelMagister = (usuarioId) => fetcher.get(`/ficha/${usuarioId}/export-magister`);

export const getFichaAcademica = (usuarioId) => fetcher.get(`/ficha/${usuarioId}`);
export const getAcademicos = () => fetcher.get("/users/academicos");