import { fetcher } from "@/core/api/fetcher";

export const getConfiguracion = () => fetcher.get("/configuracion");
export const actualizarConfiguracion = (cambios) => fetcher.put("/configuracion", cambios);
export const getDominios = () => fetcher.get("/configuracion/dominios");
export const agregarDominio = (dominio) => fetcher.post("/configuracion/dominios", { dominio });
export const eliminarDominio = (id) => fetcher.delete(`/configuracion/dominios/${id}`);