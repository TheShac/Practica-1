const API_URL = `${import.meta.env.VITE_API_URL}/proyectos-intervencion`;

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/* =========================
   OBTENER MIS PROYECTOS
========================= */

export async function getMisIntervenciones() {
  const res = await fetch(`${API_URL}/mis-proyectos`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Error obteniendo proyectos de intervención");
  }

  return res.json();
}

/* =========================
   CREAR PROYECTO
========================= */

export async function createIntervencion(data) {
  const res = await fetch(`${API_URL}/mis-proyectos`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error creando proyecto de intervención");
  }

  return res.json();
}

/* =========================
   ACTUALIZAR PROYECTO
========================= */

export async function updateIntervencion(id, data) {
  const res = await fetch(`${API_URL}/mis-proyectos/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error actualizando proyecto de intervención");
  }

  return res.json();
}

/* =========================
   ELIMINAR PROYECTO
========================= */

export async function deleteIntervencion(id) {
  const res = await fetch(`${API_URL}/mis-proyectos/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Error eliminando proyecto de intervención");
  }

  return res.json();
}