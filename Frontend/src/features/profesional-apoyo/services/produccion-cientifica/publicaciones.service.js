import { fetcher } from "@/core/api/fetcher";

export const listPublicacionesDeAcademico    = (usuarioId)              => fetcher.get(`/publicaciones/academico/${usuarioId}`);
export const createPublicacionParaAcademico  = (usuarioId, payload)     => fetcher.post(`/publicaciones/academico/${usuarioId}`, payload);
export const updatePublicacionParaAcademico  = (usuarioId, id, payload) => fetcher.put(`/publicaciones/academico/${usuarioId}/${id}`, payload);
export const deletePublicacionParaAcademico  = (usuarioId, id)          => fetcher.delete(`/publicaciones/academico/${usuarioId}/${id}`);