import { useState } from "react";
import Campo, { claseInput } from "./Campo.jsx";

const URL_API = "http://localhost:3000/api/contacto";

const FORM_VACIO = {
  nombre: "",
  email: "",
  telefono: "",
  asunto: "",
  mensaje: "",
};

const datosContacto = [
  { titulo: "Dirección", lineas: ["Calle 7 # 8-30", "Garzón, Huila, Colombia"] },
  { titulo: "Teléfono", lineas: ["300 000 0000", "8 am – 6 pm · Lun a Sáb"] },
  { titulo: "Correo", lineas: ["info@miproyecto.co"] },
];

function Contacto() {
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
    if (form.nombre.trim().length < 3) {
      nuevos.nombre = "Escribe tu nombre completo (mínimo 3 caracteres)";
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nuevos.email = "Escribe un correo válido, como nombre@correo.com";
    }
    if (form.telefono && !/^\d{7,10}$/.test(form.telefono)) {
      nuevos.telefono = "Solo números, entre 7 y 10 dígitos";
    }
    if (!form.asunto) {
      nuevos.asunto = "Selecciona un asunto";
    }
    if (form.mensaje.trim().length < 10) {
      nuevos.mensaje = "El mensaje debe tener al menos 10 caracteres";
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
      const res = await fetch(URL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const datos = await res.json();
      if (!res.ok) throw new Error(datos.error || "No se pudo enviar el mensaje");

      setForm(FORM_VACIO);
      setEstado("exito");
    } catch (err) {
      setMensajeError(
        err instanceof TypeError ? "No se pudo conectar al servidor" : err.message,
      );
      setEstado("error");
    }
  }

  return (
    <div className="flex flex-col gap-16">
      <section className="max-w-2xl pt-6">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
          Contacto
        </p>
        <h1 className="font-display font-bold text-5xl tracking-tighter mt-4 mb-6">
          Hablemos<span className="text-accent">.</span>
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          Estamos para ayudarte. Escríbenos y te respondemos pronto.
        </p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <form
          onSubmit={manejarEnvio}
          noValidate
          className="lg:col-span-2 flex flex-col gap-5"
        >
          <Campo etiqueta="Nombre completo *" nombre="nombre" error={errores.nombre}>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={form.nombre}
              onChange={manejarCambio}
              placeholder="Tu nombre y apellido"
              className={claseInput(errores.nombre)}
            />
          </Campo>

          <Campo etiqueta="Correo electrónico *" nombre="email" error={errores.email}>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={manejarCambio}
              placeholder="tucorreo@ejemplo.com"
              className={claseInput(errores.email)}
            />
          </Campo>

          <Campo etiqueta="Teléfono (opcional)" nombre="telefono" error={errores.telefono}>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              value={form.telefono}
              onChange={manejarCambio}
              placeholder="3001234567"
              className={claseInput(errores.telefono)}
            />
          </Campo>

          <Campo etiqueta="Asunto *" nombre="asunto" error={errores.asunto}>
            <select
              id="asunto"
              name="asunto"
              value={form.asunto}
              onChange={manejarCambio}
              className={claseInput(errores.asunto)}
            >
              <option value="">Selecciona un asunto</option>
              <option value="consulta">Consulta general</option>
              <option value="pedido">Pedido / compra</option>
              <option value="soporte">Soporte técnico</option>
              <option value="otro">Otro</option>
            </select>
          </Campo>

          <Campo etiqueta="Mensaje *" nombre="mensaje" error={errores.mensaje}>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={5}
              value={form.mensaje}
              onChange={manejarCambio}
              placeholder="Escribe tu mensaje aquí..."
              className={claseInput(errores.mensaje)}
            />
          </Campo>

          <button
            type="submit"
            disabled={estado === "enviando"}
            className="self-start bg-ink text-paper px-7 py-3.5 rounded-card text-sm font-semibold enabled:hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {estado === "enviando" ? "Enviando..." : "Enviar mensaje →"}
          </button>

          {estado === "exito" && (
            <p role="status" className="bg-gray-50 rounded-card p-4 text-sm font-semibold">
              Mensaje enviado. Te contactaremos pronto.
            </p>
          )}
          {estado === "error" && (
            <p role="alert" className="bg-gray-50 rounded-card p-4 text-sm font-semibold text-accent-dark">
              {mensajeError}
            </p>
          )}
        </form>

        <aside className="flex flex-col gap-8">
          {datosContacto.map((dato) => (
            <div key={dato.titulo}>
              <h2 className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">
                {dato.titulo}
              </h2>
              {dato.lineas.map((linea) => (
                <p key={linea} className="text-sm text-gray-700">
                  {linea}
                </p>
              ))}
            </div>
          ))}
        </aside>
      </section>
    </div>
  );
}

export default Contacto;