const API_URL = import.meta.env.VITE_API_URL;

function getToken() {
  return localStorage.getItem("token");
}

function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(response, defaultMessage) {
  if (!response.ok) {
    let errorMessage = defaultMessage;

    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {}

    throw new Error(errorMessage);
  }

  return response;
}

export async function getReporteGeneral() {
  const response = await fetch(`${API_URL}/profesional-apoyo/reporte-general`, {
    headers: authHeader(),
  });

  await handleResponse(response, "Error obteniendo reporte general");

  return response.json();
}

export async function updateReporteGeneral(reporte, wosGlobal) {
  const response = await fetch(`${API_URL}/profesional-apoyo/reporte-general`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify({
      reporte,
      wosGlobal,
    }),
  });

  await handleResponse(response, "Error actualizando reporte general");

  return response.json();
}

export async function getReportePromedios() {
  const response = await fetch(`${API_URL}/profesional-apoyo/promedios`, {
    headers: authHeader(),
  });

  await handleResponse(response, "Error obteniendo promedios");

  return response.json();
}

export async function updateReportePromedios(data) {
  const response = await fetch(`${API_URL}/profesional-apoyo/promedios`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  });

  await handleResponse(response, "Error actualizando promedios");

  return response.json();
}

export async function downloadReporteGeneralExcel() {
  const response = await fetch(`${API_URL}/profesional-apoyo/export-excel`, {
    headers: authHeader(),
  });

  await handleResponse(response, "Error descargando reporte");

  return response.blob();
}