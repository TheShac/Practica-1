import { fetcher } from "@/core/api/fetcher";

export const getUltimasActualizaciones = () => fetcher.get("/home-profesional/actualizaciones");