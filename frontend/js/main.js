// ================================================
// EJERCICIO 1: MENÚ HAMBURGUESA
// Archivo: js/main.js  ← este archivo
// Funciona en: index.html, productos.html,
//              nosotros.html, contacto.html
// ================================================

// PASO 1 — Buscar el botón hamburguesa en el HTML
// Tu index.html tiene:  <button id="menu-toggle" ...>
// querySelector('#menu-toggle') lo encuentra por su id
const botonMenu = document.querySelector('#menu-toggle');

// PASO 2 — Buscar el nav en el HTML
// Tu index.html tiene:  <nav id="nav-menu" class="nav-menu">
const navMenu = document.querySelector('#nav-menu');

// PASO 3 — Escuchar el clic en el botón
// "cuando el usuario haga clic en botonMenu, ejecuta esta función"
botonMenu.addEventListener('click', function() {

  // PASO 4 — Alternar la clase 'open' en el nav
  // Tu styles.css tiene: .nav-menu.open { display: flex; }
  // toggle agrega 'open' si no la tiene, la quita si ya la tiene
  navMenu.classList.toggle('open');

  // PASO 5 — Actualizar aria-expanded (accesibilidad)
  // Dice si el menú está abierto (true) o cerrado (false)
  const estaAbierto = navMenu.classList.contains('open');
  botonMenu.setAttribute('aria-expanded', estaAbierto);

});

// PASO 6 — Cerrar el menú cuando el usuario toca un enlace
// navMenu.querySelectorAll('a') encuentra los 4 enlaces del nav
const enlaces = navMenu.querySelectorAll('a');

enlaces.forEach(function(enlace) {
  enlace.addEventListener('click', function() {
    // Al tocar un enlace: cerrar el menú
    navMenu.classList.remove('open');
    botonMenu.setAttribute('aria-expanded', 'false');
  });
});

// ================================================
// EJERCICIO 2: VALIDAR FORMULARIO DE CONTACTO
// Funciona en: contacto.html
// El formulario tiene id="form-contacto" y novalidate
// ================================================

// PASO 1 — Encontrar el formulario
// Tu contacto.html tiene:  <form id="form-contacto" novalidate>
const formulario = document.querySelector('#form-contacto');

// PASO 2 — Dos funciones auxiliares para mostrar y limpiar errores
// Los campos en contacto.html tienen esta estructura:
//   <div class="campo">
//     <input id="nombre">
//     <span class="error" id="error-nombre"></span>
//   </div>
// La clase .tiene-error en styles.css pone el borde rojo

function mostrarError(idCampo, mensaje) {
  const campo     = document.querySelector('#' + idCampo);
  const spanError = document.querySelector('#error-' + idCampo);
  campo.closest('.campo').classList.add('tiene-error'); // borde rojo
  spanError.textContent = mensaje;                 // texto del error
}

function limpiarError(idCampo) {
  const campo     = document.querySelector('#' + idCampo);
  const spanError = document.querySelector('#error-' + idCampo);
  campo.closest('.campo').classList.remove('tiene-error'); // quita borde rojo
  spanError.textContent = '';                          // borra el texto
}

