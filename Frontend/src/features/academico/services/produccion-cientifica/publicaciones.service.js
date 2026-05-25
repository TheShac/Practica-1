import { fetcher } from "@/core/api/fetcher";

export const getCategorias        = ()           => fetcher.get("/categorias");
export const getMisPublicaciones  = ()           => fetcher.get("/publicaciones/mias");
export const createPublicacion    = (payload)    => fetcher.post("/publicaciones", payload);
export const updatePublicacion    = (id, payload)=> fetcher.put(`/publicaciones/${id}`, payload);
export const deletePublicacion    = (id)         => fetcher.delete(`/publicaciones/${id}`);