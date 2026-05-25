import { fetcher } from "@/core/api/fetcher";

export const getPerfilAcademico    = (usuarioId)  => fetcher.get(`/users/academicos/${usuarioId}/perfil`);
export const updatePerfilAcademico = (id, data)   => fetcher.put(`/users/academicos/${id}/perfil`, data);