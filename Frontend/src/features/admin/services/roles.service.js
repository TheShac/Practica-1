import { fetcher } from "@/core/api/fetcher";

export const getRoles             = ()              => fetcher.get("/users/roles");
export const createRol            = (nombre)        => fetcher.post("/users/roles", { nombre });
export const updateRol            = (id, nombre)    => fetcher.put(`/users/roles/${id}`, { nombre });
export const deleteRol            = (id)            => fetcher.delete(`/users/roles/${id}`);

export const getRolesAcademico    = ()                    => fetcher.get("/users/roles-academico");
export const createRolAcademico   = (tipo_academico)      => fetcher.post("/users/roles-academico", { tipo_academico });
export const updateRolAcademico   = (id, tipo_academico)  => fetcher.put(`/users/roles-academico/${id}`, { tipo_academico });
export const deleteRolAcademico   = (id)                  => fetcher.delete(`/users/roles-academico/${id}`);