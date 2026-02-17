const BASE_URL = import.meta.env.VITE_API_URL;
const TESIS_URL = `${BASE_URL}/tesis`;

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

export async function fetchTesis(nivel) {
  const res = await fetch(`${TESIS_URL}/${nivel}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error cargando tesis");
  }

  return res.json();
}

export async function createTesis(data) {
  const res = await fetch(TESIS_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error creando tesis");
  }

  return res.json();
}

export async function updateTesis(id, data) {
  const res = await fetch(`${TESIS_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error actualizando tesis");
  }

  return res.json();
}

export async function deleteTesis(id) {
  const res = await fetch(`${TESIS_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error eliminando tesis");
  }

  return res.json();
}
