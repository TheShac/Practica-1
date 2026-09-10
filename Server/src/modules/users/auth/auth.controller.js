import { loginService, refreshTokenService, loginGoogleService, getUsuarioActualService } from './auth.service.js';
import { createSSETicket }   from '#src/core/sseTicketStore.js';
import { revokeUserTokens }  from '#src/core/tokenRevocationStore.js';
import passport from './google.strategy.js';

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

export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: true,
});

export const googleCallback = [
  passport.authenticate('google', {
    session: true,
    failureRedirect: `${process.env.FRONTEND_URL}/?error=google`,
  }),
  async (req, res) => {
    try {
      const { accessToken, refreshToken } = await loginGoogleService(req.user);

      res.cookie('refresh_token', refreshToken, COOKIE_OPTS);

      const redirectUrl = `${process.env.FRONTEND_URL}/auth/google/success?token=${accessToken}`;
      return res.redirect(redirectUrl);
    } catch (err) {
      const mensaje = encodeURIComponent(err.message || 'Error al iniciar sesión con Google');
      return res.redirect(`${process.env.FRONTEND_URL}/?error=${mensaje}`);
    }
  },
];

export async function me(req, res) {
  try {
    const user = await getUsuarioActualService(req.user.usuario_id);
    return res.json({ user });
  } catch (err) {
    return res.status(err.status ?? 500).json({ message: err.message });
  }
}