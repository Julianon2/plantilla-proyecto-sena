// ================================================
// js/admin.js — lógica exclusiva de admin.html
// Carga TODAS las órdenes del sistema (requiere rol 'admin')
// Requiere token JWT en localStorage (guardado por login.js)
// ================================================

// Orden real del flujo del pedido: el pago ya está confirmado cuando la orden existe
// (la orden solo se crea tras la aprobación de Wompi — ver pago.js), así que el ciclo
// empieza en PAGO_CONFIRMADO. 'pendiente' no se ofrece como opción — ninguna orden
// nueva puede quedar en ese estado, ya que se crea solo tras el pago aprobado.
const ESTADOS_ORDEN = ['PAGO_CONFIRMADO', 'procesando', 'enviado', 'entregado'];

async function cargarOrdenesAdmin() {
  const lista = document.getElementById('admin-ordenes-lista');
  const token = localStorage.getItem('token');
  const rol   = localStorage.getItem('usuario-rol');

  // 1. Si no hay sesión o el usuario no es admin, bloquear el acceso
  if (!token) {
    lista.innerHTML =
      '<div style="text-align:center; padding:60px 0;">' +
        '<p style="font-size:1.1rem; color:#6b7280; margin-bottom:16px;">' +
          '🔒 Debes iniciar sesión para ver esta página.' +
        '</p>' +
        '<a href="login.html" class="btn btn-primario">Iniciar sesión →</a>' +
      '</div>';
    return;
  }

  if (rol !== 'admin') {
    lista.innerHTML =
      '<div style="text-align:center; padding:60px 0;">' +
        '<p style="font-size:1.1rem; color:#dc2626; margin-bottom:16px;">' +
          '⛔ No tienes permisos para ver esta página.' +
        '</p>' +
        '<a href="index.html" class="btn btn-primario">Volver al inicio →</a>' +
      '</div>';
    return;
  }

  try {
    // 2. Pedir TODAS las órdenes al backend (ruta protegida con verificarAdmin)
    const respuesta = await fetch('http://localhost:3000/api/ordenes/admin/todas', {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    if (!respuesta.ok) throw new Error('Error al cargar órdenes');

    const ordenes = await respuesta.json();

    if (ordenes.length === 0) {
      lista.innerHTML =
        '<div class="pedidos-vacio">' +
          '<p>Todavía no hay órdenes registradas.</p>' +
        '</div>';
      return;
    }

    // 3. Renderizar cada orden con un <select> para cambiar el estado
    lista.innerHTML = ordenes.map(function(orden) {

      const fecha = new Date(orden.createdAt).toLocaleDateString('es-CO', {
        year: 'numeric', month: 'long', day: 'numeric'
      });

      const cliente = orden.usuario ? (orden.usuario.nombre + ' — ' + orden.usuario.email) : 'Cliente eliminado';

      const productosHTML = (orden.productos || []).map(function(item) {
        const nombre   = item.producto ? item.producto.nombre : 'Producto';
        const cantidad = item.cantidad || 1;
        return `<li><span>${nombre} × ${cantidad}</span></li>`;
      }).join('');

      const totalFormateado = orden.total
        ? '$' + Number(orden.total).toLocaleString('es-CO')
        : '—';

      const opcionesHTML = ESTADOS_ORDEN.map(function(estado) {
        const seleccionado = estado === orden.estado ? 'selected' : '';
        return `<option value="${estado}" ${seleccionado}>${estado}</option>`;
      }).join('');

      // Línea de tiempo del pedido — se recalcula tras cada cambio de estado (ver abajo)
      const timelineHTML = renderTimelineEstado(orden.estado);

      return `
        <div class="pedido-card" data-orden-card="${orden._id}">
          <div class="pedido-encabezado">
            <div>
              <div class="pedido-id">ID: ${orden._id}</div>
              <div class="pedido-fecha">${fecha} · ${cliente}</div>
            </div>
            <select class="selector-estado" data-orden-id="${orden._id}">
              ${opcionesHTML}
            </select>
          </div>
          <ul class="pedido-productos">${productosHTML}</ul>
          <div class="timeline-wrap">${timelineHTML}</div>
          <div class="pedido-total">Total: ${totalFormateado}</div>
        </div>
      `;
    }).join('');

    // 4. Escuchar cambios en cada <select> para actualizar el estado en el backend
    document.querySelectorAll('.selector-estado').forEach(function(select) {
      select.addEventListener('change', async function() {
        const ordenId    = select.dataset.ordenId;
        const nuevoEstado = select.value;

        try {
          const r = await fetch('http://localhost:3000/api/ordenes/' + ordenId + '/estado', {
            method:  'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ estado: nuevoEstado })
          });

          if (!r.ok) {
            alert('No se pudo actualizar el estado de la orden.');
            return;
          }

          // Repintar la línea de tiempo de esa tarjeta sin recargar toda la página
          const card = document.querySelector('[data-orden-card="' + ordenId + '"]');
          const timelineWrap = card ? card.querySelector('.timeline-wrap') : null;
          if (timelineWrap) timelineWrap.innerHTML = renderTimelineEstado(nuevoEstado);

        } catch (e) {
          alert('Error de conexión al actualizar el estado.');
        }
      });
    });

  } catch (error) {
    lista.innerHTML =
      '<div style="text-align:center; padding:40px 0;">' +
        '<p style="color:#dc2626;">❌ No se pudieron cargar las órdenes.</p>' +
        '<p style="color:#9ca3af; font-size:0.9rem; margin-top:8px;">' +
          'Verifica que el servidor esté corriendo con npm run dev.' +
        '</p>' +
      '</div>';
  }
}

cargarOrdenesAdmin(); // ejecutar al cargar la página
