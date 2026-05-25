import { fetcher } from "@/core/api/fetcher";

export const listTesisDeAcademico    = (usuarioId)              => fetcher.get(`/tesis/academico/${usuarioId}`);
export const createTesisParaAcademico = (usuarioId, payload)    => fetcher.post(`/tesis/academico/${usuarioId}`, payload);
export const updateTesisParaAcademico = (usuarioId, id, payload)=> fetcher.put(`/tesis/academico/${usuarioId}/${id}`, payload);
export const deleteTesisParaAcademico = (usuarioId, id)         => fetcher.delete(`/tesis/academico/${usuarioId}/${id}`);