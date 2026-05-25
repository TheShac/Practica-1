import { fetcher } from "@/core/api/fetcher";

export const getCategorias = () => fetcher.get("/categorias");