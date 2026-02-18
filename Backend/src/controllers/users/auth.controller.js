import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByRut } from "../../models/users/user.model.js";

export async function login(req, res) {
  try {
    const { rut, password } = req.body;

    if (!rut || !password) {
      return res.status(400).json({ message: "rut y password son requeridos" });
    }

    const user = await findUserByRut(rut);
    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.contrasena);
    if (!ok) return res.status(401).json({ message: "Credenciales inválidas" });

    const payload = {
      usuario_id: user.usuario_id,
      rol: user.rol_nombre,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    return res.json({
      token,
      user: {
        usuario_id: user.usuario_id,
        rut: user.rut,
        nombre: `${user.primer_nombre} ${user.primer_apellido}`,
        rol: user.rol_nombre,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error en login" });
  }
}
