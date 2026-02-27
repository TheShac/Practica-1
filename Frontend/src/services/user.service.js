const API_URL = import.meta.env.VITE_API_URL;

export async function getPerfilAcademico(usuarioId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/users/academicos/${usuarioId}/perfil`,
    {
      headers: {
        Authorization: `Bearer ${token}` ,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

export async function updatePerfilAcademico(id, data) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/users/academicos/${id}/perfil`,
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
    throw new Error(error.message);
  }

  return response.json();
}