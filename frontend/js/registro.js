// ================================================
// S17: REGISTRO — conecta el formulario con la API
// Funciona en: registro.html
// ================================================

const URL_API_COLOMBIA = 'https://api-colombia.com/api/v1';

const selectDepto  = document.querySelector('#reg-departamento');
const selectMuni   = document.querySelector('#reg-municipio');
const formRegistro = document.querySelector('#form-registro');

// ── Cargar departamentos al abrir la página ──────────────────────────────────
async function cargarDepartamentos() {
  try {
    selectDepto.innerHTML = '<option value="">Cargando departamentos...</option>';
    const respuesta     = await fetch(`${URL_API_COLOMBIA}/Department`);
    const departamentos = await respuesta.json();

    departamentos.sort(function(a, b) { return a.name.localeCompare(b.name); });

    selectDepto.innerHTML = '<option value="">-- Selecciona un departamento --</option>';
    departamentos.forEach(function(depto) {
      const opcion = document.createElement('option');
      opcion.value       = depto.id;
      opcion.textContent = depto.name;
      selectDepto.appendChild(opcion);
    });
  } catch (error) {
    selectDepto.innerHTML = '<option value="">Error al cargar. Recarga la página.</option>';
  }
}

// ── Cargar municipios cuando el usuario elige un departamento ─────────────────
async function cargarMunicipios(idDepartamento) {
  try {
    selectMuni.disabled = true;
    selectMuni.innerHTML = '<option value="">Cargando municipios...</option>';

    const respuesta  = await fetch(`${URL_API_COLOMBIA}/Department/${idDepartamento}/cities`);
    const municipios = await respuesta.json();

    municipios.sort(function(a, b) { return a.name.localeCompare(b.name); });

    selectMuni.innerHTML = '<option value="">-- Selecciona un municipio --</option>';
    municipios.forEach(function(muni) {
      const opcion = document.createElement('option');
      opcion.value       = muni.name;
      opcion.textContent = muni.name;
      selectMuni.appendChild(opcion);
    });
    selectMuni.disabled = false;
  } catch (error) {
    selectMuni.innerHTML = '<option value="">Error al cargar municipios.</option>';
  }
}

// ── Escuchar cambio en el select de departamento ─────────────────────────────
selectDepto.addEventListener('change', function() {
  const idSeleccionado = selectDepto.value;
  if (!idSeleccionado) {
    selectMuni.innerHTML = '<option value="">Primero elige un departamento</option>';
    selectMuni.disabled  = true;
    return;
  }
  cargarMunicipios(idSeleccionado);
});

// ── Validar y enviar el registro al backend ───────────────────────────────────
if (formRegistro) {
  formRegistro.addEventListener('submit', async function(evento) {
    evento.preventDefault();

    const nombre      = document.querySelector('#reg-nombre').value.trim();
    const email       = document.querySelector('#reg-email').value.trim();
    const password    = document.querySelector('#reg-password').value;
    const municipio   = selectMuni.value;
    let hayErrores    = false;

    // Limpiar errores anteriores
    document.querySelector('#error-reg-nombre').textContent      = '';
    document.querySelector('#error-reg-email').textContent       = '';
    document.querySelector('#error-reg-password').textContent    = '';
    document.querySelector('#error-reg-departamento').textContent = '';
    document.querySelector('#error-reg-municipio').textContent   = '';

    // Validar nombre
    if (nombre.length < 3) {
      document.querySelector('#error-reg-nombre').textContent = 'Escribe tu nombre completo';
      hayErrores = true;
    }

    // Validar email
    if (!email.includes('@') || email.length < 5) {
      document.querySelector('#error-reg-email').textContent = 'Ingresa un correo válido';
      hayErrores = true;
    }

    // Validar password
    if (password.length < 6) {
      document.querySelector('#error-reg-password').textContent = 'La contraseña debe tener al menos 6 caracteres';
      hayErrores = true;
    }

    // Validar departamento
    if (!selectDepto.value) {
      document.querySelector('#error-reg-departamento').textContent = 'Selecciona un departamento';
      hayErrores = true;
    }

    // Validar municipio
    if (!municipio) {
      document.querySelector('#error-reg-municipio').textContent = 'Selecciona un municipio';
      hayErrores = true;
    }

    if (!hayErrores) {
      try {
        // Enviar al backend
        const respuesta = await fetch('http://localhost:3000/api/auth/registro', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre:       nombre,
            email:        email,
            password:     password,
            departamento: selectDepto.options[selectDepto.selectedIndex].textContent,
            municipio:    municipio
          })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          // El backend rechazó el registro (email duplicado, etc.)
          document.querySelector('#error-reg-email').textContent =
            datos.error || 'Error al crear la cuenta';
          return;
        }

        // Registro exitoso
        document.querySelector('#registro-exito').style.display = 'block';
        formRegistro.reset();
        selectMuni.innerHTML = '<option value="">Primero elige un departamento</option>';
        selectMuni.disabled  = true;

      } catch (error) {
        document.querySelector('#error-reg-nombre').textContent =
          'No se pudo conectar. Verifica que node server.js esté corriendo.';
      }
    }
  });
}

// ── Ejecutar al cargar la página ─────────────────────────────────────────────
cargarDepartamentos();