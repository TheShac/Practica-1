import { fetcher } from "@/core/api/fetcher";

export const loginRequest = ({ rut, password }) => fetcher.post("/auth/login", { rut, password });