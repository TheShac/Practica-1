import { fetcher } from "@/core/api/fetcher";

export const getDashboardCorreos = () => fetcher.get("/dashboard/correos");
export const getDashboardNotificaciones = () => fetcher.get("/dashboard/notificaciones");