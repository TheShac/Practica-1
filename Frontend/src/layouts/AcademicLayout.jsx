import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/navigation/Sidebar.jsx";
import Topbar from "@/components/navigation/Topbar.jsx";

export default function AcademicLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} />

      <div className="flex-grow-1 d-flex flex-column">
        <Topbar
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((v) => !v)}
        />

        <main className="flex-grow-1 p-3 p-md-4" style={{ background: "var(--bg)" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
