import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { precioANumero, formatearPrecio } from "../utils/precio.js";

function Carrito() {
  const { items, cambiarCantidad, quitarDelCarrito, vaciarCarrito } =
    useContext(CartContext);
  const { usuario } = useContext(AuthContext);
  const navegar = useNavigate();
  const [confirmando, setConfirmando] = useState(false);

  const unidades = items.reduce((suma, item) => suma + item.cantidad, 0);
  const total = items.reduce(
    (suma, item) => suma + precioANumero(item.precio) * item.cantidad,
    0,
  );

  function irAIngresar() {
    navegar("/login", {
      state: { aviso: "Inicia sesión para continuar con tu compra", desde: "/carrito" },
    });
  }

  if (items.length === 0) {
    return (
      <section className="max-w-md mx-auto text-center flex flex-col items-center gap-5 py-16">
        <h1 className="font-display font-bold text-4xl tracking-tighter">
          Tu carrito está vacío<span className="text-accent">.</span>
        </h1>
        <p className="text-gray-700">Agrega productos desde el catálogo y aparecerán aquí.</p>
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
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500">Compra</p>
        <h1 className="font-display font-bold text-5xl tracking-tighter mt-4">
          Tu carrito<span className="text-accent">.</span>
        </h1>
      </section>

      <div className="grid lg:grid-cols-[1fr_320px] gap-10 items-start">
        <ul className="flex flex-col divide-y divide-gray-300">
          {items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center gap-4 py-5">
              <img
                src={item.imagen}
                alt={item.nombre}
                className="size-20 rounded-card object-cover bg-gray-100"
              />
              <div className="flex-1 min-w-40">
                <p className="font-semibold">{item.nombre}</p>
                <p className="font-mono text-sm text-gray-700">{item.precio}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => cambiarCantidad(item.id, -1)}
                  disabled={item.cantidad === 1}
                  aria-label={"Quitar una unidad de " + item.nombre}
                  className="size-8 rounded-full border border-gray-300 hover:border-ink disabled:opacity-30 disabled:hover:border-gray-300"
                >
                  −
                </button>
                <span className="font-mono w-6 text-center">{item.cantidad}</span>
                <button
                  onClick={() => cambiarCantidad(item.id, 1)}
                  aria-label={"Agregar una unidad de " + item.nombre}
                  className="size-8 rounded-full border border-gray-300 hover:border-ink"
                >
                  +
                </button>
              </div>

              <div className="text-right min-w-28">
                <p className="font-mono font-bold">
                  {formatearPrecio(precioANumero(item.precio) * item.cantidad)}
                </p>
                <button
                  onClick={() => quitarDelCarrito(item.id)}
                  className="text-xs text-accent-dark underline"
                >
                  Quitar
                </button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="bg-gray-50 rounded-card p-6 flex flex-col gap-4">
          <h2 className="font-display font-bold text-xl">Resumen</h2>
          <div className="flex justify-between text-sm text-gray-700">
            <span>Unidades</span>
            <span className="font-mono">{unidades}</span>
          </div>
          <div className="flex justify-between items-baseline border-t border-gray-300 pt-4">
            <span className="font-semibold">Total</span>
            <span className="font-mono text-2xl font-bold">{formatearPrecio(total)}</span>
          </div>

          {usuario ? (
            <>
              <p className="text-sm text-gray-700">
                Compra a nombre de <strong>{usuario}</strong>.
              </p>
              <button
                disabled
                className="bg-ink text-paper py-3 rounded-card text-sm font-semibold opacity-40 cursor-not-allowed"
              >
                Pagar con Wompi (próximamente)
              </button>
            </>
          ) : (
            <button
              onClick={irAIngresar}
              className="bg-ink text-paper py-3 rounded-card text-sm font-semibold hover:bg-accent transition-colors"
            >
              Inicia sesión para pagar
            </button>
          )}

          {confirmando ? (
            <div className="flex items-center gap-3 text-sm">
              <span>¿Vaciar todo el carrito?</span>
              <button
                onClick={() => {
                  vaciarCarrito();
                  setConfirmando(false);
                }}
                className="text-accent-dark font-semibold underline"
              >
                Sí, vaciar
              </button>
              <button onClick={() => setConfirmando(false)} className="underline">
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmando(true)}
              className="text-sm text-gray-700 underline text-left"
            >
              Vaciar carrito
            </button>
          )}

          <Link to="/productos" className="text-sm text-gray-700 underline">
            Seguir comprando
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default Carrito;