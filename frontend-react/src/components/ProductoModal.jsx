import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";

function ProductoModal({ producto, onCerrar }) {
  const { agregarAlCarrito } = useContext(CartContext);

  useEffect(() => {
    function alPulsar(e) {
      if (e.key === "Escape") onCerrar();
    }
    document.addEventListener("keydown", alPulsar);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", alPulsar);
      document.body.style.overflow = "";
    };
  }, [onCerrar]);

  function agregar() {
    agregarAlCarrito({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
    });
    onCerrar();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4"
      onClick={onCerrar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={producto.nombre}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-paper shadow-float md:grid md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCerrar}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-10 size-10 rounded-full bg-paper/90 text-xl leading-none flex items-center justify-center hover:bg-accent hover:text-paper transition-colors"
        >
          ×
        </button>

        <img
          src={producto.imagen.replace("w=400&h=250", "w=800&h=1000")}
          alt={producto.nombre}
          className="w-full h-64 md:h-full object-cover"
        />

        <div className="flex flex-col gap-4 p-6 md:p-8">
          <span className="font-mono text-[11px] font-bold tracking-wider text-gray-500">
            REF {String(producto.id).padStart(2, "0")}
          </span>
          <h2 className="font-display font-bold text-3xl tracking-tight leading-tight">
            {producto.nombre}
          </h2>
          <p className="text-gray-700 leading-relaxed">{producto.descripcion}</p>
          <p className="font-mono text-2xl font-bold">{producto.precio}</p>
          <button
            onClick={agregar}
            className="mt-auto bg-ink text-paper rounded-card py-3.5 text-sm font-semibold hover:bg-accent transition-colors"
          >
            Agregar al carrito
          </button>
          <Link
            to={"/productos/" + producto._id}
            className="text-center border border-gray-300 rounded-card py-3.5 text-sm font-semibold hover:border-ink transition-colors"
          >
            Ver ficha completa
          </Link>
          <button
            onClick={onCerrar}
            className="text-sm font-semibold text-gray-700 hover:text-ink transition-colors"
          >
            Seguir viendo
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductoModal;