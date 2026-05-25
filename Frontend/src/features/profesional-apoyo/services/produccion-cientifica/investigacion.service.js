import { fetcher } from "@/core/api/fetcher";

export const listInvestigacionesDeAcademico    = (usuarioId)              => fetcher.get(`/investigacion/academico/${usuarioId}`);
export const createInvestigacionParaAcademico  = (usuarioId, payload)     => fetcher.post(`/investigacion/academico/${usuarioId}`, payload);
export const updateInvestigacionParaAcademico  = (usuarioId, id, payload) => fetcher.put(`/investigacion/academico/${usuarioId}/${id}`, payload);
export const deleteInvestigacionParaAcademico  = (usuarioId, id)          => fetcher.delete(`/investigacion/academico/${usuarioId}/${id}`);