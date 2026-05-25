import { Navigate, Route, Routes } from "react-router-dom";
 
import Login from "@/pages/Login.jsx";
import ProtectedRoute from "@/core/auth/ProtectedRoute.jsx";
 
// ── Layouts ───────────────────────────────────────────────
import AcademicLayout   from "@/core/layouts/AcademicLayout.jsx";
import SecretariaLayout from "@/core/layouts/SecretariaLayout.jsx";
import AdminLayout      from "@/core/layouts/AdminLayout.jsx";
 
// ── Académico ─────────────────────────────────────────────
import Dashboard            from "@/features/academico/pages/Dashboard.jsx";
import Perfil               from "@/features/academico/pages/Perfil.jsx";
import Tesis                from "@/features/academico/pages/Tesis.jsx";
import Publicaciones        from "@/features/academico/pages/Publicaciones.jsx";
import Libros               from "@/features/academico/pages/Libros.jsx";
import CapLibro             from "@/features/academico/pages/CapLibro.jsx";
import Investigacion        from "@/features/academico/pages/Investigacion.jsx";
import Patente              from "@/features/academico/pages/Patente.jsx";
import ProyectoIntervencion from "@/features/academico/pages/ProyectoIntervencion.jsx";
import Consultorias         from "@/features/academico/pages/Consultorias.jsx";
 
// ── Profesional de Apoyo ──────────────────────────────────
import SecretariaDashboard      from "@/features/profesional-apoyo/pages/Dashboard.jsx";
import SecretariaFichaAcademics from "@/features/profesional-apoyo/pages/ficha/Ficha-Academicas.jsx";
import EditarFicha              from "@/features/profesional-apoyo/pages/ficha/components/EditarFicha.jsx";
import ReportesSecretaria       from "@/features/profesional-apoyo/pages/reports/ReportesSecretaria.jsx";
import Notificaciones           from "@/features/profesional-apoyo/pages/Notificaciones.jsx";
 
// ── Admin ─────────────────────────────────────────────────
import AdminDashboard from "@/features/admin/pages/Dashboard.jsx";
import AdminUsuarios  from "@/features/admin/pages/Usuarios.jsx";
import AdminRoles     from "@/features/admin/pages/Roles.jsx";

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
        <Route path="intervencion" element={<ProyectoIntervencion />} />
        <Route path="consultorias" element={<Consultorias />} />
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
        <Route path="notificaciones" element={<Notificaciones />} />
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
        <Route path="dashboard"  element={<AdminDashboard />} />
        <Route path="usuarios"   element={<AdminUsuarios />} />
        <Route path="roles"      element={<AdminRoles />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
