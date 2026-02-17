const API_URL = `${import.meta.env.VITE_API_URL}/investigacion`;

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchInvestigaciones() {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Error cargando investigaciones");
  return res.json();
}

export async function createInvestigacion(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error creando investigación");
  return res.json();
}

export async function updateInvestigacion(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error actualizando investigación");
  return res.json();
}

export async function deleteInvestigacion(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Error eliminando investigación");
  return res.json();
}
