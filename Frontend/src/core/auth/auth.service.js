import { fetcher } from "@/core/api/fetcher";

export const loginRequest = ({ rut, password }) => fetcher.post("/auth/login", { rut, password });
export const logoutRequest = ()                 => fetcher.post("/auth/logout", {});
export const googleLoginUrl = ()                => `${import.meta.env.VITE_API_URL}/auth/google`;
export const meRequest = ()                     => fetcher.get("/auth/me");