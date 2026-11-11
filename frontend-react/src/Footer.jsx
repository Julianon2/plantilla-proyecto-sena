import { Link } from "react-router-dom";

const menu = [
  { ruta: "/", texto: "Inicio" },
  { ruta: "/productos", texto: "Productos" },
  { ruta: "/nosotros", texto: "Nosotros" },
  { ruta: "/contacto", texto: "Contacto" },
];

const redes = ["Instagram", "Facebook", "WhatsApp"];

function Footer() {
  return (
    <footer className="bg-paper pt-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-ink">
        {/* CONTACTO Y ENLACES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-3 text-sm text-gray-700">
            <p>
              Calle 7 # 8-30<br />
              Garzón, Huila, Colombia
            </p>
            <p>info@miproyecto.co</p>
            <p className="font-mono">300 000 0000</p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4">
                Menú
              </h3>
              <ul className="flex flex-col gap-2.5 text-gray-700">
                {menu.map((enlace) => (
                  <li key={enlace.ruta}>
                    <Link to={enlace.ruta} className="hover:text-ink transition-colors">
                      {enlace.texto}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4">
                Redes
              </h3>
              <ul className="flex flex-col gap-2.5 text-gray-700">
                {redes.map((red) => (
                  <li key={red}>
                    <a href="#" className="hover:text-ink transition-colors">
                      {red}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* LÍNEA CON BOTÓN */}
        <div className="flex items-center gap-4 mt-16">
          <div className="h-px flex-1 bg-gray-100"></div>
          <Link
            to="/contacto"
            className="bg-ink text-paper rounded-full px-5 py-2 text-xs font-semibold hover:bg-accent transition-colors"
          >
            Escríbenos
          </Link>
        </div>

        {/* TEXTO LEGAL */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mt-8 text-xs">
          <p className="max-w-xs text-gray-500 leading-relaxed">
            Proyecto formativo SENA ADSO · Ficha 3229944. Tecnología con asesoría real.
          </p>
          <p className="font-mono text-gray-500">© 2026 — Fase 5 React & Tailwind</p>
        </div>

        {/* WORDMARK GIGANTE, RECORTADO ABAJO */}
        <p
          aria-hidden="true"
          className="font-wordmark whitespace-nowrap leading-none text-center select-none text-[clamp(2rem,8.2vw,7.5rem)] text-gray-100 mt-12 mb-[-0.18em]"
        >
          TECH<span className="text-accent/20">STORE</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;