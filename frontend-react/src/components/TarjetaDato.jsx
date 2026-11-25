// Una tarjeta pequeña con un dato: un título, un valor grande y una frase de apoyo.
function TarjetaDato({ titulo, valor, detalle }) {
  return (
    <div className="border border-gray-300 rounded-card p-5 flex flex-col gap-1">
      <p className="font-mono text-xs uppercase tracking-widest text-gray-500">{titulo}</p>
      <p className="font-display font-bold text-2xl tracking-tighter">{valor}</p>
      {detalle && <p className="text-sm text-gray-700">{detalle}</p>}
    </div>
  );
}

export default TarjetaDato;
