const API_URL = import.meta.env.VITE_API_URL;

export async function getUltimasActualizaciones() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/home-profesional/actualizaciones`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al obtener actualizaciones");
  }

  return await response.json();
}