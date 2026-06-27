export function sanitizeText(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, "")
    .replace(/[<>'"`;]/g, "")
    .trim();
}

export function sanitizeObject(obj = {}) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      typeof value === "string" ? sanitizeText(value) : value,
    ])
  );
}

export function sanitizeInput(value = "") {
  return String(value).replace(/<[^>]*>/g, "");
}