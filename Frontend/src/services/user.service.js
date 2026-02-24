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
export const updatePerfilAcademico = async (id, data) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:3000/api/usuarios/academicos/${id}/perfil`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error actualizando perfil");
  }

  return response.json();
};