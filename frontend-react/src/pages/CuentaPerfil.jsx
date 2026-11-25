import useApi from "../hooks/useApi.js";

function CuentaPerfil() {
  const { datos: perfil, cargando, error } = useApi("/api/auth/perfil");

  if (cargando) return <p className="py-10 text-gray-700">Cargando tu perfil…</p>;
  if (error) return <p className="py-10 text-accent-dark">{error}</p>;

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

      <dl className="border border-gray-300 rounded-card divide-y divide-gray-200">
        {filas.map((fila) => (
          <div key={fila.etiqueta} className="flex flex-wrap justify-between gap-2 px-6 py-4">
            <dt className="text-sm text-gray-700">{fila.etiqueta}</dt>
            <dd className="text-sm font-semibold">{fila.valor}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default CuentaPerfil;
