const API_URL = import.meta.env.VITE_API_URL;

export async function getPerfilAcademico(usuarioId) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users/academicos/${usuarioId}/perfil`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al obtener perfil académico");
  }

  return await response.json();
}
