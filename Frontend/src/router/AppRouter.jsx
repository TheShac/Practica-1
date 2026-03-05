import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login.jsx";

import ProtectedRoute from "../components/ProtectedRoute.jsx";

// Académico
import AcademicLayout from "../layouts/AcademicLayout.jsx";
import Dashboard from "../pages/academico/Dashboard.jsx";
import Perfil from "../pages/academico/Perfil.jsx";
import Tesis from "../pages/academico/Tesis.jsx";
import Publicaciones from "../pages/academico/Publicaciones.jsx";
import Libros from "../pages/academico/Libros.jsx";
import CapLibro from "../pages/academico/CapLibro.jsx";
import Investigacion from "../pages/academico/Investigacion.jsx";
import Patente from "../pages/academico/Patente.jsx";

// Secretaria
import SecretariaLayout from "../layouts/SecretariaLayout.jsx";
import SecretariaDashboard from "../pages/secretaria/Dashboard.jsx";
import SecretariaFichaAcademics from "../pages/secretaria/ficha/Ficha-Academicas.jsx";
import EditarFicha from "../pages/secretaria/ficha/components/EditarFicha.jsx";
import ReportesSecretaria from "../pages/secretaria/reports/ReportesSecretaria.jsx";

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
        <Route path="tesis/:nivel" element={<Tesis />} />
        <Route path="publicaciones" element={<Publicaciones />} />
        <Route path="libros" element={<Libros />} />
        <Route path="cap-libro" element={<CapLibro />} />
        <Route path="investigacion" element={<Investigacion />} />
        <Route path="patentes" element={<Patente />} />
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
        <Route path="ficha-academicas" element={<SecretariaFichaAcademics />} />
        <Route path="ficha/:usuarioId/editar" element={<EditarFicha />} />
        <Route path="reportes" element={<ReportesSecretaria />} />
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
