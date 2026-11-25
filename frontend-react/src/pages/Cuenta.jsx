import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import DashboardLayout from "../components/DashboardLayout.jsx";

// Las secciones del menú lateral: cada una tiene un título y su lista de enlaces
const SECCIONES = [
  {
    titulo: "General",
    enlaces: [
      { ruta: "/cuenta", texto: "Resumen", fin: true },
      { ruta: "/cuenta/perfil", texto: "Mi perfil" },
    ],
  },
  {
    titulo: "Compras",
    enlaces: [{ ruta: "/cuenta/pedidos", texto: "Mis pedidos" }],
  },
];

function Cuenta() {
  const { usuario } = useContext(AuthContext);

  // Sin sesión no hay panel
  if (!usuario) {
    return (
      <section className="max-w-md mx-auto text-center flex flex-col items-center gap-5 py-16">
        <h1 className="font-display font-bold text-4xl tracking-tighter">
          Inicia sesión para ver tu cuenta<span className="text-accent">.</span>
        </h1>
        <Link
          to="/login"
          state={{ aviso: "Inicia sesión para ver tu cuenta", desde: "/cuenta" }}
          className="bg-ink text-paper px-6 py-3 rounded-card text-sm font-semibold hover:bg-accent transition-colors"
        >
          Ingresar
        </Link>
      </section>
    );
  }

  return <DashboardLayout titulo="mi cuenta" secciones={SECCIONES} />;
}

export default Cuenta;
