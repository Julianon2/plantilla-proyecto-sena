// ================================================
// js/timeline.js — línea de tiempo del pedido
// Componente compartido entre mispedidos.js (cliente) y admin.js (admin)
// ================================================

// Flujo real del pedido: la orden solo existe cuando Wompi confirmó el pago
// (ver backend/routes/pago.js), así que el ciclo siempre arranca en PAGO_CONFIRMADO.
// 'pendiente' y 'cancelado' no forman parte de esta línea de tiempo — son casos
// legado o de excepción, no pasos del flujo normal.
const PASOS_TIMELINE = [
  { estado: 'PAGO_CONFIRMADO', icono: '💳', texto: 'Pago confirmado' },
  { estado: 'procesando',      icono: '⚙️', texto: 'Procesando' },
  { estado: 'enviado',         icono: '🚚', texto: 'Enviado' },
  { estado: 'entregado',       icono: '✅', texto: 'Entregado' }
];

// Genera el HTML de la línea de tiempo, marcando como completados los pasos
// hasta el estado actual del pedido (inclusive) y como activo el estado actual.
function renderTimelineEstado(estadoActual) {
  const indiceActual = PASOS_TIMELINE.findIndex(function(p) { return p.estado === estadoActual; });

  // Si el estado no está en el flujo normal (ej. 'pendiente' o 'cancelado'),
  // no se dibuja la línea de tiempo — no aplica a ese pedido.
  if (indiceActual === -1) return '';

  const pasosHTML = PASOS_TIMELINE.map(function(paso, i) {
    let clase = 'timeline-paso';
    if (i < indiceActual)  clase += ' completado';
    if (i === indiceActual) clase += ' activo';

    return `
      <div class="${clase}">
        <div class="timeline-punto">${paso.icono}</div>
        <div class="timeline-texto">${paso.texto}</div>
      </div>
    `;
  }).join('<div class="timeline-linea"></div>');

  return `<div class="timeline-pedido">${pasosHTML}</div>`;
}
