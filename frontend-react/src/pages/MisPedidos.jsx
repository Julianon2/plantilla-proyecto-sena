import { Link } from "react-router-dom";
import useApi from "../hooks/useApi.js";
import TimelinePedido, { textoEstado } from "../components/TimelinePedido.jsx";
import { formatearPrecio } from "../utils/precio.js";

function MisPedidos() {
  const { datos: pedidos, cargando, error } = useApi("/api/ordenes");

  if (cargando) {
    return <p className="py-16 text-center text-gray-700">Cargando tus pedidos…</p>;
  }

  if (error) {
    return <p className="py-16 text-center text-accent-dark">{error}</p>;
  }

  if (pedidos.length === 0) {
    return (
      <section className="max-w-md mx-auto text-center flex flex-col items-center gap-5 py-16">
        <h1 className="font-display font-bold text-4xl tracking-tighter">
          Todavía no tienes pedidos<span className="text-accent">.</span>
        </h1>
        <p className="text-gray-700">Cuando pagues una compra, aparecerá aquí.</p>
        <Link
          to="/productos"
          className="bg-ink text-paper px-6 py-3 rounded-card text-sm font-semibold hover:bg-accent transition-colors"
        >
          Ver productos
        </Link>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <section>
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500">Cuenta</p>
        <h1 className="font-display font-bold text-5xl tracking-tighter mt-4">
          Mis pedidos<span className="text-accent">.</span>
        </h1>
      </section>

      <div className="flex flex-col gap-6">
        {pedidos.map((pedido) => (
          <article
            key={pedido._id}
            className="border border-gray-300 rounded-card p-6 flex flex-col gap-6"
          >
            <header className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
                  Pedido #{pedido._id.slice(-6).toUpperCase()}
                </p>
                <p className="text-sm text-gray-700">
                  {new Date(pedido.createdAt).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <span className="bg-gray-100 text-ink text-xs font-semibold px-3 py-1 rounded-full">
                {textoEstado(pedido.estado)}
              </span>
            </header>

            <TimelinePedido estado={pedido.estado} />

            <ul className="flex flex-col divide-y divide-gray-200">
              {pedido.productos.map((linea) => (
                <li key={linea._id} className="flex items-center gap-4 py-3">
                  {linea.producto && (
                    <img
                      src={linea.producto.imagen}
                      alt={linea.producto.nombre}
                      className="size-14 rounded-card object-cover bg-gray-100"
                    />
                  )}
                  <span className="flex-1 text-sm">
                    {linea.producto ? linea.producto.nombre : "Producto que ya no existe"}
                  </span>
                  <span className="font-mono text-sm text-gray-700">× {linea.cantidad}</span>
                </li>
              ))}
            </ul>

            <p className="text-right font-mono font-bold">Total {formatearPrecio(pedido.total)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default MisPedidos;