// PASO 3 — Escuchar cuando el usuario hace clic en "Enviar mensaje"
// El evento 'submit' se dispara al hacer clic en <button type="submit">
if (formulario) {  // solo corre en contacto.html donde existe el formulario
  formulario.addEventListener('submit', function(evento) {

    // ✏️ LÍNEA 1 — Evitar que la página se recargue al enviar
    // Sin esta línea, la página salta y se pierde todo
    evento.preventDefault(); /* ✏️ escribe: evento.preventDefault() */

    let hayErrores = false; // vamos a cambiar esto a true si hay problemas

    // VALIDAR NOMBRE — id="nombre" en contacto.html
    // .value lee lo que escribió el usuario
    // .trim() elimina espacios al inicio y al final
    const valorNombre = document.querySelector('#nombre').value.trim();
    if (valorNombre.length < 3) {
      mostrarError('nombre', 'Escribe tu nombre completo (mínimo 3 caracteres)');
      hayErrores = true;
    } else {
      limpiarError('nombre');
    }

    // ✏️ LÍNEA 2 — VALIDAR EMAIL — id="email" en contacto.html
    // Un email válido siempre tiene @ y al menos 5 caracteres
    const valorEmail = document.querySelector('#email').value.trim();
    if (!valorEmail.includes('@') || valorEmail.length < 5) {
      mostrarError('email', 'Ingresa un correo válido (debe tener @)');
      hayErrores = true;
    } else {
      limpiarError('email');
    }

    // VALIDAR ASUNTO — id="asunto" (select) en contacto.html
    // value === '' significa que dejaron el "-- Selecciona un asunto --"
    const valorAsunto = document.querySelector('#asunto').value;
    if (valorAsunto === '') {
      mostrarError('asunto', 'Selecciona un asunto');
      hayErrores = true;
    } else {
      limpiarError('asunto');
    }

    // ✏️ LÍNEA 3 — VALIDAR MENSAJE — id="mensaje" (textarea) en contacto.html
    const valorMensaje = document.querySelector('#mensaje').value.trim();
    if (valorMensaje.length < 10) {
      mostrarError('mensaje', 'El mensaje debe tener al menos 10 caracteres');
      hayErrores = true;
    } else {
      limpiarError('mensaje');
    }

    // RESULTADO FINAL — si todo está bien, mostrar el mensaje de éxito
    // Tu contacto.html tiene:  <div id="form-exito" style="display:none">
    if (!hayErrores) {
      document.querySelector('#form-exito').style.display = 'block';
      formulario.reset(); // limpia todos los campos
    }

  });
}

// PASO 2 — Función que convierte UN objeto producto en HTML de tarjeta
// Usa backtick ` (no comillas) para escribir HTML con variables ${...}
// Las clases .tarjeta .tarjeta-img etc. ya están definidas en styles.css
function crearTarjeta(producto) {
  return `
    <article class="tarjeta"
      data-id="${producto._id || producto.id || ''}"
      data-icono="${producto.icono || '📦'}"
      data-nombre="${producto.nombre}"
      data-desc="${producto.descripcion}"
      data-precio="${producto.precio}"
      data-imagen="${producto.imagen || ''}">
      <span class="badge-disponible">✓ Disponible</span>
      <img src="${producto.imagen}" alt="${producto.nombre}" class="tarjeta-img">
      <div class="tarjeta-info">
        <h3 class="tarjeta-nombre">${producto.nombre}</h3>
        <p class="tarjeta-desc">${producto.descripcion}</p>
        <div class="tarjeta-pie">
          <span class="tarjeta-precio">${producto.precio}</span>
          <a href="producto.html?id=${producto._id || producto.id || ''}" class="btn-accion">Ver más</a>
        </div>
      </div>
    </article>
  `;
}
// ================================================
// S08: CARGAR PRODUCTOS DESDE JSON
// Reemplaza el array hardcodeado de S03.
// Funciona en: productos.html (donde existe #grid-tarjetas)
// Requiere: data/productos.json con el array de productos
// ================================================

async function cargarProductos() {
  const grid = document.querySelector('#grid-tarjetas');
  if (!grid) return; // solo correr en páginas que tienen el grid

  try {
    // PASO 1 — Pedir el archivo JSON al servidor
    // await pausa aquí hasta que llegue la respuesta (el sobre)
    const respuesta = await fetch('http://localhost:3000/api/productos');

    // PASO 2 — Leer el contenido del JSON como array JavaScript
    // .json() también es asíncrono → necesita su propio await
    const productos = await respuesta.json();

    // PASO 3 — Renderizar las tarjetas en el grid
    // productos.map(crearTarjeta) convierte cada objeto en HTML
    grid.innerHTML = productos.map(crearTarjeta).join('');

    // PASO 4 — Reconectar todo lo que depende de las tarjetas
    // Estas funciones buscan .tarjeta en el HTML → deben ir DESPUÉS del innerHTML
    registrarBotonesModal(); // botones "Ver más" → abrir modal
    registrarBadgeHover();   // badge "✓ Disponible" al hacer hover
    registrarBuscador();     // filtro de búsqueda en tiempo real

  } catch (error) {
    // Si fetch falla (sin Live Server, archivo no existe, JSON roto)
    // muestra un mensaje visible en la página en vez de romper silenciosamente
    grid.innerHTML = `
      <div class="error-fetch">
        <p>⚠️ No se pudieron cargar los productos.</p>
        <button onclick="cargarProductos()" class="btn btn-primario">Reintentar</button>
      </div>
    `;
    console.error('Error al cargar productos:', error);
  }
}

