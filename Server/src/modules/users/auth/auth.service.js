import bcrypt from 'bcrypt';
import jwt    from 'jsonwebtoken';
import { findUserByRut } from './auth.model.js';

// Valida credenciales y retorna token + datos públicos del usuario.
// Lanza un Error descriptivo si algo falla; el controller decide el status HTTP.
export async function loginService({ rut, password }) {
  if (!rut || !password) {
    const err = new Error('rut y password son requeridos');
    err.status = 400;
    throw err;
  }

  const user = await findUserByRut(rut);
  if (!user) {
    const err = new Error('Credenciales inválidas');
    err.status = 401;
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

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

  return {
    token,
    user: {
      usuario_id: user.usuario_id,
      rut:        user.rut,
      nombre:     `${user.primer_nombre} ${user.primer_apellido}`,
      rol:        user.rol_nombre,
    },
  };
}