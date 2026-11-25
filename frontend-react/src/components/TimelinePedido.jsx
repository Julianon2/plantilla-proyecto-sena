// Los pasos normales de un pedido, en orden. La orden solo existe después de un pago aprobado,
// así que siempre arranca en PAGO_CONFIRMADO.
export const PASOS = [
  { estado: "PAGO_CONFIRMADO", texto: "Pago confirmado" },
  { estado: "procesando", texto: "Procesando" },
  { estado: "enviado", texto: "Enviado" },
  { estado: "entregado", texto: "Entregado" },
];

// El texto que se muestra para un estado. Si no es uno de los pasos, se muestra tal cual.
export function textoEstado(estado) {
  const paso = PASOS.find((p) => p.estado === estado);
  return paso ? paso.texto : estado;
}

function TimelinePedido({ estado }) {
  // Posición del estado actual dentro de los pasos (0, 1, 2 o 3). Si no está: -1
  const actual = PASOS.findIndex((paso) => paso.estado === estado);

  // Un estado fuera del flujo normal (por ejemplo "pendiente") no dibuja la línea
  if (actual === -1) return null;

  return (
    <ol className="flex items-start">
      {PASOS.map((paso, i) => (
        <li key={paso.estado} className="relative flex-1 flex flex-col items-center gap-2">
          {i > 0 && (
            <span
              className={
                "absolute top-4 right-1/2 h-0.5 w-full -translate-y-1/2 " +
                (i <= actual ? "bg-ink" : "bg-gray-300")
              }
            ></span>
          )}
          <span
            className={
              "relative z-10 size-8 rounded-full grid place-items-center font-mono text-xs font-semibold " +
              (i < actual
                ? "bg-ink text-paper"
                : i === actual
                  ? "bg-accent text-paper"
                  : "bg-gray-200 text-gray-500")
            }
          >
            {i < actual ? "✓" : i + 1}
          </span>
          <span
            className={
              "text-xs text-center " + (i === actual ? "font-semibold text-ink" : "text-gray-500")
            }
          >
            {paso.texto}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default TimelinePedido;
