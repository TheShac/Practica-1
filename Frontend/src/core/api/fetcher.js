const API_URL = import.meta.env.VITE_API_URL;

function getHeaders(isJson = true) {
  const token = localStorage.getItem("token");
  return {
    ...(isJson && { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

function handleSesionExpirada() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  const ruta = window.location.pathname;
  // Sólo permitir paths relativos seguros; descartar cualquier intento de
  // open redirect (p.ej. //evil.com o paths vacíos).
  const safeRuta = ruta.startsWith("/") && !ruta.startsWith("//") ? ruta : "/";
  window.location.replace(`/?expired=1&redirect=${encodeURIComponent(safeRuta)}`);
}

async function tryRefresh() {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method:      "POST",
      credentials: "include",
    });
    if (!res.ok) return false;
    const { token } = await res.json();
    localStorage.setItem("token", token);
    return true;
  } catch {
    return false;
  }
}

async function handleResponse(res, retryFn, path) {
  if (res.status === 401 && path !== "/auth/login") {
    const renovado = await tryRefresh();
    if (renovado) {
      return retryFn();
    }
    handleSesionExpirada();
    throw new Error("Sesión expirada");
  }

  const contentType = res.headers.get("Content-Type") || "";
  if (!contentType.includes("application/json") && res.ok) {
    return res.blob();
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data?.message || `Error ${res.status}`);
    error.response = { status: res.status }; 
    error.status = res.status;
    throw error;
  }
  return data;
}

export const fetcher = {
  get: (path) => {
    const run = () =>
      fetch(`${API_URL}${path}`, { headers: getHeaders(false), credentials: "include" })
        .then((res) => handleResponse(res, run, path));
    return run();
  },

  post: (path, body) => {
    const run = () =>
      fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(body),
        credentials: "include",
      }).then((res) => handleResponse(res, run, path));
    return run();
  },

  put: (path, body) => {
    const run = () =>
      fetch(`${API_URL}${path}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(body),
        credentials: "include",
      }).then((res) => handleResponse(res, run, path));
    return run();
  },

  delete: (path) => {
    const run = () =>
      fetch(`${API_URL}${path}`, {
        method: "DELETE",
        headers: getHeaders(false),
        credentials: "include",
      }).then((res) => handleResponse(res, run, path));
    return run();
  },
};