cargarProductos(); // ejecutar al cargar la página

// ══════════════════════════════════════════════
// EJERCICIO 1 · MODAL PRODUCTO
// Solo en productos.html (donde existe #modal-producto)
// ══════════════════════════════════════════════

const modal = document.querySelector('#modal-producto');

if (modal) {
  const btnCerrar = document.querySelector('#modal-cerrar');

  // Llena el modal con los datos del producto y lo hace visible
  // tarjeta.dataset lee los atributos data-* del <article class="tarjeta">
  function abrirModal(tarjeta) {
    document.querySelector('#modal-icono').textContent  = tarjeta.dataset.icono  || '📦';
    document.querySelector('#modal-titulo').textContent = tarjeta.dataset.nombre || 'Producto';
    document.querySelector('#modal-desc').textContent   = tarjeta.dataset.desc   || '';
    document.querySelector('#modal-precio').textContent = tarjeta.dataset.precio || '';
    // Guardar imagen e id en el modal para usarlos al agregar al carrito
    modal.dataset.imagen = tarjeta.dataset.imagen || '';
    modal.dataset.id     = tarjeta.dataset.id     || '';
    modal.classList.add('visible');
  }

  // Se llama desde cargarProductos() DESPUÉS de grid.innerHTML
  // porque los botones .btn-accion los crea crearTarjeta() dinámicamente
  function registrarBotonesModal() {
    document.querySelectorAll('.btn-accion').forEach(function(boton) {
      boton.addEventListener('click', function() {
        abrirModal(boton.closest('.tarjeta'));
      });
    });
  }

  btnCerrar.addEventListener('click', function() {
    modal.classList.remove('visible');
  });

  modal.addEventListener('click', function(e) {
    if (e.target === modal) modal.classList.remove('visible');
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') modal.classList.remove('visible');
  });
}
// ══════════════════════════════════════════════
// EJERCICIO 2 · BARRA DE PROGRESO SCROLL
// Funciona en todas las páginas
// ══════════════════════════════════════════════

const barraScroll = document.querySelector('#barra-scroll');

if (barraScroll) {
  window.addEventListener('scroll', function() {
    // scrollY = cuántos píxeles hemos bajado
    // scrollHeight - innerHeight = total de píxeles posibles
    const totalDesplazamiento = document.body.scrollHeight - window.innerHeight;
    const porcentaje = (window.scrollY / totalDesplazamiento) * 100;
    barraScroll.style.width = porcentaje + '%';
  });
}
// ══════════════════════════════════════════════
// EJERCICIO 3 · BADGE HOVER EN TARJETAS
// Solo en productos.html
// Se llama desde cargarProductos() — las tarjetas deben existir primero
// ══════════════════════════════════════════════

// Muestra el badge "✓ Disponible" al pasar el mouse por una tarjeta
function registrarBadgeHover() {
  document.querySelectorAll('.tarjeta').forEach(function(tarjeta) {
    const badge = tarjeta.querySelector('.badge-disponible');
    if (badge) {
      tarjeta.addEventListener('mouseover', function() { badge.classList.add('visible'); });
      tarjeta.addEventListener('mouseout',  function() { badge.classList.remove('visible'); });
    }
  });
}

// Filtra las tarjetas en tiempo real según lo que escribe el usuario
// Se llama desde cargarProductos() — las tarjetas deben existir primero
function registrarBuscador() {
  const buscador = document.querySelector('#buscador');
  if (!buscador) return; // solo correr en páginas con buscador
  buscador.addEventListener('input', function() {
    // .toLowerCase() para que "macbook" encuentre "MacBook"
    const termino = buscador.value.toLowerCase();
    document.querySelectorAll('.tarjeta').forEach(function(tarjeta) {
      const nombre = tarjeta.dataset.nombre.toLowerCase();
      // muestra u oculta según si el nombre incluye el término buscado
      tarjeta.style.display = nombre.includes(termino) ? 'block' : 'none';
    });
  });
}
// ===== S07: TEMA OSCURO =====

