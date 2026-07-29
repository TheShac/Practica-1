import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { meRequest } from "@/core/auth/auth.service.js";

const redirectByRole = (navigate, rol) => {
  if (rol === "Admin") return navigate("/admin/dashboard", { replace: true });
  if (rol === "Secretaria") return navigate("/secretaria/dashboard", { replace: true });
  return navigate("/academico/dashboard", { replace: true });
};

export default function GoogleSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const yaEjecutado = useRef(false);

  useEffect(() => {
    if (yaEjecutado.current) return;
    yaEjecutado.current = true;

    const token = searchParams.get("token");

    if (!token) {
      navigate("/?error=google", { replace: true });
      return;
    }

    localStorage.setItem("token", token);

    meRequest()
      .then(({ user }) => {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", user.rol?.toLowerCase() || "");
        redirectByRole(navigate, user.rol);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/?error=google", { replace: true });
      });
  }, [searchParams, navigate]);

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: "var(--bg)", color: "var(--muted)" }}
    >
      <p>Iniciando sesión con Google...</p>
    </div>
  );
}