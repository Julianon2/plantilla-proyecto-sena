import { useState, useEffect } from "react";
import ProductCard from "./ProductCard.jsx";
import ProductoModal from "./ProductoModal.jsx";

function precioNumero(p) {
  return Number(p.precio.replace(/\D/g, ""));
}

function Productos() {
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [seleccionado, setSeleccionado] = useState(null);
  const [orden, setOrden] = useState("original");

  function cargarProductos() {
    setCargando(true);
    setError(null);
    fetch("http://localhost:3000/api/productos")
      .then((res) => res.json())
      .then((datos) => setProductos(datos))
      .catch(() => setError("No se pudo conectar al servidor"))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const ordenados = [...filtrados];
  if (orden === "menor") {
    ordenados.sort((a, b) => precioNumero(a) - precioNumero(b));
  }
  if (orden === "mayor") {
    ordenados.sort((a, b) => precioNumero(b) - precioNumero(a));
  }
  if (orden === "nombre") {
    ordenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-card focus:outline-none focus:border-ink"
        />
        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-card bg-paper text-sm focus:outline-none focus:border-ink"
        >
          <option value="original">Orden original</option>
          <option value="menor">Menor precio</option>
          <option value="mayor">Mayor precio</option>
          <option value="nombre">Nombre A–Z</option>
        </select>
        {busqueda && (
          <p className="text-sm text-gray-500 whitespace-nowrap">
            {filtrados.length} {filtrados.length === 1 ? "resultado" : "resultados"}
          </p>
        )}
      </div>
      {cargando && <p className="text-center py-10">Cargando productos...</p>}
      {error && <p className="text-center text-accent-dark py-10">{error}</p>}
      {!cargando && !error && (
        <section className="grid grid-cols-1 sm:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ordenados.map((p) => (
            <ProductCard
              key={p.id}
              nombre={p.nombre}
              descripcion={p.descripcion}
              precio={p.precio}
              imagen={p.imagen}
              id={p.id}
              onVer={() => setSeleccionado(p)}
            />
          ))}
        </section>
      )}
      {!cargando && !error && filtrados.length === 0 && (
        <p className="text-center text-gray-500 py-10">
          No se encontraron productos con ese nombre.
        </p>
      )}

      {seleccionado && (
        <ProductoModal
          producto={seleccionado}
          onCerrar={() => setSeleccionado(null)}
        />
      )}
    </div>
  );
}

export default Productos;