const API_URL = import.meta.env.VITE_API_URL;

export async function loginRequest({ rut, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rut, password }),
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

export async function getMisLibros() {
  const res = await fetch(`${API_URL}/libros/mios`, {
    headers: { ...authHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error cargando libros");
  return data;
}

export async function createLibro(payload) {
  const res = await fetch(`${API_URL}/libros`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error creando libro");
  return data;
}

export async function updateLibro(id, payload) {
  const res = await fetch(`${API_URL}/libros/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error actualizando libro");
  return data;
}

export async function deleteLibro(id) {
  const res = await fetch(`${API_URL}/libros/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error eliminando libro");
  return data;
}

export async function getMisCapLibros() {
  const res = await fetch(`${API_URL}/cap-libro/mios`, {
    headers: { ...authHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error cargando capítulos de libro");
  return data;
}

export async function createCapLibro(payload) {
  const res = await fetch(`${API_URL}/cap-libro`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error creando capítulo de libro");
  return data;
}

export async function updateCapLibro(id, payload) {
  const res = await fetch(`${API_URL}/cap-libro/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error actualizando capítulo de libro");
  return data;
}

export async function deleteCapLibro(id) {
  const res = await fetch(`${API_URL}/cap-libro/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error eliminando capítulo de libro");
  return data;
}

export async function getAcademicos() {
  const res = await fetch(`${API_URL}/users/academicos`, {
    headers: { ...authHeader() },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error cargando académicos");

  return data;
}