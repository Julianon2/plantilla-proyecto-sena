import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer.jsx";
import Home from "./Home.jsx";
import Productos from "./Productos.jsx";
import ProductoDetalle from "./ProductoDetalle.jsx";
import Nosotros from "./Nosotros.jsx";
import Contacto from "./Contacto.jsx";
import Login from "./Login.jsx";
import Registro from "./Registro.jsx";
import Carrito from "./Carrito.jsx";
import NotFound from "./NotFound.jsx";

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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
