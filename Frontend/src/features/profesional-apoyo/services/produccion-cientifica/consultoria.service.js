import { fetcher } from "@/core/api/fetcher";

export const listConsultoriasDeAcademico    = (usuarioId)              => fetcher.get(`/consultorias/academico/${usuarioId}`);
export const createConsultoriaParaAcademico = (usuarioId, payload)     => fetcher.post(`/consultorias/academico/${usuarioId}`, payload);
export const updateConsultoriaParaAcademico = (usuarioId, id, payload) => fetcher.put(`/consultorias/academico/${usuarioId}/${id}`, payload);
export const deleteConsultoriaParaAcademico = (usuarioId, id)          => fetcher.delete(`/consultorias/academico/${usuarioId}/${id}`);