// ✏️ COMPLETA: Lee el tema guardado en LocalStorage
// Si existe, aplícalo al body. Si no existe, no hagas nada.
function aplicarTemaGuardado() {
  const tema = localStorage.getItem('tema');
  if (tema === 'oscuro') {
    document.body.classList.add('tema-oscuro');
    const btn = document.getElementById('btn-tema');
    if (btn) btn.textContent = '☀️'; // cambiar el ícono
  }
}

// ✏️ COMPLETA: Alterna entre claro y oscuro y guarda la preferencia
function toggleTema() {
  const esOscuro = document.body.classList.toggle('tema-oscuro');
  const btn = document.getElementById('btn-tema');
  
  if (esOscuro) {
    localStorage.setItem('tema', 'oscuro');
    if (btn) btn.textContent = '☀️';
  } else {
    localStorage.setItem('tema', 'claro');
    if (btn) btn.textContent = '🌙';
  }
}

// Conectar el botón y aplicar el tema al cargar
const btnTema = document.getElementById('btn-tema');
if (btnTema) {
  btnTema.addEventListener('click', toggleTema);
}

aplicarTemaGuardado(); // ← ejecutar al cargar la página

// ===== S07: CARRITO DE COMPRAS =====

// Lee el carrito de LocalStorage (o devuelve array vacío)
function leerCarrito() {
  const guardado = localStorage.getItem('carrito');
  return guardado ? JSON.parse(guardado) : [];
}

// Guarda el carrito en LocalStorage y actualiza el badge
function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarBadge();
}

// ✏️ COMPLETA: Actualiza el número que aparece en el badge del header
function actualizarBadge() {
  const badge = document.getElementById('carrito-badge');
  if (!badge) return; // el badge puede no existir en todas las páginas
  
  const carrito = leerCarrito();
  badge.textContent = carrito.length;
  
  badge.classList.remove('oculto');
}

// ✏️ COMPLETA: Agrega un producto al carrito
function agregarAlCarrito(producto) {
  const carrito = leerCarrito();
  carrito.push(producto);
  guardarCarrito(carrito); // guarda y actualiza badge
  
  // Feedback visual al usuario
  alert(`✅ ${producto.nombre} agregado al carrito`);
}

// Conectar el botón "Agregar al carrito" del modal
const btnModalCarrito = document.querySelector('.modal-btn-carrito');
if (btnModalCarrito) {
  btnModalCarrito.addEventListener('click', function() {
    const modalEl = document.getElementById('modal-producto');
    const producto = {
      id:     modalEl.dataset.id     || '',
      nombre: document.getElementById('modal-titulo').textContent,
      precio: document.getElementById('modal-precio').textContent,
      icono:  document.getElementById('modal-icono').textContent,
      imagen: modalEl.dataset.imagen || '',
      fecha:  new Date().toLocaleDateString('es-CO')
    };
    agregarAlCarrito(producto);
    modalEl.classList.remove('visible');
  });
}

// Inicializar el badge al cargar la página
actualizarBadge();

// Clic en el badge → ir a carrito.html
const badgeContenedor = document.querySelector('.carrito-badge-contenedor');
if (badgeContenedor) {
  badgeContenedor.addEventListener('click', function() {
    window.location.href = 'carrito.html';
  });
}


// ===== S07: PÁGINA CARRITO =====

