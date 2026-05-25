import { fetcher } from "@/core/api/fetcher";

export const listPatentesDeAcademico    = (usuarioId)              => fetcher.get(`/patente/academico/${usuarioId}`);
export const createPatenteParaAcademico = (usuarioId, payload)     => fetcher.post(`/patente/academico/${usuarioId}`, payload);
export const updatePatenteParaAcademico = (usuarioId, id, payload) => fetcher.put(`/patente/academico/${usuarioId}/${id}`, payload);
export const deletePatenteParaAcademico = (usuarioId, id)          => fetcher.delete(`/patente/academico/${usuarioId}/${id}`);