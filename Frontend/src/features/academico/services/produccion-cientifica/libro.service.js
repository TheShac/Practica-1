import { fetcher } from "@/core/api/fetcher";

export const getMisLibros  = ()            => fetcher.get("/libros/mios");
export const createLibro   = (payload)     => fetcher.post("/libros", payload);
export const updateLibro   = (id, payload) => fetcher.put(`/libros/${id}`, payload);
export const deleteLibro   = (id)          => fetcher.delete(`/libros/${id}`);