import bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { validarDominioPermitido } from '#src/utils/dominio.util.js';
import { EmailVerificationModel, VerificacionCodigoModel } from './email-verification.model.js';
import { enviarCorreoVerificacion } from '#src/modules/email/email.service.js';
import { obtenerValorNumerico } from '#src/modules/configuration/configuracion.service.js';

const CODE_LENGTH = 6;

function generarCodigo() {
  return String(randomInt(0, 1_000_000)).padStart(CODE_LENGTH, '0');
}

async function enviarBienvenidaSiEsPrimeraVez(usuarioId, correo, verificadoEnAnterior) {
  if (verificadoEnAnterior) return;
  const usuario = await findUserById(usuarioId);
  if (!usuario) return;
  const nombre = `${usuario.primer_nombre} ${usuario.primer_apellido}`;
  await enviarCorreoBienvenida({ usuarioId, correo, nombre });
}

export const EmailVerificationService = {
  async registrarCorreo(usuarioId, correoCrudo) {
    const correo = correoCrudo.trim().toLowerCase();

    const dominioValido = await validarDominioPermitido(correo);
    if (!dominioValido) {
      throw httpError(422, 'El correo debe pertenecer a un dominio institucional permitido.');
    }

    const enUso = await EmailVerificationModel.getByCorreo(correo);
    if (enUso && enUso.usuario_id !== usuarioId) {
      throw httpError(409, 'Este correo organizacional ya está en uso.');
    }

    const registroActual = await EmailVerificationModel.getByUsuarioId(usuarioId);
    if (registroActual?.correo === correo && !registroActual.verificado) {
      const codigoVigente = await VerificacionCodigoModel.getVigente(usuarioId);
      if (codigoVigente && new Date(codigoVigente.expira_en) > new Date()) {
        throw httpError(
          409,
          'Ya tienes un código vigente para este correo. Usa la opción de reenviar en vez de registrar de nuevo.'
        );
      }
    }

    await EmailVerificationModel.upsert(usuarioId, correo);
    await generarYEnviarCodigo(usuarioId, correo);

    return { correo, verificado: false };
  },

  async confirmarCodigo(usuarioId, codigoIngresado) {
    const registro = await VerificacionCodigoModel.getVigente(usuarioId);
    if (!registro) {
      throw httpError(404, 'No hay un código vigente. Solicita uno nuevo.');
    }

    if (new Date(registro.expira_en) < new Date()) {
      await VerificacionCodigoModel.eliminarPorUsuario(usuarioId);
      throw httpError(410, 'El código expiró. Solicita uno nuevo.');
    }

    const coincide = await bcrypt.compare(codigoIngresado, registro.codigo_hash);
    if (!coincide) {
      throw httpError(400, 'Código incorrecto.');
    }

    await EmailVerificationModel.marcarVerificado(usuarioId);
    await VerificacionCodigoModel.eliminarPorUsuario(usuarioId);

    return { verificado: true };
  },

  async reenviarCodigo(usuarioId) {
    const correoRegistro = await EmailVerificationModel.getByUsuarioId(usuarioId);
    if (!correoRegistro) {
      throw httpError(404, 'Primero debes registrar tu correo organizacional.');
    }
    if (correoRegistro.verificado) {
      throw httpError(409, 'Este correo ya está verificado.');
    }

    const limite = await obtenerValorNumerico('limite_reenvios', 3);
    const actual = await VerificacionCodigoModel.getVigente(usuarioId);
    const intentos = actual?.intentos_reenvio ?? 0;

    if (intentos >= limite) {
      throw httpError(429, 'Alcanzaste el límite de reenvíos. Intenta más tarde.');
    }

    await VerificacionCodigoModel.eliminarPorUsuario(usuarioId);
    await generarYEnviarCodigo(usuarioId, correoRegistro.correo, intentos + 1);

    return { reenviado: true, intentosRestantes: limite - (intentos + 1) };
  },

  async obtenerEstado(usuarioId) {
    const registro = await EmailVerificationModel.getByUsuarioId(usuarioId);
    if (!registro) return { correo: null, verificado: false };
    return { correo: registro.correo, verificado: !!registro.verificado };
  },

  async verificarManualmente(usuarioId) {
    const registro = await EmailVerificationModel.getByUsuarioId(usuarioId);
    if (!registro) {
      throw httpError(404, 'Este usuario no tiene un correo organizacional registrado.');
    }
    if (registro.verificado) {
      throw httpError(409, 'Este correo ya estaba verificado.');
    }

    await EmailVerificationModel.marcarVerificado(usuarioId);
    await VerificacionCodigoModel.eliminarPorUsuario(usuarioId);

    return { correo: registro.correo, verificado: true, verificadoPor: 'admin' };
  },
};

async function generarYEnviarCodigo(usuarioId, correo, intentosReenvio = 0) {
  const codigo = generarCodigo();
  const codigoHash = await bcrypt.hash(codigo, 10);
  const minutosExpiracion = await obtenerValorNumerico('expiracion_codigo_min', 15);
  const expiraEn = new Date(Date.now() + minutosExpiracion * 60 * 1000);

  await VerificacionCodigoModel.crear(usuarioId, codigoHash, expiraEn, intentosReenvio);
  await enviarCorreoVerificacion({ usuarioId, correo, codigo });
}

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}