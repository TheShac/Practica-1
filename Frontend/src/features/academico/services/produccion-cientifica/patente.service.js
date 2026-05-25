import { fetcher } from "@/core/api/fetcher";

export const fetchPatentes   = ()          => fetcher.get("/patente");
export const createPatente   = (data)      => fetcher.post("/patente", data);
export const updatePatente   = (id, data)  => fetcher.put(`/patente/${id}`, data);
export const deletePatente   = (id)        => fetcher.delete(`/patente/${id}`);