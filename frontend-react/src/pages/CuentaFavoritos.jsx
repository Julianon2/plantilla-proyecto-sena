import { useContext } from "react";
import { Link } from "react-router-dom";
import { FavoritosContext } from "../context/FavoritosContext.jsx";
import { CartContext } from "../context/CartContext.jsx";

function CuentaFavoritos() {
  const { favoritos, alternarFavorito } = useContext(FavoritosContext);
  const { agregarAlCarrito } = useContext(CartContext);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500">Compras</p>
        <h1 className="font-display font-bold text-4xl tracking-tighter mt-3">
          Favoritos<span className="text-accent">.</span>
        </h1>
        <p className="text-sm text-gray-700 mt-2">Se guardan en este navegador.</p>
      </header>

      {favoritos.length === 0 ? (
        <div className="border border-gray-300 rounded-card p-8 flex flex-col items-center text-center gap-4">
          <p className="text-gray-700">
            Aún no tienes favoritos. Toca el corazón de un producto para guardarlo aquí.
          </p>
          <Link
            to="/productos"
            className="bg-ink text-paper px-6 py-3 rounded-card text-sm font-semibold hover:bg-accent transition-colors"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {favoritos.map((producto) => (
            <li key={producto.id} className="border border-gray-300 rounded-card overflow-hidden flex flex-col">
              <img src={producto.imagen} alt={producto.nombre} className="w-full h-40 object-cover bg-gray-100" />
              <div className="p-4 flex flex-col gap-3 flex-1">
                <p className="font-semibold">{producto.nombre}</p>
                <p className="font-mono text-sm font-bold">{producto.precio}</p>
                <button
                  onClick={() => agregarAlCarrito(producto)}
                  className="mt-auto bg-ink text-paper py-2.5 rounded-card text-sm font-semibold hover:bg-accent transition-colors"
                >
                  Agregar al carrito
                </button>
                <button onClick={() => alternarFavorito(producto)} className="text-xs text-accent-dark underline">
                  Quitar de favoritos
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CuentaFavoritos;
