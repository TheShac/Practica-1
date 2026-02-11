import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import AcademicLayout from "./layouts/AcademicLayout.jsx";

import Dashboard from "./pages/academico/Dashboard.jsx";
import Perfil from "./pages/academico/Perfil.jsx";
import Tesis from "./pages/academico/Tesis.jsx";
import Publicaciones from "./pages/academico/Publicaciones.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Layout académico */}
      <Route path="/academico" element={<AcademicLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="tesis" element={<Tesis />} />
        <Route path="publicaciones" element={<Publicaciones />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
