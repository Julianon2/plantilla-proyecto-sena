import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext.jsx";
import Campo, { claseInput } from "./Campo.jsx";

const URL_API = "http://localhost:3000/api/auth";

const FORM_VACIO = { email: "", password: "" };

function Login() {
  const { login } = useContext(AuthContext);
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const aviso = ubicacion.state ? ubicacion.state.aviso : null;
  const destino = ubicacion.state ? ubicacion.state.desde : null;
  const [form, setForm] = useState(FORM_VACIO);
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState("inactivo");
  const [mensajeError, setMensajeError] = useState("");

  function manejarCambio(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrores({ ...errores, [e.target.name]: "" });
    if (estado !== "inactivo") setEstado("inactivo");
  }

  function validar() {
    const nuevos = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nuevos.email = "Escribe un correo válido, como nombre@correo.com";
    }
    if (!form.password) {
      nuevos.password = "Escribe tu contraseña";
    }
    return nuevos;
  }

  async function manejarEnvio(e) {
    e.preventDefault();

    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    setEstado("enviando");
    try {
      const res = await fetch(URL_API + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const datos = await res.json();
      if (!res.ok) throw new Error(datos.error || "No se pudo iniciar sesión");

      login(datos.nombre, datos.token, datos.rol);
      navegar(destino || "/");
    } catch (err) {
      setMensajeError(
        err instanceof TypeError ? "No se pudo conectar al servidor" : err.message,
      );
      setEstado("error");
    }
  }

  return (
    <div className="max-w-md mx-auto flex flex-col gap-8 pt-6">
      <section>
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
          Cuenta
        </p>
        <h1 className="font-display font-bold text-5xl tracking-tighter mt-4 mb-3">
          Ingresar<span className="text-accent">.</span>
        </h1>
        <p className="text-gray-700">Entra con tu correo y tu contraseña.</p>
      </section>

      {aviso && (
        <p role="status" className="bg-gray-50 rounded-card p-4 text-sm font-semibold">
          {aviso}
        </p>
      )}

      <form onSubmit={manejarEnvio} noValidate className="flex flex-col gap-5">
        <Campo etiqueta="Correo electrónico" nombre="email" error={errores.email}>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={manejarCambio}
            placeholder="tucorreo@ejemplo.com"
            autoComplete="email"
            className={claseInput(errores.email)}
          />
        </Campo>

        <Campo etiqueta="Contraseña" nombre="password" error={errores.password}>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={manejarCambio}
            placeholder="Tu contraseña"
            autoComplete="current-password"
            className={claseInput(errores.password)}
          />
        </Campo>

        <button
          type="submit"
          disabled={estado === "enviando"}
          className="bg-ink text-paper px-7 py-3.5 rounded-card text-sm font-semibold enabled:hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {estado === "enviando" ? "Entrando..." : "Entrar →"}
        </button>

        {estado === "error" && (
          <p role="alert" className="bg-gray-50 rounded-card p-4 text-sm font-semibold text-accent-dark">
            {mensajeError}
          </p>
        )}
      </form>

      <p className="text-sm text-gray-700">
        ¿No tienes cuenta?{" "}
        <Link to="/registro" className="font-semibold underline hover:text-accent transition-colors">
          Regístrate
        </Link>
      </p>
    </div>
  );
}

export default Login;