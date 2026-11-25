import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Productos from "./pages/Productos.jsx";
import ProductoDetalle from "./pages/ProductoDetalle.jsx";
import Nosotros from "./pages/Nosotros.jsx";
import Contacto from "./pages/Contacto.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import Carrito from "./pages/Carrito.jsx";
import PagoResultado from "./pages/PagoResultado.jsx";
import MisPedidos from "./pages/MisPedidos.jsx";
import Cuenta from "./pages/Cuenta.jsx";
import CuentaResumen from "./pages/CuentaResumen.jsx";
import CuentaPerfil from "./pages/CuentaPerfil.jsx";
import CuentaFavoritos from "./pages/CuentaFavoritos.jsx";
import CuentaSeguridad from "./pages/CuentaSeguridad.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:id" element={<ProductoDetalle />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/pago/:referencia" element={<PagoResultado />} />
          <Route path="/cuenta" element={<Cuenta />}>
            <Route index element={<CuentaResumen />} />
            <Route path="perfil" element={<CuentaPerfil />} />
            <Route path="pedidos" element={<MisPedidos />} />
            <Route path="favoritos" element={<CuentaFavoritos />} />
            <Route path="seguridad" element={<CuentaSeguridad />} />
          </Route>
          <Route path="/mis-pedidos" element={<Navigate to="/cuenta/pedidos" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
