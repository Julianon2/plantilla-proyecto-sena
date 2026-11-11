// ================================================
// js/mispedidos.js — lógica exclusiva de mispedidos.html
// Carga las órdenes del usuario autenticado desde la API
// Requiere token JWT en localStorage (guardado por login.js)
// ================================================

async function cargarMisPedidos() {
  const lista = document.getElementById('pedidos-lista');
  const token = localStorage.getItem('token'); // guardado por login.js al iniciar sesión

  // 1. Si no hay token el usuario no inició sesión — mostrar mensaje y detener
  if (!token) {
    lista.innerHTML =
      '<div style="text-align:center; padding:60px 0;">' +
        '<p style="font-size:1.1rem; color:#6b7280; margin-bottom:16px;">' +
          '🔒 Debes iniciar sesión para ver tus pedidos.' +
        '</p>' +
        '<a href="login.html" class="btn btn-primario">Iniciar sesión →</a>' +
      '</div>';
    return;
  }

  try {
    // 2. Llamar al backend con el token en el header Authorization
    // El middleware verificarToken en ordenes.js leerá este header y validará el JWT
    const respuesta = await fetch('http://localhost:3000/api/ordenes', {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    // Si el token expiró o es inválido, el backend responde 401
    if (!respuesta.ok) throw new Error('Error al cargar pedidos');

    // Convertir la respuesta de JSON a array de pedidos
    const pedidos = await respuesta.json();

    // 3. Si el array está vacío — el usuario no ha comprado nada todavía
    if (pedidos.length === 0) {
      lista.innerHTML =
        '<div class="pedidos-vacio">' +
          '<p>Todavía no tienes pedidos.</p>' +
          '<a href="productos.html" class="btn btn-primario">Ver productos →</a>' +
        '</div>';
      return;
    }

    // 4. Renderizar cada pedido como una tarjeta
    // .map() convierte cada pedido en un string de HTML, .join('') los une sin comas
    lista.innerHTML = pedidos.map(function(pedido) {

      // Convertir la fecha ISO (2026-09-09T...) a formato legible en español
      const fecha = new Date(pedido.createdAt).toLocaleDateString('es-CO', {
        year: 'numeric', month: 'long', day: 'numeric'
      });

      // Estado del pedido — si no tiene campo estado, asumir 'pendiente'
      const estado = pedido.estado || 'pendiente';

      // Texto con emoji según el estado — el objeto actúa como un switch
      const estadoTexto = {
        pendiente:        '⏳ Pendiente',
        procesando:       '⚙️ Procesando',
        enviado:          '🚚 Enviado',
        entregado:        '✅ Entregado',
        cancelado:        '❌ Cancelado',
        PAGO_CONFIRMADO:  '💳 Pago confirmado'
      }[estado] || estado;

      // Clase CSS del badge — PAGO_CONFIRMADO no tiene estilo propio en el CSS,
      // se usa el mismo verde que "entregado" para el estado de pago aprobado
      const claseEstado = estado === 'PAGO_CONFIRMADO' ? 'entregado' : estado;

      // Lista de productos dentro del pedido
      // item.producto viene como objeto {nombre, precio} gracias al .populate() del backend
      const productosHTML = (pedido.productos || []).map(function(item) {
        const nombre   = item.producto ? item.producto.nombre : 'Producto';
        const cantidad = item.cantidad || 1;
        return `<li><span>${nombre} × ${cantidad}</span></li>`;
      }).join('');

      // Total con formato de peso colombiano: $1.299.000
      const totalFormateado = pedido.total
        ? '$' + Number(pedido.total).toLocaleString('es-CO')
        : '—';

      // Línea de tiempo del pedido — solo se dibuja si el estado forma parte
      // del flujo normal post-pago (ver js/timeline.js)
      const timelineHTML = renderTimelineEstado(estado);

      // HTML de la tarjeta del pedido
      return `
        <div class="pedido-card">
          <div class="pedido-encabezado">
            <div>
              <div class="pedido-id">ID: ${pedido._id}</div>
              <div class="pedido-fecha">${fecha}</div>
            </div>
            <span class="badge-estado ${claseEstado}">${estadoTexto}</span>
          </div>
          <ul class="pedido-productos">${productosHTML}</ul>
          ${timelineHTML}
          <div class="pedido-total">Total: ${totalFormateado}</div>
        </div>
      `;
    }).join('');

  } catch (error) {
    // Error de red, servidor apagado o token inválido
    lista.innerHTML =
      '<div style="text-align:center; padding:40px 0;">' +
        '<p style="color:#dc2626;">❌ No se pudieron cargar los pedidos.</p>' +
        '<p style="color:#9ca3af; font-size:0.9rem; margin-top:8px;">' +
          'Verifica que el servidor esté corriendo con npm run dev.' +
        '</p>' +
      '</div>';
  }
}

cargarMisPedidos(); // ejecutar al cargar la página