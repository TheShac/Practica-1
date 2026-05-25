import { fetcher } from "@/core/api/fetcher";

export const listIntervencionesDeAcademico    = (usuarioId)           => fetcher.get(`/proyectos-intervencion/academicos/${usuarioId}/proyectos`);
export const createIntervencionParaAcademico  = (usuarioId, data)     => fetcher.post(`/proyectos-intervencion/academicos/${usuarioId}/proyectos`, data);
export const updateIntervencionParaAcademico  = (usuarioId, id, data) => fetcher.put(`/proyectos-intervencion/academicos/${usuarioId}/proyectos/${id}`, data);
export const deleteIntervencionParaAcademico  = (usuarioId, id)       => fetcher.delete(`/proyectos-intervencion/academicos/${usuarioId}/proyectos/${id}`);