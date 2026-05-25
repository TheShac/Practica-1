import { fetcher } from "@/core/api/fetcher";

export const getMisIntervenciones  = ()          => fetcher.get("/proyectos-intervencion/mis-proyectos");
export const createIntervencion    = (data)      => fetcher.post("/proyectos-intervencion/mis-proyectos", data);
export const updateIntervencion    = (id, data)  => fetcher.put(`/proyectos-intervencion/mis-proyectos/${id}`, data);
export const deleteIntervencion    = (id)        => fetcher.delete(`/proyectos-intervencion/mis-proyectos/${id}`);