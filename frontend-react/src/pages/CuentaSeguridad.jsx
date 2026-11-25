import { useState } from "react";
import useEnviar from "../hooks/useEnviar.js";
import Campo, { claseInput } from "../components/Campo.jsx";

const FORM_VACIO = { actual: "", nueva: "", confirmar: "" };

function CuentaSeguridad() {
  const enviar = useEnviar();
  const [form, setForm] = useState(FORM_VACIO);
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState("inactivo"); // inactivo | enviando | listo | error
  const [mensaje, setMensaje] = useState("");

  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrores({ ...errores, [name]: "" });
    if (estado !== "inactivo") setEstado("inactivo");
  }

  function validar() {
    const nuevos = {};
    if (!form.actual) nuevos.actual = "Escribe tu contraseña actual";
    if (form.nueva.length < 6) {
      nuevos.nueva = "La nueva contraseña debe tener al menos 6 caracteres";
    } else if (form.nueva === form.actual) {
      nuevos.nueva = "La nueva contraseña debe ser distinta de la actual";
    }
    if (form.confirmar !== form.nueva) nuevos.confirmar = "Las contraseñas no coinciden";
    return nuevos;
  }

  async function manejarEnvio(e) {
    e.preventDefault();
    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    setEstado("enviando");
    try {
      // La confirmación no se envía: solo sirve para que la persona no se equivoque
      const resultado = await enviar("/api/auth/password", {
        actual: form.actual,
        nueva: form.nueva,
      });
      if (!resultado) return;
      if (!resultado.ok) {
        setMensaje(resultado.datos.error || "No se pudo cambiar la contraseña");
        setEstado("error");
        return;
      }
      setForm(FORM_VACIO);
      setMensaje("Tu contraseña se cambió. Úsala la próxima vez que ingreses.");
      setEstado("listo");
    } catch {
      setMensaje("No se pudo conectar al servidor");
      setEstado("error");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500">Seguridad</p>
        <h1 className="font-display font-bold text-4xl tracking-tighter mt-3">
          Cambiar contraseña<span className="text-accent">.</span>
        </h1>
      </header>

      <form onSubmit={manejarEnvio} noValidate className="max-w-md flex flex-col gap-5">
        <Campo etiqueta="Contraseña actual" nombre="actual" error={errores.actual}>
          <input
            id="actual"
            name="actual"
            type="password"
            value={form.actual}
            onChange={manejarCambio}
            autoComplete="current-password"
            className={claseInput(errores.actual)}
          />
        </Campo>

        <Campo etiqueta="Nueva contraseña" nombre="nueva" error={errores.nueva}>
          <input
            id="nueva"
            name="nueva"
            type="password"
            value={form.nueva}
            onChange={manejarCambio}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            className={claseInput(errores.nueva)}
          />
        </Campo>

        <Campo etiqueta="Repite la nueva contraseña" nombre="confirmar" error={errores.confirmar}>
          <input
            id="confirmar"
            name="confirmar"
            type="password"
            value={form.confirmar}
            onChange={manejarCambio}
            autoComplete="new-password"
            className={claseInput(errores.confirmar)}
          />
        </Campo>

        <button
          type="submit"
          disabled={estado === "enviando"}
          className="self-start bg-ink text-paper px-6 py-3 rounded-card text-sm font-semibold enabled:hover:bg-accent transition-colors disabled:opacity-50"
        >
          {estado === "enviando" ? "Guardando…" : "Cambiar contraseña"}
        </button>

        {estado === "listo" && (
          <p role="status" className="bg-gray-50 rounded-card p-4 text-sm font-semibold">
            {mensaje}
          </p>
        )}
        {estado === "error" && (
          <p role="alert" className="bg-gray-50 rounded-card p-4 text-sm font-semibold text-accent-dark">
            {mensaje}
          </p>
        )}
      </form>
    </div>
  );
}

export default CuentaSeguridad;