// ✏️ COMPLETA: Solo ejecutar si estamos en carrito.html
function mostrarPaginaCarrito() {
  const lista = document.getElementById('lista-carrito');
  const resumen = document.getElementById('carrito-resumen');
  if (!lista) return; // no estamos en carrito.html
  
  const carrito = leerCarrito();
  
  if (carrito.length === 0) {
    resumen.textContent = 'Tu carrito está vacío';
    lista.innerHTML = '<p class="carrito-vacio">No hay productos en el carrito. <a href="index.html">Ver productos →</a></p>';
    return;
  }
  
  resumen.textContent = `${carrito.length} producto(s) en el carrito`;
  
  lista.innerHTML = ''; // limpiar antes de renderizar
  
  carrito.forEach(function(producto, indice) {
    const item = document.createElement('div');
    item.classList.add('carrito-item');

    // Si el producto tiene imagen, mostrarla. Si no, mostrar el emoji.
    const imagenHTML = producto.imagen
      ? `<img src="${producto.imagen}" alt="${producto.nombre}" class="carrito-item-img">`
      : `<span class="carrito-item-icono">${producto.icono}</span>`;

    item.innerHTML = `
      ${imagenHTML}
      <div class="carrito-item-info">
        <div class="carrito-item-nombre">${producto.nombre}</div>
        <div class="carrito-item-precio">${producto.precio}</div>
        <div class="carrito-item-fecha">Agregado: ${producto.fecha}</div>
      </div>
      <button class="btn-eliminar" data-indice="${indice}">Eliminar</button>
    `;
    lista.appendChild(item);
  });
  
  // Conectar los botones "Eliminar"
  document.querySelectorAll('.btn-eliminar').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const indice = parseInt(this.dataset.indice);
      const carritoActual = leerCarrito();
      carritoActual.splice(indice, 1); // eliminar ese índice
      guardarCarrito(carritoActual);
      mostrarPaginaCarrito(); // re-renderizar
    });
  });
}

// Botón vaciar carrito
const btnVaciar = document.getElementById('btn-vaciar');
if (btnVaciar) {
  btnVaciar.addEventListener('click', function() {
    if (confirm('¿Seguro que quieres vaciar el carrito?')) {
      localStorage.removeItem('carrito');
      actualizarBadge();
      mostrarPaginaCarrito();
    }
  });
}

mostrarPaginaCarrito(); // llamar al cargar

// ===== S17d: ESTADO DE SESIÓN EN EL NAV — MENÚ DESPLEGABLE =====
// Si hay sesión activa: reemplaza el botón Login por un dropdown con
//   👤 Mi perfil | 📦 Mis pedidos | 🚪 Cerrar sesión
// Si no hay sesión: muestra el enlace Login normal

