// perfil.js — lógica exclusiva de perfil.html
// Carga los datos del usuario logueado desde GET /api/auth/perfil

async function cargarPerfil() {
  const token = localStorage.getItem('token');

  // Si no hay token el usuario no está logueado — mostrar aviso
  if (!token) {
    document.getElementById('estado-cargando').style.display  = 'none';
    document.getElementById('estado-sin-sesion').style.display = 'block';
    return;
  }

  try {
    const respuesta = await fetch('http://localhost:3000/api/auth/perfil', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    const usuario = await respuesta.json();

    if (!respuesta.ok) throw new Error(usuario.error || 'Error al cargar el perfil');

    // Ocultar cargando y mostrar los datos
    document.getElementById('estado-cargando').style.display = 'none';
    document.getElementById('perfil-datos').style.display    = 'block';

    // Llenar el avatar con la inicial del nombre
    document.getElementById('perfil-avatar').textContent =
      usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : '?';

    // Llenar el nombre y el rol
    document.getElementById('perfil-nombre').textContent = usuario.nombre;
    document.getElementById('perfil-rol').textContent    =
      usuario.rol === 'admin' ? '⭐ Administrador' : '🛍️ Cliente';

    document.getElementById('perfil-email').textContent        = usuario.email;
    document.getElementById('perfil-departamento').textContent = usuario.departamento || 'No registrado';
    document.getElementById('perfil-municipio').textContent    = usuario.municipio    || 'No registrado';

  } catch (err) {
    document.getElementById('estado-cargando').style.display = 'none';
    document.getElementById('estado-error').style.display    = 'block';
    document.getElementById('estado-error').querySelector('p').textContent =
      '❌ ' + err.message;
  }
}

cargarPerfil();
