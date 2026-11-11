import { Link } from "react-router-dom";

const valores = [
  {
    titulo: "Misión",
    texto: "Ofrecer productos tecnológicos de calidad con asesoría experta, precios competitivos y excelente servicio postventa a todos nuestros clientes.",
  },
  {
    titulo: "Visión",
    texto: "Ser la tienda de tecnología más reconocida del Huila en 2030, con presencia en las principales ciudades del departamento.",
  },
  {
    titulo: "Valores",
    texto: "Honestidad en cada venta, calidad garantizada, innovación constante, compromiso con el cliente y apoyo a la comunidad local.",
  },
];

// Reemplaza estos datos de ejemplo por los integrantes reales de tu grupo
const equipo = [
  {
    nombre: "Integrante 1",
    cargo: "Desarrollo frontend",
    descripcion: "Construye las páginas con React y Tailwind CSS.",
  },
  {
    nombre: "Integrante 2",
    cargo: "Desarrollo backend",
    descripcion: "Crea la API con Express y conecta MongoDB Atlas.",
  },
  {
    nombre: "Integrante 3",
    cargo: "Pruebas y calidad",
    descripcion: "Verifica que cada función trabaje como se diseñó.",
  },
];

function Nosotros() {
  return (
    <div className="flex flex-col gap-24">
      {/* HISTORIA */}
      <section className="max-w-2xl pt-6">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
          Nosotros
        </p>
        <h1 className="font-display font-bold text-5xl tracking-tighter mt-4 mb-6">
          Quiénes somos<span className="text-accent">.</span>
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          TechStore Pro nació en Garzón, Huila, con una misión clara: acercar la
          mejor tecnología a las familias y empresas del sur colombiano. Iniciamos
          en 2023 como una pequeña tienda y hoy somos el referente tecnológico de
          la región.
        </p>
        <p className="text-gray-700 leading-relaxed mb-8">
          Creemos que la tecnología no es un lujo, es una herramienta que
          transforma vidas. Por eso ofrecemos asesoría personalizada, precios
          justos y garantía real en cada producto.
        </p>
        <Link
          to="/contacto"
          className="inline-block bg-ink text-paper px-7 py-3.5 rounded-card text-sm font-semibold hover:bg-accent transition-colors"
        >
          Contáctanos
        </Link>
      </section>

      {/* MISIÓN, VISIÓN Y VALORES */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {valores.map((v) => (
          <div
            key={v.titulo}
            className="p-6 rounded-card border border-gray-100 hover:border-gray-300 transition-colors"
          >
            <h2 className="font-display font-semibold text-xl mb-3">
              {v.titulo}<span className="text-accent">.</span>
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">{v.texto}</p>
          </div>
        ))}
      </section>

      {/* EQUIPO */}
      <section>
        <h2 className="font-display font-bold text-3xl tracking-tight mb-8">
          Nuestro equipo<span className="text-accent">.</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {equipo.map((persona, i) => (
            <div key={persona.nombre} className="flex flex-col gap-3">
              <div className="size-20 rounded-full bg-gray-100 flex items-center justify-center font-mono text-sm text-gray-500">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="font-display font-semibold text-lg">{persona.nombre}</h3>
              <p className="font-mono text-xs uppercase tracking-wider text-accent-dark">
                {persona.cargo}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{persona.descripcion}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Nosotros;