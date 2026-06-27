import { createContext, useContext, useState, useCallback } from "react";

const NotificacionContext = createContext(null);

export function NotificacionProvider({ children }) {
  const [nuevaNotif, setNuevaNotif] = useState(null);

  const pushNotificacion = useCallback((notif) => {
    setNuevaNotif(notif);
  }, []);

  return (
    <NotificacionContext.Provider value={{ nuevaNotif, pushNotificacion }}>
      {children}
    </NotificacionContext.Provider>
  );
}

export function useNotificacionContext() {
  return useContext(NotificacionContext);
}