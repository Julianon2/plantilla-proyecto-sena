// Barras horizontales hechas solo con CSS. Cada barra mide su valor frente al mayor de todos.
function GraficoBarras({ titulo, datos }) {
  const maximo = Math.max(...datos.map((dato) => dato.valor), 1);

  return (
    <div className="border border-gray-300 rounded-card p-6 flex flex-col gap-5">
      <h3 className="font-display font-bold text-lg">{titulo}</h3>
      <ul className="flex flex-col gap-3">
        {datos.map((dato) => (
          <li key={dato.etiqueta} className="flex items-center gap-3 text-sm">
            <span className="w-32 shrink-0 text-gray-700">{dato.etiqueta}</span>
            <span className="flex-1 h-3 rounded-full bg-gray-100">
              <span
                className="block h-3 rounded-full bg-accent"
                style={{ width: (dato.valor / maximo) * 100 + "%" }}
              ></span>
            </span>
            <span className="w-6 text-right font-mono">{dato.valor}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GraficoBarras;
