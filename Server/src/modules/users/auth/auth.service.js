import bcrypt from 'bcrypt';
import jwt    from 'jsonwebtoken';
import { findUserByRut, findUserByCorreoOrganizacional, findUserById, linkGoogleId } from './auth.model.js';
import { validateRut }        from '#src/utils/rut.js';
import { isRefreshTokenRevoked } from '#src/core/tokenRevocationStore.js';
import { validarDominioPermitido } from '#src/utils/dominio.util.js';

const ACCESS_EXPIRES  = process.env.JWT_EXPIRES_IN         || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

function generateTokens(payload) {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: ACCESS_EXPIRES,
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES,
  });
  return { accessToken, refreshToken };
}

export async function loginService({ rut, password }) {
  if (!rut || !password) {
    const err = new Error('RUT y contraseña son requeridos');
    err.status = 400;
    throw err;
  }

  // Validar formato y dígito verificador del RUT
  if (!validateRut(rut)) {
    const err = new Error('RUT inválido');
    err.status = 400;
    throw err;
  }

  const user = await findUserByRut(rut);
  if (!user) {
    const err = new Error('Credenciales inválidas');
    err.status = 401;
    throw err;
  }

  if (!user.contrasena) {
    const err = new Error('Esta cuenta no tiene contraseña configurada. Inicia sesión con Google.');
    err.status = 400;
    throw err;
  }

  const passwordMatch = await bcrypt.compare(password, user.contrasena);
  if (!passwordMatch) {
    const err = new Error('Credenciales inválidas');
    err.status = 401;
    throw err;
  }

  const payload = {
    usuario_id: user.usuario_id,
    rol:        user.rol_nombre,
  };

  const { accessToken, refreshToken } = generateTokens(payload);

  return {
    accessToken,
    refreshToken,
    user: {
      usuario_id: user.usuario_id,
      rut:        user.rut,
      nombre:     `${user.primer_nombre} ${user.primer_apellido}`,
      rol:        user.rol_nombre,
    },
  };
}

export async function loginGoogleService(profile) {
  const email = profile?.emails?.[0]?.value?.toLowerCase();
  const googleId = profile?.id;

  if (!email || !googleId) {
    const err = new Error('No se pudo obtener el correo desde Google');
    err.status = 400;
    throw err;
  }

  const dominioValido = await validarDominioPermitido(email);
  if (!dominioValido) {
    const err = new Error('Tu cuenta de Google no pertenece a un dominio institucional permitido');
    err.status = 403;
    throw err;
  }

  const user = await findUserByCorreoOrganizacional(email);
  if (!user) {
    const err = new Error('Este correo no está registrado en el sistema');
    err.status = 403;
    throw err;
  }

  if (!user.correo_verificado) {
    const err = new Error('Debes verificar tu correo organizacional antes de iniciar sesión con Google');
    err.status = 403;
    throw err;
  }

  if (!user.google_id) {
    await linkGoogleId(user.usuario_id, googleId);
  } else if (user.google_id !== googleId) {
    // No debería pasar nunca (google_id es único), pero se cubre por si acaso.
    const err = new Error('Esta cuenta de Google no coincide con la registrada para este correo');
    err.status = 403;
    throw err;
  }

  const payload = {
    usuario_id: user.usuario_id,
    rol:        user.rol_nombre,
  };

  const { accessToken, refreshToken } = generateTokens(payload);

  return {
    accessToken,
    refreshToken,
    user: {
      usuario_id: user.usuario_id,
      rut:        user.rut,
      nombre:     `${user.primer_nombre} ${user.primer_apellido}`,
      rol:        user.rol_nombre,
    },
  };
}

export async function getUsuarioActualService(usuarioId) {
  const user = await findUserById(usuarioId);
  if (!user) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }
 
  return {
    usuario_id: user.usuario_id,
    rut:        user.rut,
    nombre:     `${user.primer_nombre} ${user.primer_apellido}`,
    rol:        user.rol_nombre,
  };
}

export function refreshTokenService(refreshToken) {
  if (!refreshToken) {
    const err = new Error('Refresh token requerido');
    err.status = 401;
    throw err;
  }
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (isRefreshTokenRevoked(payload.usuario_id, payload.iat)) {
      const err = new Error('Refresh token revocado');
      err.status = 401;
      throw err;
    }

    const newAccessToken = jwt.sign(
      { usuario_id: payload.usuario_id, rol: payload.rol },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_EXPIRES }
    );
    return { accessToken: newAccessToken };
  } catch (e) {
    const err = e.status ? e : new Error('Refresh token inválido o expirado');
    if (!e.status) err.status = 401;
    throw err;
  }
}