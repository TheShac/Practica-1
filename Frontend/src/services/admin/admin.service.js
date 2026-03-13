const API_URL = import.meta.env.VITE_API_URL;

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error en la solicitud");
  }
  return res.json();
};

export const getUsuarios = () =>
  fetch(`${API_URL}/users`, { headers: headers() }).then(handleResponse);

export const getRoles = () =>
  fetch(`${API_URL}/users/roles`, { headers: headers() }).then(handleResponse);

export const getRolesAcademico = () =>
  fetch(`${API_URL}/users/roles-academico`, { headers: headers() }).then(handleResponse);

export const getUsuarioPerfil = (id) =>
  fetch(`${API_URL}/users/academicos/${id}/perfil`, { headers: headers() }).then(handleResponse);

export const createUsuario = (data) =>
  fetch(`${API_URL}/users`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateUsuario = (id, data) =>
  fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateUsuarioPerfil = (id, data) =>
  fetch(`${API_URL}/users/academicos/${id}/perfil`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updatePassword = (id, password) =>
  fetch(`${API_URL}/users/${id}/password`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ password }),
  }).then(handleResponse);

export const deleteUsuario = (id) =>
  fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: headers(),
  }).then(handleResponse);

  // ── ROL ──────────────────────────────────────────────────
export const createRol = (nombre) =>
  fetch(`${API_URL}/users/roles`, {
    method: "POST", headers: headers(),
    body: JSON.stringify({ nombre }),
  }).then(handleResponse);

export const updateRol = (id, nombre) =>
  fetch(`${API_URL}/users/roles/${id}`, {
    method: "PUT", headers: headers(),
    body: JSON.stringify({ nombre }),
  }).then(handleResponse);

export const deleteRol = (id) =>
  fetch(`${API_URL}/users/roles/${id}`, {
    method: "DELETE", headers: headers(),
  }).then(handleResponse);

// ── ROL ACADÉMICO ────────────────────────────────────────
export const createRolAcademico = (tipo_academico) =>
  fetch(`${API_URL}/users/roles-academico`, {
    method: "POST", headers: headers(),
    body: JSON.stringify({ tipo_academico }),
  }).then(handleResponse);

export const updateRolAcademico = (id, tipo_academico) =>
  fetch(`${API_URL}/users/roles-academico/${id}`, {
    method: "PUT", headers: headers(),
    body: JSON.stringify({ tipo_academico }),
  }).then(handleResponse);

export const deleteRolAcademico = (id) =>
  fetch(`${API_URL}/users/roles-academico/${id}`, {
    method: "DELETE", headers: headers(),
  }).then(handleResponse);