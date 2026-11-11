import { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { CartContext } from "./CartContext.jsx";
import { AuthContext } from "./AuthContext.jsx";

const enlaces = [
  { ruta: "/", texto: "Inicio" },
  { ruta: "/productos", texto: "Productos" },
  { ruta: "/nosotros", texto: "Nosotros" },
  { ruta: "/contacto", texto: "Contacto" },
];

function Navbar() {
  const { items } = useContext(CartContext);
  const { usuario, logout } = useContext(AuthContext);
  const [abierto, setAbierto] = useState(false);
  const unidades = items.reduce((suma, item) => suma + item.cantidad, 0);

  function cerrar() {
    setAbierto(false);
  }

  return (
    <nav className="w-full max-w-6xl mx-auto px-6 pt-6">
      <div className="flex items-center justify-between gap-4">
        <Link to="/" onClick={cerrar} className="font-wordmark text-lg md:text-xl tracking-wide">
          TECH<span className="text-accent-dark">STORE</span>
        </Link>

        <ul className="hidden md:flex gap-9 text-sm font-medium text-gray-700">
          {enlaces.map((enlace) => (
            <li key={enlace.ruta}>
              <NavLink
                to={enlace.ruta}
                end
                className={({ isActive }) =>
                  isActive ? "text-ink font-semibold" : "hover:text-ink transition-colors"
                }
              >
                {enlace.texto}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <Link
            to="/carrito"
            onClick={cerrar}
            className="font-mono text-xs md:text-[13px] text-gray-700 whitespace-nowrap hover:text-ink transition-colors"
          >
            Carrito ( {unidades} )
          </Link>
          {usuario ? (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm font-semibold">Hola, {usuario}</span>
              <button
                onClick={logout}
                className="text-sm text-gray-700 underline hover:text-ink transition-colors"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:block bg-ink text-paper px-5 py-2.5 rounded-card text-sm font-semibold hover:bg-accent transition-colors"
            >
              Ingresar
            </Link>
          )}

          <button
            onClick={() => setAbierto(!abierto)}
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={abierto}
            className="md:hidden relative size-10 -mr-2"
          >
            <span
              className={
                "absolute left-2 top-1/2 h-0.5 w-6 -mt-px rounded-full bg-ink transition-all duration-300 " +
                (abierto ? "rotate-45" : "-translate-y-2")
              }
            ></span>
            <span
              className={
                "absolute left-2 top-1/2 h-0.5 w-6 -mt-px rounded-full bg-ink transition-all duration-300 " +
                (abierto ? "opacity-0 scale-x-0" : "")
              }
            ></span>
            <span
              className={
                "absolute left-2 top-1/2 h-0.5 w-6 -mt-px rounded-full bg-ink transition-all duration-300 " +
                (abierto ? "-rotate-45" : "translate-y-2")
              }
            ></span>
          </button>
        </div>
      </div>

      <div
        inert={!abierto}
        className={
          "md:hidden grid transition-[grid-template-rows] duration-300 ease-out " +
          (abierto ? "grid-rows-[1fr]" : "grid-rows-[0fr]")
        }
      >
        <div className="overflow-hidden">
          <ul className="flex flex-col pt-6 pb-4">
            {enlaces.map((enlace, i) => (
              <li
                key={enlace.ruta}
                style={{ transitionDelay: abierto ? i * 60 + 100 + "ms" : "0ms" }}
                className={
                  "transition-all duration-300 " +
                  (abierto ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2")
                }
              >
                <NavLink
                  to={enlace.ruta}
                  end
                  onClick={cerrar}
                  className={({ isActive }) =>
                    "block py-3 font-display font-semibold text-3xl tracking-tight " +
                    (isActive ? "text-ink" : "text-gray-500")
                  }
                >
                  {enlace.texto}
                </NavLink>
              </li>
            ))}
            <li
              style={{ transitionDelay: abierto ? enlaces.length * 60 + 100 + "ms" : "0ms" }}
              className={
                "pt-4 transition-all duration-300 " +
                (abierto ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2")
              }
            >
              {usuario ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Hola, {usuario}</span>
                  <button
                    onClick={() => {
                      logout();
                      cerrar();
                    }}
                    className="bg-ink text-paper px-6 py-3 rounded-card text-sm font-semibold"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={cerrar}
                  className="block w-full text-center bg-ink text-paper py-3.5 rounded-card text-sm font-semibold"
                >
                  Ingresar
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;