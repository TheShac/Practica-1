import { getFichaByUsuario } from "../models/ficha.model.js";

export async function getFichaAcademica(req, res) {
  try {
    const { usuarioId } = req.params;

    const data = await getFichaByUsuario(usuarioId);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener ficha académica" });
  }
}
