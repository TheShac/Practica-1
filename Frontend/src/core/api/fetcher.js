const API_URL = import.meta.env.VITE_API_URL;

function getHeaders(isJson = true) {
  const token = localStorage.getItem("token");
  return {
    ...(isJson && { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function handleResponse(res) {
  const contentType = res.headers.get("Content-Type") || "";
  if (contentType.includes("application/json") === false && res.ok) {
    return res.blob();
  }
 
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || `Error ${res.status}`);
  }
  return data;
}

export const fetcher = {
  get: (path) =>
    fetch(`${API_URL}${path}`, {
      headers: getHeaders(false),
    }).then(handleResponse),

  post: (path, body) =>
    fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  put: (path, body) =>
    fetch(`${API_URL}${path}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (path) =>
    fetch(`${API_URL}${path}`, {
      method: "DELETE",
      headers: getHeaders(false),
    }).then(handleResponse),
};