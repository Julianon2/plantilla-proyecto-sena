import { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";

function ProductCard(props) {
  const { agregarAlCarrito } = useContext(CartContext);

  function agregar(e) {
    e.stopPropagation();
    agregarAlCarrito({
      id: props.id,
      nombre: props.nombre,
      precio: props.precio,
      imagen: props.imagen,
    });
  }

  return (
    <article
      onClick={props.onVer}
      className="group relative aspect-4/5 cursor-pointer overflow-hidden rounded-3xl bg-ink"
    >
      <img
        src={props.imagen.replace("w=400&h=250", "w=800&h=1000")}
        alt={props.nombre}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/60 via-30% to-transparent to-60%"></div>

      <span className="absolute top-4 left-4 bg-paper/90 text-ink rounded-full px-3 py-1.5 font-mono text-[11px] font-bold tracking-wider">
        REF {String(props.id).padStart(2, "0")}
      </span>

      <div className="absolute inset-x-5 bottom-5 flex flex-col gap-2.5 text-paper">
        <h3 className="font-display font-semibold text-xl leading-tight">
          {props.nombre}
        </h3>
        <p className="text-[13px] leading-relaxed text-paper/75 line-clamp-2">
          {props.descripcion}
        </p>
        <div className="flex items-center justify-between gap-3 mt-1.5">
          <span className="font-mono text-[15px] font-bold">{props.precio}</span>
          <button
            onClick={agregar}
            aria-label={"Agregar " + props.nombre + " al carrito"}
            className="bg-paper text-ink rounded-full px-4 py-2.5 text-[13px] font-semibold hover:bg-accent hover:text-paper transition-colors"
          >
            Agregar +
          </button>
        </div>
      </div>
    </article>
  );
}
export default ProductCard;