function actualizarNavSesion() {
  const token  = localStorage.getItem('token');
  const nombre = localStorage.getItem('usuario-nombre');
  const rol    = localStorage.getItem('usuario-rol');
  const enlaceLogin = document.querySelector('#nav-login');

  if (!enlaceLogin) return;

  if (token && nombre) {
    // ── 1. Construir el contenedor del dropdown ──────────────────────────
    // Wrap: div.usuario-dropdown — posición relativa para que el menú quede abajo
    const wrapper = document.createElement('div');
    wrapper.className = 'usuario-dropdown';

    // Botón que muestra el nombre; al hacer clic abre/cierra el menú
    const btn = document.createElement('button');
    btn.className   = 'usuario-btn';
    btn.textContent = '👤 ' + nombre;
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');

    // Menú oculto con las tres opciones
    const menu = document.createElement('div');
    menu.className = 'usuario-menu';
    menu.id        = 'usuario-menu';

    // Opción: Mi perfil
    const linkPerfil = document.createElement('a');
    linkPerfil.href        = 'perfil.html';
    linkPerfil.textContent = '👤 Mi perfil';

    // Opción: Mis pedidos
    const linkPedidos = document.createElement('a');
    linkPedidos.href        = 'mispedidos.html';
    linkPedidos.textContent = '📦 Mis pedidos';

    // Opción: Panel Admin — solo visible si el usuario tiene rol 'admin'
    const linkAdmin = document.createElement('a');
    linkAdmin.href        = 'admin.html';
    linkAdmin.textContent = '🛠️ Panel Admin';

    // Separador visual antes de "Cerrar sesión"
    const separador = document.createElement('div');
    separador.className = 'menu-separador';

    // Opción: Cerrar sesión — usa <button> para que no navegue solo
    const btnCerrar = document.createElement('button');
    btnCerrar.className   = 'btn-cerrar-sesion';
    btnCerrar.textContent = '🚪 Cerrar sesión';
    btnCerrar.addEventListener('click', function() {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario-nombre');
      localStorage.removeItem('usuario-rol');
      window.location.href = 'login.html'; // redirige al login
    });

    // Ensamblar el menú
    menu.appendChild(linkPerfil);
    menu.appendChild(linkPedidos);
    if (rol === 'admin') menu.appendChild(linkAdmin);
    menu.appendChild(separador);
    menu.appendChild(btnCerrar);

    // Ensamblar el wrapper
    wrapper.appendChild(btn);
    wrapper.appendChild(menu);

    // ── 2. Ocultar el enlace "Registro" — no tiene sentido estando logueado ──
    const navMenu = document.querySelector('#nav-menu');
    if (navMenu) {
      navMenu.querySelectorAll('a').forEach(function(a) {
        if (a.href.includes('registro.html')) a.style.display = 'none';
      });
    }

    // ── 3. Reemplazar el <a id="nav-login"> por el nuevo dropdown ────────
    enlaceLogin.parentNode.replaceChild(wrapper, enlaceLogin);

    // ── 4. Lógica de abrir / cerrar al hacer clic en el botón ───────────
    btn.addEventListener('click', function(e) {
      e.stopPropagation(); // evitar que el clic llegue al document
      const abierto = menu.classList.toggle('abierto');
      btn.setAttribute('aria-expanded', abierto); // accesibilidad
    });

    // Cerrar el menú si el usuario hace clic fuera del dropdown
    document.addEventListener('click', function cerrarMenuFuera(e) {
      if (!wrapper.contains(e.target)) {
        menu.classList.remove('abierto');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

  } else {
    // El usuario NO está logueado — mostrar el enlace Login normal
    enlaceLogin.textContent = 'Login';
    enlaceLogin.href = 'login.html';
  }
}

actualizarNavSesion(); // ejecutar al cargar cada página

// ===== S18A: CHECKOUT — PAGAR CON WOMPI =====
// Ya no se crea la orden directamente. Se pide una firma al backend,
// se abre el Widget de Wompi, y la orden se crea solo si el pago es aprobado
// (el backend lo confirma vía polling, ver /api/pagos/estado/:reference).

const btnConfirmar = document.getElementById('btn-confirmar');
let pollingInterval = null;

if (btnConfirmar) {
  btnConfirmar.addEventListener('click', async function() {
    const token   = localStorage.getItem('token');
    const carrito = leerCarrito();
    const mensaje = document.getElementById('checkout-mensaje');

    // 1. Verificar que el usuario está logueado
    if (!token) {
      mensaje.innerHTML =
        '<div style="background:#fef9c3; border:1px solid #fde047; border-radius:10px; padding:16px;">' +
          '<p style="color:#854d0e; font-weight:600;">⚠️ Debes iniciar sesión para confirmar tu pedido.</p>' +
          '<a href="login.html" style="color:#92400e;">Ir al login →</a>' +
        '</div>';
      mensaje.style.display = 'block';
      return;
    }

    // 2. Verificar que el carrito no está vacío
    if (carrito.length === 0) {
      mensaje.innerHTML =
        '<div style="background:#fef9c3; border:1px solid #fde047; border-radius:10px; padding:16px;">' +
          '<p style="color:#854d0e; font-weight:600;">⚠️ El carrito está vacío.</p>' +
        '</div>';
      mensaje.style.display = 'block';
      return;
    }

    // 3. Construir el array de productos para el backend
    // El backend espera: { productos: [{ producto: id, cantidad: 1 }], total: número }
    const productosParaEnviar = carrito.map(function(item) {
      return { producto: item.id, cantidad: 1 };
    });

    // Calcular el total — el precio viene como string "$1.299.000".
    // Los puntos son separadores de miles (formato colombiano), no decimales — hay que quitarlos.
    const total = carrito.reduce(function(acumulado, item) {
      const numero = parseFloat(item.precio.replace(/[^0-9]/g, '')) || 0;
      return acumulado + numero;
    }, 0);

    try {
      btnConfirmar.disabled    = true;
      btnConfirmar.textContent = 'Preparando pago...';

      // 4. Pedir al backend la firma de integridad (crea la Transaccion en estado PENDING)
      const respuesta = await fetch('http://localhost:3000/api/pagos/firma', {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          productos: productosParaEnviar,
          total:     total
        })
      });

      const datos = await respuesta.json();

      // 5. Si el backend respondió con error
      if (!respuesta.ok) {
        mensaje.innerHTML =
          '<div style="background:#fee2e2; border:1px solid #fca5a5; border-radius:10px; padding:16px;">' +
            '<p style="color:#991b1b; font-weight:600;">❌ ' + (datos.error || 'Error al preparar el pago') + '</p>' +
          '</div>';
        mensaje.style.display = 'block';
        btnConfirmar.disabled    = false;
        btnConfirmar.textContent = '💳 Pagar con Wompi';
        return;
      }

      // 6. Abrir el Widget de Wompi con los datos de la firma
      const checkout = new WidgetCheckout({
        currency:     datos.currency,
        amountInCents: datos.amountInCents,
        reference:    datos.reference,
        publicKey:    datos.publicKey,
        signature:    { integrity: datos.signature }
      });

      checkout.open(function() {
        // Este callback se ejecuta cuando el widget se cierra (pago terminado o cancelado)
        iniciarPolling(datos.reference, token, mensaje);
      });

    } catch (error) {
      // 7. Error de red
      mensaje.innerHTML =
        '<div style="background:#fee2e2; border:1px solid #fca5a5; border-radius:10px; padding:16px;">' +
          '<p style="color:#991b1b; font-weight:600;">❌ No se pudo conectar. Verifica que el servidor esté corriendo.</p>' +
        '</div>';
      mensaje.style.display = 'block';
      btnConfirmar.disabled    = false;
      btnConfirmar.textContent = '💳 Pagar con Wompi';
    }
  });
}

// Consulta cada 3 segundos si el pago ya fue aprobado por Wompi.
// Máximo 20 intentos (60 segundos) antes de mostrar timeout.
function iniciarPolling(reference, token, mensaje) {
  btnConfirmar.textContent = 'Confirmando pago...';
  let intentos = 0;

  pollingInterval = setInterval(async function() {
    intentos++;
    if (intentos > 20) {
      clearInterval(pollingInterval);
      mostrarResultadoPago('TIMEOUT', mensaje);
      return;
    }

    try {
      const r = await fetch('http://localhost:3000/api/pagos/estado/' + reference, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await r.json();

      if (data.status !== 'PENDING') {
        clearInterval(pollingInterval);
        mostrarResultadoPago(data.status, mensaje);
      }
    } catch (e) {
      console.error('Polling error', e);
    }
  }, 3000);
}

function mostrarResultadoPago(status, mensaje) {
  if (status === 'APPROVED') {
    localStorage.removeItem('carrito');
    actualizarBadge();

    mensaje.innerHTML =
      '<div style="background:#dcfce7; border:1px solid #bbf7d0; border-radius:10px; padding:20px;">' +
        '<p style="color:#15803d; font-weight:700; font-size:16px;">✅ ¡Pago aprobado!</p>' +
        '<p style="color:#166534; font-size:13px; margin-top:6px;">Tu orden fue registrada en el sistema.</p>' +
        '<a href="index.html" style="color:#15803d; font-weight:600;">← Volver al inicio</a>' +
      '</div>';
    mensaje.style.display = 'block';

    mostrarPaginaCarrito(); // actualizar la vista del carrito (ahora vacío)

  } else if (status === 'DECLINED') {
    mensaje.innerHTML =
      '<div style="background:#fee2e2; border:1px solid #fca5a5; border-radius:10px; padding:16px;">' +
        '<p style="color:#991b1b; font-weight:600;">❌ Pago rechazado. Intenta con otra tarjeta.</p>' +
      '</div>';
    mensaje.style.display = 'block';
    btnConfirmar.disabled    = false;
    btnConfirmar.textContent = '💳 Pagar con Wompi';

  } else {
    mensaje.innerHTML =
      '<div style="background:#fef9c3; border:1px solid #fde047; border-radius:10px; padding:16px;">' +
        '<p style="color:#854d0e; font-weight:600;">⏱️ No pudimos confirmar el pago todavía. Revisa "Mis pedidos" en un momento.</p>' +
      '</div>';
    mensaje.style.display = 'block';
    btnConfirmar.disabled    = false;
    btnConfirmar.textContent = '💳 Pagar con Wompi';
  }
}