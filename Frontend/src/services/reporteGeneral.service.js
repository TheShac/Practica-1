const API_URL = import.meta.env.VITE_API_URL;

export async function getReporteGeneral() {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/profesional-apoyo/reporte-general`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error obteniendo reporte general");
  }

  return await response.json();
}