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
