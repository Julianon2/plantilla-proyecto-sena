import { useState } from "react";
import useApi from "../hooks/useApi.js";
import FormPerfil from "../components/FormPerfil.jsx";

function CuentaPerfil() {
  const { datos, cargando, error } = useApi("/api/auth/perfil");
  const [guardado, setGuardado] = useState(null); // los datos nuevos, después de guardar
  const [editando, setEditando] = useState(false);

  if (cargando) return <p className="py-10 text-gray-700">Cargando tu perfil…</p>;
  if (error) return <p className="py-10 text-accent-dark">{error}</p>;

  // Si ya se guardaron cambios, se muestran esos; si no, los que llegaron del servidor
  const perfil = guardado || datos;

  // Cada fila del perfil: una etiqueta y su valor
  const filas = [
    { etiqueta: "Nombre", valor: perfil.nombre },
    { etiqueta: "Correo", valor: perfil.email },
    { etiqueta: "Departamento", valor: perfil.departamento || "No registrado" },
    { etiqueta: "Municipio", valor: perfil.municipio || "No registrado" },
    { etiqueta: "Tipo de cuenta", valor: perfil.rol === "admin" ? "Administrador" : "Cliente" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500">Perfil</p>
        <h1 className="font-display font-bold text-4xl tracking-tighter mt-3">
          Mi perfil<span className="text-accent">.</span>
        </h1>
      </header>

      <div className="border border-gray-300 rounded-card p-6 flex items-center gap-5">
        <span className="size-16 rounded-full bg-ink text-paper grid place-items-center font-display font-bold text-2xl">
          {perfil.nombre.charAt(0).toUpperCase()}
        </span>
        <div>
          <p className="font-display font-bold text-xl">{perfil.nombre}</p>
          <p className="text-sm text-gray-700">{perfil.email}</p>
        </div>
      </div>

      {guardado && !editando && (
        <p role="status" className="bg-gray-50 rounded-card p-4 text-sm font-semibold">
          Tus datos se guardaron.
        </p>
      )}

      {editando ? (
        <FormPerfil
          perfil={perfil}
          onGuardado={(nuevos) => {
            setGuardado(nuevos);
            setEditando(false);
          }}
          onCancelar={() => setEditando(false)}
        />
      ) : (
        <>
          <dl className="border border-gray-300 rounded-card divide-y divide-gray-200">
            {filas.map((fila) => (
              <div key={fila.etiqueta} className="flex flex-wrap justify-between gap-2 px-6 py-4">
                <dt className="text-sm text-gray-700">{fila.etiqueta}</dt>
                <dd className="text-sm font-semibold">{fila.valor}</dd>
              </div>
            ))}
          </dl>
          <button
            onClick={() => setEditando(true)}
            className="self-start bg-ink text-paper px-6 py-3 rounded-card text-sm font-semibold hover:bg-accent transition-colors"
          >
            Editar mis datos
          </button>
        </>
      )}
    </div>
  );
}

export default CuentaPerfil;
