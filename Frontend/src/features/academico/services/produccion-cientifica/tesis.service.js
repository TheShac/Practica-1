import { fetcher } from "@/core/api/fetcher";

export const fetchTesis    = (nivel)      => fetcher.get(`/tesis/${nivel}`);
export const createTesis   = (data)       => fetcher.post("/tesis", data);
export const updateTesis   = (id, data)   => fetcher.put(`/tesis/${id}`, data);
export const deleteTesis   = (id)         => fetcher.delete(`/tesis/${id}`);