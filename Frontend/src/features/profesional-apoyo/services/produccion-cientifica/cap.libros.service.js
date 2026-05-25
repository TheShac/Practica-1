import { fetcher } from "@/core/api/fetcher";

export const listCapLibrosDeAcademico    = (usuarioId)              => fetcher.get(`/cap-libro/academico/${usuarioId}`);
export const createCapLibroParaAcademico = (usuarioId, payload)     => fetcher.post(`/cap-libro/academico/${usuarioId}`, payload);
export const updateCapLibroParaAcademico = (usuarioId, id, payload) => fetcher.put(`/cap-libro/academico/${usuarioId}/${id}`, payload);
export const deleteCapLibroParaAcademico = (usuarioId, id)          => fetcher.delete(`/cap-libro/academico/${usuarioId}/${id}`);