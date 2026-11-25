import { useState, useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

// Un panel con menú lateral (sidebar) y una zona de contenido.
// Recibe el título y las secciones del menú; el contenido lo pone la ruta hija en <Outlet />.
function DashboardLayout({ titulo, secciones }) {
  const { usuario, rol, logout } = useContext(AuthContext);
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-10 items-start">
      <aside className="flex flex-col gap-6 lg:sticky lg:top-6">
        <div className="flex items-center gap-4">
          <span className="size-12 rounded-full bg-ink text-paper grid place-items-center font-display font-bold text-lg">
            {usuario.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="font-semibold leading-tight">{usuario}</p>
            <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
              {rol === "admin" ? "Administrador" : "Cliente"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setAbierto(!abierto)}
          aria-expanded={abierto}
          className="lg:hidden border border-gray-300 rounded-card px-4 py-3 text-sm font-semibold text-left"
        >
          {abierto ? "Cerrar menú" : "Menú de " + titulo}
        </button>

        <nav className={(abierto ? "flex" : "hidden") + " lg:flex flex-col gap-6"}>
          {secciones.map((seccion) => (
            <div key={seccion.titulo} className="flex flex-col gap-1">
              <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-1">
                {seccion.titulo}
              </p>
              {seccion.enlaces.map((enlace) => (
                <NavLink
                  key={enlace.ruta}
                  to={enlace.ruta}
                  end={enlace.fin}
                  onClick={() => setAbierto(false)}
                  className={({ isActive }) =>
                    "px-4 py-2.5 rounded-card text-sm font-medium transition-colors " +
                    (isActive ? "bg-ink text-paper" : "text-gray-700 hover:bg-gray-100")
                  }
                >
                  {enlace.texto}
                </NavLink>
              ))}
            </div>
          ))}
          <button onClick={logout} className="px-4 text-left text-sm text-gray-700 underline">
            Salir
          </button>
        </nav>
      </aside>

      <section className="min-w-0">
        <Outlet />
      </section>
    </div>
  );
}

export default DashboardLayout;
