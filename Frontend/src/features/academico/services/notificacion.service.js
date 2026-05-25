import { fetcher } from "@/core/api/fetcher";

export const getMisNotificaciones = ()             => fetcher.get("/notificaciones/mis");
export const marcarLeida          = (id, es_global)=> fetcher.put(`/notificaciones/${id}/leida`, { es_global });
export const getCountNoLeidas     = ()             => fetcher.get("/notificaciones/no-leidas");