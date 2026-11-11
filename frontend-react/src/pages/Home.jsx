import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import ProductoModal from "../components/ProductoModal.jsx";

function Home() {
  const navegar = useNavigate();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/productos")
      .then((res) => res.json())
      .then((datos) => setProductos(datos))
      .catch(() => setError("No se pudo conectar al servidor"))
      .finally(() => setCargando(false));
  }, []);

  const destacado = productos[0];
  const catalogo = productos.slice(0, 4);

  const estadisticas = [
    { valor: cargando || error ? "—" : productos.length, etiqueta: "productos" },
    { valor: "2023", etiqueta: "desde" },
    { valor: "Huila", etiqueta: "Garzón" },
  ];

  return (
    <div className="flex flex-col gap-24">
      {/* HERO */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden pt-6">
        <span className="hidden md:block absolute -top-10 -right-4 font-display font-bold text-[280px] leading-none tracking-tighter text-gray-50 select-none pointer-events-none">
          01
        </span>

        <div className="relative max-w-xl">
          <span className="inline-flex items-center gap-2 bg-gray-100 rounded-full py-1.5 pl-2.5 pr-3 text-xs font-semibold">
            <span className="size-1.5 rounded-full bg-accent"></span>
            Tienda en línea · Garzón, Huila
          </span>

          <h1 className="font-display font-bold text-5xl md:text-6xl leading-[1.02] tracking-tighter mt-7 mb-5">
            Tecnología<br />sin ruido<span className="text-accent">.</span>
          </h1>

          <p className="text-lg text-gray-700 leading-relaxed max-w-md mb-9">
            Portátiles, celulares y componentes con precios claros y asesoría personalizada.
          </p>

          <div className="flex flex-wrap gap-3.5">
            <button
              onClick={() => navegar("/productos")}
              className="bg-ink text-paper px-7 py-3.5 rounded-card text-sm font-semibold hover:bg-accent transition-colors"
            >
              Ver productos →
            </button>
            <Link
              to="/nosotros"
              className="border border-gray-300 px-7 py-3.5 rounded-card text-sm font-semibold hover:border-ink transition-colors"
            >
              Conócenos
            </Link>
          </div>

          <div className="flex gap-10 mt-14 pt-8 border-t border-gray-100">
            {estadisticas.map((e) => (
              <div key={e.etiqueta}>
                <p className="font-display font-bold text-3xl">{e.valor}</p>
                <p className="text-sm text-gray-500">{e.etiqueta}</p>
              </div>
            ))}
          </div>
        </div>

        {destacado && (
          <div className="relative w-full max-w-md lg:w-105 shrink-0 aspect-square bg-gray-50 rounded-[20px] overflow-hidden">
            <img
              src={destacado.imagen}
              alt={destacado.nombre}
              className="w-full h-full object-cover"
            />
            <div className="absolute left-5 bottom-5 bg-paper rounded-card py-3.5 px-4 shadow-float">
              <p className="text-[11px] uppercase tracking-wider text-gray-500">Destacado</p>
              <p className="font-semibold text-sm">{destacado.nombre}</p>
              <p className="font-mono text-[13px] font-semibold text-accent mt-1">
                {destacado.precio}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* CATÁLOGO */}
      <section>
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display font-bold text-3xl tracking-tight">
            Catálogo<span className="text-accent">.</span>
          </h2>
          <Link to="/productos" className="text-sm font-semibold text-gray-700 hover:text-ink">
            Ver todos →
          </Link>
        </div>

        {cargando && <p className="text-gray-500">Cargando catálogo...</p>}
        {error && <p className="text-accent-dark">{error}</p>}
        {!cargando && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {catalogo.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                nombre={p.nombre}
                descripcion={p.descripcion}
                precio={p.precio}
                imagen={p.imagen}
                onVer={() => setSeleccionado(p)}
              />
            ))}
          </div>
        )}
      </section>

      {seleccionado && (
        <ProductoModal
          producto={seleccionado}
          onCerrar={() => setSeleccionado(null)}
        />
      )}
    </div>
  );
}

export default Home;