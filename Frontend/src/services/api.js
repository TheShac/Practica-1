const API_URL = import.meta.env.VITE_API_URL;

export async function loginRequest({ identifier, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Error al iniciar sesión");
  }

  return data;
}

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getCategorias() {
  const res = await fetch(`${API_URL}/categorias`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error cargando categorías");
  return data;
}

export async function getMisPublicaciones() {
  const res = await fetch(`${API_URL}/publicaciones/mias`, {
    headers: { ...authHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error cargando publicaciones");
  return data;
}

export async function createPublicacion(payload) {
  const res = await fetch(`${API_URL}/publicaciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error creando publicación");
  return data;
}

export async function updatePublicacion(id, payload) {
  const res = await fetch(`${API_URL}/publicaciones/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error actualizando publicación");
  return data;
}

export async function deletePublicacion(id) {
  const res = await fetch(`${API_URL}/publicaciones/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error eliminando publicación");
  return data;
}