import { fetcher } from "@/core/api/fetcher";

export const enviarNotificacion        = (payload) => fetcher.post("/notificaciones", payload);
export const getNotificacionesEnviadas = ()        => fetcher.get("/notificaciones/enviadas");
export const eliminarNotificacion      = (id)      => fetcher.delete(`/notificaciones/${id}`);