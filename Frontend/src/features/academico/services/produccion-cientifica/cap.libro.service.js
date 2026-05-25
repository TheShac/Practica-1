import { fetcher } from "@/core/api/fetcher";

export const getMisCapLibros  = ()            => fetcher.get("/cap-libro/mios");
export const createCapLibro   = (payload)     => fetcher.post("/cap-libro", payload);
export const updateCapLibro   = (id, payload) => fetcher.put(`/cap-libro/${id}`, payload);
export const deleteCapLibro   = (id)          => fetcher.delete(`/cap-libro/${id}`);