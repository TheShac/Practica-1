import { fetcher } from "@/core/api/fetcher";

export const listLibrosDeAcademico    = (usuarioId)           => fetcher.get(`/libros/academico/${usuarioId}`);
export const createLibroParaAcademico = (usuarioId, payload)      => fetcher.post(`/libros/academico/${usuarioId}`, payload);
export const updateLibroParaAcademico = (usuarioId, id, payload)  => fetcher.put(`/libros/academico/${usuarioId}/${id}`, payload);
export const deleteLibroParaAcademico = (usuarioId, id)           => fetcher.delete(`/libros/academico/${usuarioId}/${id}`);