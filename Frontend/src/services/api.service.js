const API_URL = import.meta.env.VITE_API_URL;

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── LIBROS ────────────────────────────────────────────────────────────────────
export async function createLibroParaAcademico(usuarioId, payload) {
  const res = await fetch(`${API_URL}/libros/academico/${usuarioId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error creando libro");
  return data;
}

export async function updateLibroParaAcademico(usuarioId, id, payload) {
  const res = await fetch(`${API_URL}/libros/academico/${usuarioId}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error actualizando libro");
  return data;
}

export async function deleteLibroParaAcademico(usuarioId, id) {
  const res = await fetch(`${API_URL}/libros/academico/${usuarioId}/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error eliminando libro");
  return data;
}

// ── PUBLICACIONES ─────────────────────────────────────────────────────────────
export async function createPublicacionParaAcademico(usuarioId, formData) {
  const res = await fetch(`${API_URL}/publicaciones/academico/${usuarioId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error creando publicación");
  return data;
}

export async function updatePublicacionParaAcademico(usuarioId, id, formData) {
  const res = await fetch(`${API_URL}/publicaciones/academico/${usuarioId}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error actualizando publicación");
  return data;
}

export async function deletePublicacionParaAcademico(usuarioId, id) {
  const res = await fetch(`${API_URL}/publicaciones/academico/${usuarioId}/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error eliminando publicación");
  return data;
}

// ── CAPÍTULOS ─────────────────────────────────────────────────────────────────
export async function createCapLibroParaAcademico(usuarioId, payload) {
  const res = await fetch(`${API_URL}/cap-libro/academico/${usuarioId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error creando capítulo");
  return data;
}

export async function updateCapLibroParaAcademico(usuarioId, id, payload) {
  const res = await fetch(`${API_URL}/cap-libro/academico/${usuarioId}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error actualizando capítulo");
  return data;
}

export async function deleteCapLibroParaAcademico(usuarioId, id) {
  const res = await fetch(`${API_URL}/cap-libro/academico/${usuarioId}/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error eliminando capítulo");
  return data;
}

// ── TESIS ─────────────────────────────────────────────────────────────────────
export async function createTesisParaAcademico(usuarioId, payload) {
  const res = await fetch(`${API_URL}/tesis/academico/${usuarioId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error creando tesis");
  return data;
}

export async function updateTesisParaAcademico(usuarioId, id, payload) {
  const res = await fetch(`${API_URL}/tesis/academico/${usuarioId}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error actualizando tesis");
  return data;
}

export async function deleteTesisParaAcademico(usuarioId, id) {
  const res = await fetch(`${API_URL}/tesis/academico/${usuarioId}/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error eliminando tesis");
  return data;
}

// ── INVESTIGACIONES ───────────────────────────────────────────────────────────
export async function createInvestigacionParaAcademico(usuarioId, payload) {
  const res = await fetch(`${API_URL}/investigacion/academico/${usuarioId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error creando investigación");
  return data;
}

export async function updateInvestigacionParaAcademico(usuarioId, id, payload) {
  const res = await fetch(`${API_URL}/investigacion/academico/${usuarioId}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error actualizando investigación");
  return data;
}

export async function deleteInvestigacionParaAcademico(usuarioId, id) {
  const res = await fetch(`${API_URL}/investigacion/academico/${usuarioId}/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error eliminando investigación");
  return data;
}

// ── PATENTES ──────────────────────────────────────────────────────────────────
export async function createPatenteParaAcademico(usuarioId, payload) {
  const res = await fetch(`${API_URL}/patente/academico/${usuarioId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error creando patente");
  return data;
}

export async function updatePatenteParaAcademico(usuarioId, id, payload) {
  const res = await fetch(`${API_URL}/patente/academico/${usuarioId}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error actualizando patente");
  return data;
}

export async function deletePatenteParaAcademico(usuarioId, id) {
  const res = await fetch(`${API_URL}/patente/academico/${usuarioId}/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error eliminando patente");
  return data;
}