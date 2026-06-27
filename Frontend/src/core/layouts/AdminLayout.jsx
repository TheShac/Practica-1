import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar   from "@/shared/components/navigation/Sidebar.jsx";
import Topbar    from "@/shared/components/navigation/Topbar.jsx";
import { useMobile } from "@/shared/hooks/useMobile.js";

export default function AdminLayout() {
  const isMobile = useMobile();
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
        />
        <main className="flex-grow-1 p-3 p-md-4" style={{ background: "var(--bg)" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
