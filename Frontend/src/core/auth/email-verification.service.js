import { fetcher } from "@/core/api/fetcher";

export const getEstadoCorreo = () => fetcher.get("/email-verification/estado");
export const registrarCorreo = (correo) => fetcher.post("/email-verification/registrar", { correo });
export const confirmarCodigo = (codigo) => fetcher.post("/email-verification/confirmar", { codigo });
export const reenviarCodigo = () => fetcher.post("/email-verification/reenviar", {});