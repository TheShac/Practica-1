import { fetcher } from "@/core/api/fetcher";

export const fetchInvestigaciones    = ()          => fetcher.get("/investigacion");
export const createInvestigacion     = (data)      => fetcher.post("/investigacion", data);
export const updateInvestigacion     = (id, data)  => fetcher.put(`/investigacion/${id}`, data);
export const deleteInvestigacion     = (id)        => fetcher.delete(`/investigacion/${id}`);