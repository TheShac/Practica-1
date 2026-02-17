const API_URL = `${import.meta.env.VITE_API_URL}/patente`;

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchPatentes() {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Error cargando patentes");
  return res.json();
}

export async function createPatente(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error creando patente");
  return res.json();
}

export async function updatePatente(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error actualizando patente");
  return res.json();
}

export async function deletePatente(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Error eliminando patente");
  return res.json();
}
