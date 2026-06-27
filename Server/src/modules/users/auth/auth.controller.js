import { loginService, refreshTokenService } from './auth.service.js';
import { createSSETicket }   from '../../../core/sseTicketStore.js';
import { revokeUserTokens }  from '../../../core/tokenRevocationStore.js';

const COOKIE_OPTS = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge:   7 * 24 * 60 * 60 * 1000,
  path:     '/api/auth',
};

export async function login(req, res) {
  try {
    const { accessToken, refreshToken, user } = await loginService(req.body);

    res.cookie('refresh_token', refreshToken, COOKIE_OPTS);

    return res.json({ token: accessToken, user });
  } catch (err) {
    console.error(err);
    return res.status(err.status ?? 500).json({ message: err.message });
  }
}

export async function refresh(req, res) {
  try {
    const refreshToken = req.cookies?.refresh_token;
    const { accessToken } = refreshTokenService(refreshToken);
    return res.json({ token: accessToken });
  } catch (err) {
    res.clearCookie('refresh_token', { 
      path: COOKIE_OPTS.path,
      secure: COOKIE_OPTS.secure,
      sameSite: COOKIE_OPTS.sameSite 
    });
    return res.status(err.status ?? 401).json({ message: err.message });
  }
}

// Emite un ticket de un solo uso (30 s) para autenticar la conexión SSE
// sin exponer el JWT como query param en la URL.
export function issueSSETicket(req, res) {
  const { usuario_id, rol } = req.user;
  const ticket = createSSETicket(usuario_id, rol);
  return res.json({ ticket });
}

export function logout(req, res) {
  // Invalida todos los refresh tokens emitidos antes de este momento.
  if (req.user?.usuario_id) {
    revokeUserTokens(req.user.usuario_id);
  }
  res.clearCookie('refresh_token', {
    path: COOKIE_OPTS.path,
    secure: COOKIE_OPTS.secure,
    sameSite: COOKIE_OPTS.sameSite
  });
  return res.json({ message: 'Sesión cerrada' });
}