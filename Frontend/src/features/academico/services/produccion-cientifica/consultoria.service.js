import { fetcher } from "@/core/api/fetcher";

export const getMisConsultorias  = ()          => fetcher.get("/consultorias");
export const createConsultoria   = (payload)   => fetcher.post("/consultorias", payload);
export const updateConsultoria   = (id, data)  => fetcher.put(`/consultorias/${id}`, data);
export const deleteConsultoria   = (id)        => fetcher.delete(`/consultorias/${id}`);