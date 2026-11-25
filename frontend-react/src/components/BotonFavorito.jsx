import { useContext } from "react";
import { FavoritosContext } from "../context/FavoritosContext.jsx";

// Botón con un corazón: relleno si el producto está en favoritos, solo el borde si no
function BotonFavorito({ producto, className = "" }) {
  const { esFavorito, alternarFavorito } = useContext(FavoritosContext);
  const activo = esFavorito(producto.id);

  function alPulsar(e) {
    e.stopPropagation(); // que el clic no abra la tarjeta de debajo
    alternarFavorito(producto);
  }

  return (
    <button
      type="button"
      onClick={alPulsar}
      aria-pressed={activo}
      aria-label={(activo ? "Quitar de favoritos " : "Agregar a favoritos ") + producto.nombre}
      className={"size-11 shrink-0 rounded-full bg-paper border border-gray-300 grid place-items-center hover:border-accent transition-colors " + className}
    >
      <svg
        viewBox="0 0 24 24"
        className={"size-5 " + (activo ? "fill-accent stroke-accent" : "fill-none stroke-ink")}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </button>
  );
}

export default BotonFavorito;
