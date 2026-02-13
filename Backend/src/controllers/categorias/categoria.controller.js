import { getCategorias } from "../../models/categorias/categoria.model.js";

export async function listCategorias(req, res) {
  try {
    const cats = await getCategorias();
    res.json(cats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error listando categorías" });
  }
}
