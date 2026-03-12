const API_URL = import.meta.env.VITE_API_URL;

export async function getFichaAcademica(usuarioId) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/ficha/${usuarioId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al obtener ficha académica");
  }

  return await response.json();
}


