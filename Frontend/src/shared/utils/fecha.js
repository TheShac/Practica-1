/**
 * Formatea un timestamp (string sin zona o Date) a hora de Chile (America/Santiago).
 *
 * MySQL con dateStrings:true devuelve strings como "2026-06-25 18:48:00" sin
 * indicador de zona horaria. Al añadir "Z" se fuerza la interpretación como UTC
 * antes de convertir a America/Santiago, que maneja CLT (UTC-4) y CLST (UTC-3)
 * automáticamente según el horario de verano.
 */
export function formatFecha(fecha) {
  if (!fecha) return "—";

  let iso = fecha;
  if (typeof fecha === "string" && !fecha.endsWith("Z") && !fecha.includes("+")) {
    iso = fecha.replace(" ", "T") + "Z";
  }

  return new Date(iso).toLocaleString("es-CL", {
    timeZone: "America/Santiago",
    day:    "2-digit",
    month:  "2-digit",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
  });
}
