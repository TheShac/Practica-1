export function cleanRut(value = "") {
  // Asegura que sea string, elimina TODO lo que no sea número o K/k, y pasa a mayúsculas
  return String(value).replace(/[^0-9kK]/g, "").toUpperCase();
}

export function validateRut(value = "") {
  const clean = cleanRut(value);
  
  // Un RUT válido tiene entre 8 y 9 caracteres (ej: 12345678K o 33333339)
  if (clean.length < 8) return false;

  const body = clean.slice(0, -1);
  const dv   = clean.slice(-1);

  // Validar que el cuerpo sean solo números
  if (!/^\d+$/.test(body)) return false;

  // Calcular dígito verificador (Algoritmo del módulo 11 optimizado)
  let sum = 0;
  let multiplier = 2;

  // Recorremos el cuerpo de atrás hacia adelante de forma segura
  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body.charAt(i)) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  
  // Determinar cuál es el dígito verificador esperado
  let expected = "";
  if (remainder === 11) expected = "0";
  else if (remainder === 10) expected = "K";
  else expected = String(remainder);

  // Retorna si el DV ingresado coincide con el esperado
  return dv === expected;
}