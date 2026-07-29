import bcrypt from "bcrypt";
import { randomBytes, createHash } from "crypto";
import { pool } from "#src/config/db.js";
import { findUserByRut } from "#src/modules/users/auth/auth.model.js";
import { EmailVerificationModel } from "#src/modules/users/email-verification/email-verification.model.js";
import { PasswordResetModel } from "./password-reset.model.js";
import { enviarCorreoRecuperacion } from "#src/modules/email/email.service.js";

const TOKEN_BYTES = 32;

const MENSAJE_GENERICO =
  "Si el RUT ingresado corresponde a una cuenta con correo verificado, te enviaremos un enlace de recuperación.";

function sha256(valor) {
  return createHash("sha256").update(valor).digest("hex");
}

async function obtenerConfigNumero(clave, valorPorDefecto) {
  const [rows] = await pool.execute(
    "SELECT valor FROM configuracion_sistema WHERE clave = ?",
    [clave]
  );
  if (!rows[0]) return valorPorDefecto;
  return Number(rows[0].valor);
}

export const PasswordResetService = {
  async solicitar(rut) {
    if (!rut) {
      throw httpError(400, "El RUT es obligatorio.");
    }

    const user = await findUserByRut(rut);
    if (!user) return { mensaje: MENSAJE_GENERICO };

    if (!user.contrasena) return { mensaje: MENSAJE_GENERICO };

    const correoRegistro = await EmailVerificationModel.getByUsuarioId(user.usuario_id);
    if (!correoRegistro || !correoRegistro.verificado) return { mensaje: MENSAJE_GENERICO };

    const tokenCrudo = randomBytes(TOKEN_BYTES).toString("hex");
    const tokenHash = sha256(tokenCrudo);
    const minutosExpiracion = await obtenerConfigNumero("expiracion_reset_min", 30);
    const expiraEn = new Date(Date.now() + minutosExpiracion * 60 * 1000);

    await PasswordResetModel.crear(user.usuario_id, tokenHash, expiraEn);
    await enviarCorreoRecuperacion({
      usuarioId: user.usuario_id,
      correo: correoRegistro.correo,
      token: tokenCrudo,
    });

    return { mensaje: MENSAJE_GENERICO };
  },

  async confirmar(tokenCrudo, nuevaPassword) {
    if (!tokenCrudo || !nuevaPassword) {
      throw httpError(400, "Token y nueva contraseña son obligatorios.");
    }
    if (nuevaPassword.length < 8) {
      throw httpError(422, "La contraseña debe tener al menos 8 caracteres.");
    }

    const tokenHash = sha256(tokenCrudo);
    const registro = await PasswordResetModel.getVigentePorHash(tokenHash);
    if (!registro) {
      throw httpError(400, "El enlace de recuperación es inválido o ya expiró.");
    }

    const passwordHash = await bcrypt.hash(nuevaPassword, 10);
    await PasswordResetModel.marcarUsadoYActualizarPassword(
      registro.reset_id,
      registro.usuario_id,
      passwordHash
    );

    return { actualizado: true };
  },
};

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}