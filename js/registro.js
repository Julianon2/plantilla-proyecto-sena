// ================================================
// S09: REGISTRO CON API COLOMBIA
// Carga departamentos y municipios desde api-colombia.com
// Guarda el registro en LocalStorage
// ================================================

const URL_API = 'https://api-colombia.com/api/v1';

const selectDepto  = document.querySelector('#reg-departamento');
const selectMuni   = document.querySelector('#reg-municipio');
const formRegistro = document.querySelector('#form-registro');

// ── PASO 1: Cargar departamentos al abrir la página ──────────────────────────
// Se ejecuta automáticamente — el usuario ve la lista al entrar al formulario
async function cargarDepartamentos() {
  try {
    // Mostrar estado de carga mientras espera la API
    selectDepto.innerHTML = '<option value="">Cargando departamentos...</option>';

    const respuesta     = await fetch(`${URL_API}/Department`);
    const departamentos = await respuesta.json();

    // Ordenar alfabéticamente por nombre
    departamentos.sort(function(a, b) { return a.name.localeCompare(b.name); });

    // Opción inicial vacía + una opción por departamento
    selectDepto.innerHTML = '<option value="">-- Selecciona un departamento --</option>';
    departamentos.forEach(function(depto) {
      const opcion = document.createElement('option');
      opcion.value       = depto.id;       // usamos el id para pedir municipios
      opcion.textContent = depto.name;
      selectDepto.appendChild(opcion);
    });

  } catch (error) {
    // Si la API falla, mostrar mensaje claro al usuario
    selectDepto.innerHTML = '<option value="">Error al cargar. Recarga la página.</option>';
    console.error('Error cargando departamentos:', error);
  }
}

// ── PASO 2: Cargar municipios cuando el usuario elige un departamento ─────────
// Se ejecuta cada vez que cambia el select de departamento
async function cargarMunicipios(idDepartamento) {
  try {
    // Deshabilitar y mostrar estado de carga
    selectMuni.disabled = true;
    selectMuni.innerHTML = '<option value="">Cargando municipios...</option>';

    const respuesta  = await fetch(`${URL_API}/Department/${idDepartamento}/cities`);
    const municipios = await respuesta.json();

    // Ordenar alfabéticamente
    municipios.sort(function(a, b) { return a.name.localeCompare(b.name); });

    // Habilitar el select y llenar con municipios
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
    console.error('Error cargando municipios:', error);
  }
}

// ── PASO 3: Escuchar cambio en el select de departamento ─────────────────────
// Cada vez que el usuario cambia el departamento, cargar sus municipios
selectDepto.addEventListener('change', function() {
  const idSeleccionado = selectDepto.value;

  if (!idSeleccionado) {
    // Si elige la opción vacía, resetear municipios
    selectMuni.innerHTML = '<option value="">Primero elige un departamento</option>';
    selectMuni.disabled  = true;
    return;
  }

  cargarMunicipios(idSeleccionado);
});

// ── PASO 4: Validar y guardar el registro en LocalStorage ────────────────────
if (formRegistro) {
  formRegistro.addEventListener('submit', function(evento) {
    evento.preventDefault();

    const nombre      = document.querySelector('#reg-nombre').value.trim();
    const email       = document.querySelector('#reg-email').value.trim();
    const departamento = selectDepto.options[selectDepto.selectedIndex].text;
    const municipio   = selectMuni.value;
    let hayErrores    = false;

    // Validar nombre
    if (nombre.length < 3) {
      document.querySelector('#error-reg-nombre').textContent = 'Escribe tu nombre completo';
      hayErrores = true;
    } else {
      document.querySelector('#error-reg-nombre').textContent = '';
    }

    // Validar email
    if (!email.includes('@') || email.length < 5) {
      document.querySelector('#error-reg-email').textContent = 'Ingresa un correo válido';
      hayErrores = true;
    } else {
      document.querySelector('#error-reg-email').textContent = '';
    }

    // Validar departamento
    if (!selectDepto.value) {
      document.querySelector('#error-reg-departamento').textContent = 'Selecciona un departamento';
      hayErrores = true;
    } else {
      document.querySelector('#error-reg-departamento').textContent = '';
    }

    // Validar municipio
    if (!municipio) {
      document.querySelector('#error-reg-municipio').textContent = 'Selecciona un municipio';
      hayErrores = true;
    } else {
      document.querySelector('#error-reg-municipio').textContent = '';
    }

    if (!hayErrores) {
      // Guardar en LocalStorage
      const usuario = {
        nombre,
        email,
        departamento,
        municipio,
        fecha: new Date().toLocaleDateString('es-CO')
      };
      localStorage.setItem('usuario-registro', JSON.stringify(usuario));

      // Mostrar mensaje de éxito
      document.querySelector('#registro-exito').style.display = 'block';
      formRegistro.reset();
      selectMuni.innerHTML = '<option value="">Primero elige un departamento</option>';
      selectMuni.disabled  = true;
    }
  });
}

// ── Ejecutar al cargar la página ─────────────────────────────────────────────
cargarDepartamentos();

// ── BONUS: Mostrar registro guardado si existe ────────────────────────────────
function mostrarRegistroGuardado() {
  const guardado = localStorage.getItem('usuario-registro');
  if (!guardado) return;

  const usuario = JSON.parse(guardado);
  const resumen = document.querySelector('#resumen-registro');
  if (!resumen) return;

  resumen.innerHTML = `
    <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;padding:20px;margin-top:24px;">
      <h3 style="margin-bottom:12px;color:#0369a1;">👤 Cuenta registrada</h3>
      <p><strong>Nombre:</strong> ${usuario.nombre}</p>
      <p><strong>Email:</strong> ${usuario.email}</p>
      <p><strong>Ubicación:</strong> ${usuario.municipio}, ${usuario.departamento}</p>
      <p><strong>Fecha:</strong> ${usuario.fecha}</p>
      <button onclick="localStorage.removeItem('usuario-registro'); location.reload();" 
              style="margin-top:12px;padding:8px 16px;background:#ef4444;color:white;border:none;border-radius:6px;cursor:pointer;">
        Cerrar sesión
      </button>
    </div>
  `;
  resumen.style.display = 'block';
}

mostrarRegistroGuardado();