// ================================================
// S17: LOGIN — conecta el formulario con la API
// Funciona en: login.html
// ================================================

const formLogin = document.querySelector('#form-login');

formLogin.addEventListener('submit', async function(evento) {
  evento.preventDefault();

  // Limpiar errores anteriores
  document.querySelector('#error-login-email').textContent = '';
  document.querySelector('#error-login-password').textContent = '';

  // 1. Leer los valores del formulario
  const email    = document.querySelector('#login-email').value.trim();
  const password = document.querySelector('#login-password').value;

  // 2. Validación básica
  if (!email) {
    document.querySelector('#error-login-email').textContent = 'Ingresa tu correo';
    return;
  }
  if (!password) {
    document.querySelector('#error-login-password').textContent = 'Ingresa tu contraseña';
    return;
  }

  try {
    // 3. Llamar al backend
    const respuesta = await fetch('http://localhost:3000/api/auth/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email: email, password: password })
    });

    const datos = await respuesta.json();

    // 4a. Si el backend devolvió error
    if (!respuesta.ok) {
      document.querySelector('#error-login-email').textContent =
        datos.error || 'Correo o contraseña incorrectos';
      return;
    }

    // 4b. Login exitoso — guardar token en localStorage
    localStorage.setItem('token', datos.token);
    localStorage.setItem('usuario-nombre', datos.nombre);
    localStorage.setItem('usuario-rol', datos.rol);

    // 5. Mostrar mensaje de bienvenida y redirigir al inicio
    const exito = document.querySelector('#login-exito');
    exito.innerHTML =
      '<div style="background:#dcfce7; border:1px solid #bbf7d0; border-radius:12px; padding:20px;">' +
        '<p style="color:#15803d; font-weight:700; font-size:16px;">✅ Bienvenido, ' + datos.nombre + '</p>' +
        '<p style="color:#166534; font-size:13px; margin-top:6px;">Redirigiendo a la tienda...</p>' +
      '</div>';
    exito.style.display = 'block';
    formLogin.reset();

    // Redirigir a inicio después de 1.5 segundos
    setTimeout(function() {
      window.location.href = 'index.html';
    }, 1500);

  } catch (error) {
    // 6. Error de red — el servidor no está corriendo
    document.querySelector('#error-login-email').textContent =
      'No se pudo conectar. Verifica que node server.js esté corriendo.';
  }
});