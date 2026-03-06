const API_URL = import.meta.env.VITE_API_URL;

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Secretaria ────────────────────────────────────────────────────────────────
export async function enviarNotificacion(payload) {
  const res = await fetch(`${API_URL}/notificaciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error enviando notificación");
  return data;
}

export async function getNotificacionesEnviadas() {
  const res = await fetch(`${API_URL}/notificaciones/enviadas`, {
    headers: authHeader(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error cargando notificaciones");
  return data;
}

export async function eliminarNotificacion(id) {
  const res = await fetch(`${API_URL}/notificaciones/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error eliminando notificación");
  return data;
}

// ── Académico ─────────────────────────────────────────────────────────────────
export async function getMisNotificaciones() {
  const res = await fetch(`${API_URL}/notificaciones/mis`, {
    headers: authHeader(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error cargando notificaciones");
  return data;
}

export async function marcarLeida(id, es_global) {
  const res = await fetch(`${API_URL}/notificaciones/${id}/leida`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ es_global }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error marcando notificación");
  return data;
}

export async function getCountNoLeidas() {
  const res = await fetch(`${API_URL}/notificaciones/no-leidas`, {
    headers: authHeader(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error contando notificaciones");
  return data;
}