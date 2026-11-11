import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Campo, { claseInput } from "../components/Campo.jsx";

const URL_API = "http://localhost:3000/api/auth";
const URL_COLOMBIA = "https://api-colombia.com/api/v1";

const FORM_VACIO = {
  nombre: "",
  email: "",
  password: "",
  confirmar: "",
  departamento: "",
  municipio: "",
};

// Los mismos dominios que acepta el servidor
const DOMINIOS_PERMITIDOS = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com",
  "icloud.com",
  "me.com",
  "mac.com",
];

function porNombre(a, b) {
  return a.name.localeCompare(b.name);
}

function Registro() {
  const navegar = useNavigate();
  const [form, setForm] = useState(FORM_VACIO);
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState("inactivo");
  const [mensajeError, setMensajeError] = useState("");
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);

  const elegido = departamentos.find((d) => d.name === form.departamento);
  const departamentoId = elegido ? elegido.id : null;

  useEffect(() => {
    fetch(URL_COLOMBIA + "/Department")
      .then((res) => res.json())
      .then((datos) => setDepartamentos(datos.sort(porNombre)))
      .catch(() => setDepartamentos([]));
  }, []);

  useEffect(() => {
    if (!departamentoId) {
      setMunicipios([]);
      return;
    }
    let vigente = true;
    fetch(URL_COLOMBIA + "/Department/" + departamentoId + "/cities")
      .then((res) => res.json())
      .then((datos) => {
        if (vigente) setMunicipios(datos.sort(porNombre));
      })
      .catch(() => {
        if (vigente) setMunicipios([]);
      });
    return () => {
      vigente = false;
    };
  }, [departamentoId]);

  function manejarCambio(e) {
    const { name, value } = e.target;
    const nuevo = { ...form, [name]: value };
    if (name === "departamento") nuevo.municipio = "";
    setForm(nuevo);
    setErrores({ ...errores, [name]: "" });
    if (estado !== "inactivo") setEstado("inactivo");
  }

  function validar() {
    const nuevos = {};
    if (form.nombre.trim().length < 3) {
      nuevos.nombre = "Escribe tu nombre completo (mínimo 3 caracteres)";
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nuevos.email = "Escribe un correo válido, como nombre@gmail.com";
    } else {
      const dominio = form.email
        .slice(form.email.lastIndexOf("@") + 1)
        .toLowerCase();
      if (!DOMINIOS_PERMITIDOS.includes(dominio)) {
        nuevos.email = "Usa un correo de Gmail, Hotmail, Outlook, Yahoo o iCloud";
      }
    }
    if (form.password.length < 6) {
      nuevos.password = "La contraseña debe tener al menos 6 caracteres";
    }
    if (form.confirmar !== form.password) {
      nuevos.confirmar = "Las contraseñas no coinciden";
    }
    if (!form.departamento) {
      nuevos.departamento = "Selecciona un departamento";
    }
    if (!form.municipio) {
      nuevos.municipio = "Selecciona un municipio";
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
      const res = await fetch(URL_API + "/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          password: form.password,
          departamento: form.departamento,
          municipio: form.municipio,
        }),
      });
      const datos = await res.json();
      if (!res.ok) throw new Error(datos.error || "No se pudo crear la cuenta");

      navegar("/login", {
        state: { aviso: "Cuenta creada. Ya puedes iniciar sesión." },
      });
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
          Crear cuenta<span className="text-accent">.</span>
        </h1>
        <p className="text-gray-700">Regístrate para comprar en TechStore.</p>
      </section>

      <form onSubmit={manejarEnvio} noValidate className="flex flex-col gap-5">
        <Campo etiqueta="Nombre completo" nombre="nombre" error={errores.nombre}>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={form.nombre}
            onChange={manejarCambio}
            placeholder="Tu nombre y apellido"
            autoComplete="name"
            className={claseInput(errores.nombre)}
          />
        </Campo>

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
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            className={claseInput(errores.password)}
          />
        </Campo>

        <Campo etiqueta="Repite la contraseña" nombre="confirmar" error={errores.confirmar}>
          <input
            id="confirmar"
            name="confirmar"
            type="password"
            value={form.confirmar}
            onChange={manejarCambio}
            placeholder="Escríbela otra vez"
            autoComplete="new-password"
            className={claseInput(errores.confirmar)}
          />
        </Campo>

        <Campo etiqueta="Departamento" nombre="departamento" error={errores.departamento}>
          <select
            id="departamento"
            name="departamento"
            value={form.departamento}
            onChange={manejarCambio}
            className={claseInput(errores.departamento)}
          >
            <option value="">Selecciona un departamento</option>
            {departamentos.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </Campo>

        <Campo etiqueta="Municipio" nombre="municipio" error={errores.municipio}>
          <select
            id="municipio"
            name="municipio"
            value={form.municipio}
            onChange={manejarCambio}
            disabled={!form.departamento}
            className={claseInput(errores.municipio) + " disabled:opacity-50"}
          >
            <option value="">
              {form.departamento ? "Selecciona un municipio" : "Primero elige un departamento"}
            </option>
            {municipios.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        </Campo>

        <button
          type="submit"
          disabled={estado === "enviando"}
          className="bg-ink text-paper px-7 py-3.5 rounded-card text-sm font-semibold enabled:hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {estado === "enviando" ? "Creando cuenta..." : "Crear cuenta →"}
        </button>

        {estado === "error" && (
          <p role="alert" className="bg-gray-50 rounded-card p-4 text-sm font-semibold text-accent-dark">
            {mensajeError}
          </p>
        )}
      </form>

      <p className="text-sm text-gray-700">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="font-semibold underline hover:text-accent transition-colors">
          Ingresa
        </Link>
      </p>
    </div>
  );
}

export default Registro;