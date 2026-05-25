import { fetcher } from "@/core/api/fetcher";

export const getUsuarios        = ()                => fetcher.get("/users");
export const getUsuarioPerfil   = (id)              => fetcher.get(`/users/academicos/${id}/perfil`);
export const createUsuario      = (data)            => fetcher.post("/users", data);
export const updateUsuario      = (id, data)        => fetcher.put(`/users/${id}`, data);
export const updateUsuarioPerfil= (id, data)        => fetcher.put(`/users/academicos/${id}/perfil`, data);
export const updatePassword     = (id, password)    => fetcher.put(`/users/${id}/password`, { password });
export const deleteUsuario      = (id)              => fetcher.delete(`/users/${id}`);