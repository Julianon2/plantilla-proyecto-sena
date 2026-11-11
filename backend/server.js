// 1. Importar las dependencias
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const mongoose = require('mongoose');
const Producto = require('./models/Producto');
const authRoutes    = require('./routes/auth');
const verificarToken = require('./middleware/auth');
const productosRoutes = require('./routes/productos');
const ordenesRoutes   = require('./routes/ordenes');
const pagoRoutes      = require('./routes/pago');  // ← AGREGAR S18A
const contactoRoutes  = require('./routes/contacto');

// 2. Crear la aplicación y definir el puerto
const app  = express();
const PORT = process.env.PORT || 3000; 

// 3. Activar middlewares
app.use(cors());
app.use(express.json());

// 4. Conectar con MongoDB: local o Atlas, según DB_MODO en el .env
const modo = process.env.DB_MODO === 'local' ? 'local' : 'atlas';
const uri  = modo === 'local'
  ? process.env.MONGODB_URI_LOCAL
  : process.env.MONGODB_URI_ATLAS;

mongoose.connect(uri)
  .then(() => console.log('✅ Conectado a MongoDB (' + modo + ')'))
  .catch((err) => console.error('❌ Error de conexión:', err));

// 9. Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor TechStore Pro ✅', baseDeDatos: modo });
});

// 10. Arrancar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});

// 11. Rutas de autenticación
app.use('/api/auth', authRoutes);

// 12. Rutas de productos ← AGREGAR S15
app.use('/api/productos', productosRoutes);

// 13. Rutas de órdenes
app.use('/api/ordenes', ordenesRoutes);  // ← AGREGAR S15

// 14. Rutas de pagos (Wompi) ← AGREGAR S18A
// El webhook queda expuesto en /api/pagos/webhook dentro del mismo router
app.use('/api/pagos', pagoRoutes);

// 15. Rutas de contacto ← AGREGAR S27
app.use('/api/contacto', contactoRoutes);