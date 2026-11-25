import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import useEnviar from "../hooks/useEnviar.js";
import useColombia from "../hooks/useColombia.js";
import Campo, { claseInput } from "./Campo.jsx";

function FormPerfil({ perfil, onGuardado, onCancelar }) {
  const { actualizarNombre } = useContext(AuthContext);
  const enviar = useEnviar();
  // El formulario empieza con los datos que ya tiene la persona
  const [form, setForm] = useState({
    nombre: perfil.nombre,
    departamento: perfil.departamento || "",
    municipio: perfil.municipio || "",
  });
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const { departamentos, municipios } = useColombia(form.departamento);

  function manejarCambio(e) {
    const { name, value } = e.target;
    const nuevo = { ...form, [name]: value };
    if (name === "departamento") nuevo.municipio = "";
    setForm(nuevo);
    setErrores({ ...errores, [name]: "" });
    setMensajeError("");
  }

  function validar() {
    const nuevos = {};
    if (form.nombre.trim().length < 3) {
      nuevos.nombre = "Escribe tu nombre completo (mínimo 3 caracteres)";
    }
    if (!form.departamento) nuevos.departamento = "Selecciona un departamento";
    if (!form.municipio) nuevos.municipio = "Selecciona un municipio";
    return nuevos;
  }

  async function manejarEnvio(e) {
    e.preventDefault();
    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    setGuardando(true);
    try {
      const resultado = await enviar("/api/auth/perfil", form);
      if (!resultado) return; // la sesión venció: el hook ya mandó a ingresar
      if (!resultado.ok) {
        setMensajeError(resultado.datos.error || "No se pudieron guardar los datos");
        setGuardando(false);
        return;
      }
      actualizarNombre(resultado.datos.nombre);
      onGuardado(resultado.datos);
    } catch {
      setMensajeError("No se pudo conectar al servidor");
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={manejarEnvio} noValidate className="border border-gray-300 rounded-card p-6 flex flex-col gap-5">
      <Campo etiqueta="Nombre completo" nombre="nombre" error={errores.nombre}>
        <input
          id="nombre"
          name="nombre"
          type="text"
          value={form.nombre}
          onChange={manejarCambio}
          className={claseInput(errores.nombre)}
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
          <option value="">Selecciona un municipio</option>
          {municipios.map((m) => (
            <option key={m.id} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>
      </Campo>

      <p className="text-xs text-gray-500">
        El correo ({perfil.email}) es tu usuario para ingresar y no se puede cambiar.
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={guardando}
          className="bg-ink text-paper px-6 py-3 rounded-card text-sm font-semibold enabled:hover:bg-accent transition-colors disabled:opacity-50"
        >
          {guardando ? "Guardando…" : "Guardar cambios"}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="px-6 py-3 rounded-card text-sm font-semibold border border-gray-300 hover:border-ink transition-colors"
        >
          Cancelar
        </button>
      </div>

      {mensajeError && (
        <p role="alert" className="text-sm font-semibold text-accent-dark">
          {mensajeError}
        </p>
      )}
    </form>
  );
}

export default FormPerfil;
