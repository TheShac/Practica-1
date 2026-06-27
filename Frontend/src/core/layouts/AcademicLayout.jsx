import { useState, useCallback, useEffect } from "react";
import { Outlet, useNavigate }              from "react-router-dom";
import Sidebar            from "@/shared/components/navigation/Sidebar.jsx";
import Topbar             from "@/shared/components/navigation/Topbar.jsx";
import { useMobile }      from "@/shared/hooks/useMobile.js";
import Toast              from "@/shared/components/ui/feedback/Toast.jsx";
import SessionExpiryModal from "@/shared/components/modals/SessionExpiryModal.jsx";
import { useNotificacionesSSE }                         from "@/shared/hooks/useNotificacionesSSE.js";
import { NotificacionProvider, useNotificacionContext } from "@/shared/context/NotificacionContext.jsx";
import { useSessionExpiry }                             from "@/shared/hooks/useSessionExpiry.js";
import { getCountNoLeidas }                             from "@/features/academico/services/notificacion.service.js";
import { logoutRequest }                                from "@/core/auth/auth.service.js";

const API_URL = import.meta.env.VITE_API_URL;

async function tryRefresh() {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST", credentials: "include",
    });
    if (!res.ok) return false;
    const { token } = await res.json();
    localStorage.setItem("token", token);
    return true;
  } catch { return false; }
}

function LayoutInner() {
  const isMobile                        = useMobile();
  const [collapsed, setCollapsed]       = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [toast, setToast]               = useState({ show: false, asunto: "", mensaje: "" });
  const [noLeidas, setNoLeidas]         = useState(0);
  const [showExpiry, setShowExpiry]     = useState(false);
  const { pushNotificacion }            = useNotificacionContext();
  const navigate                        = useNavigate();

  // Cargar count inicial
  useEffect(() => {
    getCountNoLeidas()
      .then((res) => setNoLeidas(res.count ?? 0))
      .catch(() => {});
  }, []);

  // Aviso 2 minutos antes de expirar
  const handleWarning = useCallback(() => {
    setShowExpiry(true);
  }, []);

  useSessionExpiry({ warningMs: 2 * 60 * 1000, onWarning: handleWarning });

  // Renovar sesión desde el modal
  const handleRenew = async () => {
    const ok = await tryRefresh();
    if (ok) {
      setShowExpiry(false);
    } else {
      handleLogout();
    }
  };

  const handleLogout = async () => {
    try { await logoutRequest(); } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/", { replace: true });
  };

  const handleNotificacion = useCallback((data) => {
    setToast({ show: true, asunto: data.asunto, mensaje: data.mensaje });
    setNoLeidas((prev) => prev + 1);
    pushNotificacion(data);
  }, [pushNotificacion]);

  useNotificacionesSSE(handleNotificacion);

  const handleBellClick = () => {
    setNoLeidas(0);
    navigate("/academico/dashboard");
  };

  const handleToggleSidebar = () => {
    if (isMobile) setMobileOpen((v) => !v);
    else setCollapsed((v) => !v);
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        <Topbar
          collapsed={collapsed}
          onToggleSidebar={handleToggleSidebar}
          noLeidas={noLeidas}
          onBellClick={handleBellClick}
        />
        <main className="flex-grow-1 p-3 p-md-4" style={{ background: "var(--bg)" }}>
          <Outlet />
        </main>
      </div>

      <Toast
        show={toast.show}
        message={`📬 ${toast.asunto}${toast.mensaje ? ` — ${toast.mensaje.slice(0, 60)}${toast.mensaje.length > 60 ? "…" : ""}` : ""}`}
        type="success"
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />

      <SessionExpiryModal
        show={showExpiry}
        onRenew={handleRenew}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default function AcademicLayout() {
  return (
    <NotificacionProvider>
      <LayoutInner />
    </NotificacionProvider>
  );
}