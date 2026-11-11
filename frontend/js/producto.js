// ================================================
// js/producto.js — lógica exclusiva de producto.html
// Flujo: URL ?id= → fetch API → llenar pantalla
// main.js ya se cargó antes → agregarAlCarrito() está disponible
// ================================================

async function cargarProductoDetalle() {

  // 1. Leer el ?id= de la URL
  // URLSearchParams convierte "?id=64a1b2..." en un objeto consultable
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id'); // devuelve "64a1b2..." o null si no hay ?id=

  // Referencias a los tres estados visuales de la página
  const elCargando = document.getElementById('estado-cargando');
  const elError    = document.getElementById('estado-error');
  const elDetalle  = document.getElementById('producto-detalle');

  // 2. Si no hay id en la URL, no podemos buscar nada → mostrar error
  if (!id) {
    elCargando.style.display = 'none';
    elError.style.display    = 'block';
    return; // detener la función aquí
  }

  try {
    // 3. Pedir el producto al backend usando el id de la URL
    // La ruta GET /:id fue agregada en el Paso 1 de esta sesión
    const respuesta = await fetch('http://localhost:3000/api/productos/' + id);

    // Si el servidor respondió con 404 u otro error → saltar al catch
    if (!respuesta.ok) throw new Error('No encontrado');

    // Convertir la respuesta de JSON a objeto JavaScript
    const producto = await respuesta.json();

    // 4. Poner los datos del producto en los elementos HTML
    // .textContent es más seguro que .innerHTML — evita inyección de HTML
    document.getElementById('producto-nombre').textContent      = producto.nombre;
    document.getElementById('producto-precio').textContent      = producto.precio;
    document.getElementById('producto-descripcion').textContent = producto.descripcion;

    // 4b. Imagen: si el producto tiene imagen → <img>, si no → emoji de placeholder
    const imgWrap = document.getElementById('producto-imagen-wrap');
    if (producto.imagen) {
      imgWrap.innerHTML = `<img src="${producto.imagen}" alt="${producto.nombre}">`;
    } else {
      imgWrap.innerHTML = `<div class="producto-imagen-placeholder">${producto.icono || '📦'}</div>`;
    }

    // 5. Ocultar el spinner y mostrar el contenido del producto
    elCargando.style.display = 'none';
    elDetalle.style.display  = 'flex'; // flex porque .producto-detalle usa display:flex

    // 6. Conectar el botón "Agregar al carrito"
    // agregarAlCarrito() está definida en main.js — disponible porque main.js se cargó primero
    document.getElementById('btn-agregar-carrito').addEventListener('click', function() {
      agregarAlCarrito({
        id:     producto._id,      // _id de MongoDB (24 caracteres hex)
        nombre: producto.nombre,
        precio: producto.precio,
        icono:  producto.icono  || '📦',
        imagen: producto.imagen || '',
        fecha:  new Date().toLocaleDateString('es-CO')
      });

      // Mostrar confirmación con enlace directo al carrito
      const msg = document.getElementById('producto-mensaje');
      msg.innerHTML =
        '<div style="background:#dcfce7; border:1px solid #bbf7d0; border-radius:10px; padding:12px 16px;">' +
          '<p style="color:#15803d; font-weight:600;">✅ Agregado al carrito — ' +
          '<a href="carrito.html" style="color:#166534;">Ver carrito →</a></p>' +
        '</div>';
      msg.style.display = 'block';
    });

  } catch (error) {
    // Si fetch falla (red, servidor apagado, id con formato inválido)
    elCargando.style.display = 'none';
    elError.style.display    = 'block';
  }
}

cargarProductoDetalle(); // ejecutar al cargar la página