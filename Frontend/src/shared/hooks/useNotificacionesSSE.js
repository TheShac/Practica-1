import { useEffect, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL;

// onNotificacion recibe { notificacion_id, asunto, mensaje }
export function useNotificacionesSSE(onNotificacion) {
  const esRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let cancelled = false;

    async function connect() {
      try {
        // Solicitar un ticket de un solo uso — el JWT viaja en el header,
        // nunca en la URL ni en los logs del servidor.
        const res = await fetch(`${API_URL}/auth/sse-ticket`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        if (!res.ok || cancelled) return;
        const { ticket } = await res.json();

        const es = new EventSource(`${API_URL}/notificaciones/stream?ticket=${ticket}`);
        if (cancelled) { es.close(); return; }
        esRef.current = es;

        es.addEventListener("notificacion", (e) => {
          try {
            const data = JSON.parse(e.data);
            onNotificacion(data);
          } catch {}
        });

        es.onerror = () => {
          // EventSource reintenta automáticamente
        };
      } catch {}
    }

    connect();

    return () => {
      cancelled = true;
      esRef.current?.close();
      esRef.current = null;
    };
  }, []); // Solo se monta una vez con el layout
}