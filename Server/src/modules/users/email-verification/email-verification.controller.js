import { EmailVerificationService } from "./email-verification.service.js";

export const EmailVerificationController = {
  async registrar(req, res) {
    try {
      const { correo } = req.body;
      if (!correo) {
        return res.status(400).json({ message: "El correo es obligatorio." });
      }
      const resultado = await EmailVerificationService.registrarCorreo(
        req.user.usuario_id,
        correo
      );
      return res.status(200).json(resultado);
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Error al registrar el correo." });
    }
  },

  async confirmar(req, res) {
    try {
      const { codigo } = req.body;
      if (!codigo) {
        return res.status(400).json({ message: "El código es obligatorio." });
      }
      const resultado = await EmailVerificationService.confirmarCodigo(
        req.user.usuario_id,
        codigo
      );
      return res.status(200).json(resultado);
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Error al confirmar el código." });
    }
  },

  async reenviar(req, res) {
    try {
      const resultado = await EmailVerificationService.reenviarCodigo(req.user.usuario_id);
      return res.status(200).json(resultado);
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Error al reenviar el código." });
    }
  },

  async estado(req, res) {
    try {
      const resultado = await EmailVerificationService.obtenerEstado(req.user.usuario_id);
      return res.status(200).json(resultado);
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Error al obtener el estado del correo." });
    }
  },

  async verificarManual(req, res) {
    try {
      const { usuarioId } = req.params;
      const resultado = await EmailVerificationService.verificarManualmente(Number(usuarioId));
      return res.status(200).json(resultado);
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Error al verificar el correo." });
    }
  },
};