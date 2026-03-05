const API_URL = import.meta.env.VITE_API_URL;

/* =========================
   OBTENER MIS PROYECTOS
========================= */

export async function getMisIntervenciones() {
  const res = await fetch(`${API_URL}/proyectos-intervencion/mis-proyectos`, {
    credentials: "include",
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
  const res = await fetch(`${API_URL}/proyectos-intervencion/mis-proyectos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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
  const res = await fetch(`${API_URL}/proyectos-intervencion/mis-proyectos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
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
  const res = await fetch(`${API_URL}/proyectos-intervencion/mis-proyectos/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Error eliminando proyecto de intervención");
  }

  return res.json();
}