export function cleanRut(value = "") {
  return String(value).replace(/[^0-9kK]/g, "").toUpperCase();
}

export function formatRut(value = "") {
  const v = cleanRut(value);

  if (v.length <= 1) return v;

  const body = v.slice(0, -1);
  const dv = v.slice(-1);

  const bodyWithDots = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${bodyWithDots}-${dv}`;
}

export function looksLikeEmail(value = "") {
  return String(value).includes("@");
}
