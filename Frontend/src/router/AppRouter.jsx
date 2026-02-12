import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login.jsx";

import ProtectedRoute from "../components/ProtectedRoute.jsx";

// Académico
import AcademicLayout from "../layouts/AcademicLayout.jsx";
import Dashboard from "../pages/academico/Dashboard.jsx";
import Perfil from "../pages/academico/Perfil.jsx";
import Tesis from "../pages/academico/Tesis.jsx";
import Publicaciones from "../pages/academico/Publicaciones.jsx";

// Secretaria (placeholder)
import SecretariaLayout from "../layouts/SecretariaLayout.jsx";
import SecretariaDashboard from "../pages/secretaria/Dashboard.jsx";

// Admin (placeholder)
import AdminLayout from "../layouts/AdminLayout.jsx";
import AdminDashboard from "../pages/admin/Dashboard.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* ACADEMICO */}
      <Route
        path="/academico"
        element={
          <ProtectedRoute>
            <AcademicLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="tesis" element={<Tesis />} />
        <Route path="publicaciones" element={<Publicaciones />} />
      </Route>

      {/* SECRETARIA */}
      <Route
        path="/secretaria"
        element={
          <ProtectedRoute>
            <SecretariaLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SecretariaDashboard />} />
      </Route>

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
