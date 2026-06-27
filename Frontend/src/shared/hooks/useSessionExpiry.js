import { useEffect, useRef, useState } from "react";

// Decodifica el JWT sin librerías para leer la expiración
function getTokenExpiry(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ? payload.exp * 1000 : null; // convertir a ms
  } catch {
    return null;
  }
}

// Avisa N ms antes de que expire el token
// onWarning → mostrar modal
// onExpired → el fetcher ya maneja esto, pero por si acaso
export function useSessionExpiry({ warningMs = 2 * 60 * 1000, onWarning }) {
  const warningTimer = useRef(null);

  useEffect(() => {
    function schedule() {
      const token = localStorage.getItem("token");
      if (!token) return;

      const expiry = getTokenExpiry(token);
      if (!expiry) return;

      const now         = Date.now();
      const timeLeft    = expiry - now;
      const warningTime = timeLeft - warningMs;

      // Limpiar timer anterior
      if (warningTimer.current) clearTimeout(warningTimer.current);

      if (warningTime > 0) {
        warningTimer.current = setTimeout(() => {
          onWarning();
        }, warningTime);
      } else if (timeLeft > 0) {
        // Ya estamos en la ventana de aviso
        onWarning();
      }
    }

    schedule();

    // Re-schedular cuando el token se renueva (el fetcher lo actualiza en localStorage)
    const interval = setInterval(schedule, 60_000);

    return () => {
      clearInterval(interval);
      if (warningTimer.current) clearTimeout(warningTimer.current);
    };
  }, [onWarning, warningMs]);
}