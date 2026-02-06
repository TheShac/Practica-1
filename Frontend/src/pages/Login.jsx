import { useState } from "react";
import "../styles/login.css";

export default function Login() {
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // EJEMPLO: llamada al backend
    const res = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ rut, password }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message || "Error al iniciar sesión");

    alert("Login OK");
    // aquí podrías navegar a /dashboard
  };

  const handleGoogleLogin = () => {
    // Redirige al backend para OAuth con Google
    window.location.href = "http://localhost:4000/api/auth/google";
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* IZQUIERDA */}
        <section className="login-left">
          <div className="logo-wrap">
            {/* tu logo arriba */}
            <img
              className="top-logo"
              src="/assets/logo-uta.png"
              alt="Logo"
            />
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="label">Rut*</label>
            <input
              className="input"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              placeholder="20.216.446-3"
              autoComplete="username"
            />

            <label className="label">Clave*</label>
            <div className="password-row">
              <input
                className="input"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="************"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="icon-btn"
                onClick={() => setShowPass((v) => !v)}
                aria-label="Mostrar/ocultar clave"
                title="Mostrar/ocultar clave"
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>

            <a className="forgot" href="/recuperar">
              ¿Olvidó su clave?
            </a>

            <button className="btn btn-primary" type="submit">
              Iniciar sesión
            </button>

            <div className="divider">
              <span>o iniciar sesión con</span>
            </div>

            <button
              className="btn btn-google"
              type="button"
              onClick={handleGoogleLogin}
            >
              Gmail Institucional
            </button>

            {/* si quieres un segundo botón azul como en la imagen */}
            <button className="btn btn-secondary" type="button">
              Iniciar sesión
            </button>
          </form>
        </section>

        {/* DERECHA */}
        <aside className="login-right">
          <h3 className="right-title">Plataformas de Apoyo a la Docencia</h3>

          <div className="right-logos">
            <img className="right-logo" src="/assets/dido.png" alt="DIDO" />
            <img className="right-logo" src="/assets/utamed.png" alt="UTA med" />
          </div>

          <hr className="hr" />

          <h4 className="right-subtitle">Política de Privacidad</h4>
          <p className="right-text">
            Conoce las políticas de privacidad del sitio web de la Universidad de Tarapacá.
            <a className="right-link" href="/privacidad"> Leer más</a>
          </p>

          <hr className="hr" />

          <h4 className="right-subtitle">Solicita Ayuda</h4>
          <p className="right-text">
            <strong>Correo:</strong>{" "}
            <a className="right-link" href="/contactos">Ver Contactos</a>
          </p>
          <p className="right-text">
            <strong>Horario:</strong> Lunes a Jueves 08:30AM - 05:30PM <br />
            Viernes 08:30AM - 04:30PM
          </p>
        </aside>
      </div>
    </div>
  );
}
