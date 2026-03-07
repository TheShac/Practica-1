const API_URL = import.meta.env.VITE_API_URL;

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getMisConsultorias() {
  const res = await fetch(`${API_URL}/consultorias`, {
    headers: authHeader(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error obteniendo consultorías");
  return data;
}

export async function createConsultoria(payload) {
  const res = await fetch(`${API_URL}/consultorias`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error creando consultoría");
  return data;
}

export async function updateConsultoria(id, payload) {
  const res = await fetch(`${API_URL}/consultorias/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error actualizando consultoría");
  return data;
}

export async function deleteConsultoria(id) {
  const res = await fetch(`${API_URL}/consultorias/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error eliminando consultoría");
  return data;
}