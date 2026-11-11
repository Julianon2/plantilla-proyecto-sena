import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "./CartContext.jsx";

function ProductoDetalle() {
  const { id } = useParams();
  const { agregarAlCarrito } = useContext(CartContext);
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCargando(true);
    setError(null);
    fetch("http://localhost:3000/api/productos/" + id)
      .then((res) => {
        if (!res.ok) throw new Error("No encontrado");
        return res.json();
      })
      .then((datos) => setProducto(datos))
      .catch(() => setError("Producto no encontrado"))
      .finally(() => setCargando(false));
  }, [id]);

  useEffect(() => {
    if (!producto) return;
    const tituloAnterior = document.title;
    document.title = producto.nombre + " | TechStore";

    return () => {
      document.title = tituloAnterior;
    };
  }, [producto]);

  function agregar() {
    agregarAlCarrito({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
    });
  }

  if (cargando) {
    return <p className="text-center py-20 text-gray-500">Cargando producto...</p>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-20">
        <p className="text-accent-dark">{error}</p>
        <Link
          to="/productos"
          className="font-semibold underline hover:text-accent transition-colors"
        >
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Link
        to="/productos"
        className="text-sm font-semibold text-gray-700 hover:text-ink transition-colors"
      >
        ← Volver al catálogo
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <img
          src={producto.imagen.replace("w=400&h=250", "w=1000&h=1250")}
          alt={producto.nombre}
          className="w-full aspect-4/5 object-cover rounded-3xl"
        />

        <div className="flex flex-col gap-5 md:py-6">
          <span className="font-mono text-[11px] font-bold tracking-wider text-gray-500">
            REF {String(producto.id).padStart(2, "0")}
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tighter leading-tight">
            {producto.nombre}
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            {producto.descripcion}
          </p>
          <p className="font-mono text-3xl font-bold">{producto.precio}</p>
          <button
            onClick={agregar}
            className="mt-4 bg-ink text-paper rounded-card py-4 text-sm font-semibold hover:bg-accent transition-colors"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;
