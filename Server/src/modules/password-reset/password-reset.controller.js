import { PasswordResetService } from "./password-reset.service.js";

export const PasswordResetController = {
  async solicitar(req, res) {
    try {
      const { rut } = req.body;
      const resultado = await PasswordResetService.solicitar(rut);
      return res.status(200).json(resultado);
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Error al solicitar la recuperación." });
    }
  },

  async confirmar(req, res) {
    try {
      const { token, nuevaPassword } = req.body;
      const resultado = await PasswordResetService.confirmar(token, nuevaPassword);
      return res.status(200).json(resultado);
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Error al cambiar la contraseña." });
    }
  },
};