// Siembra la base LOCAL con el catálogo de frontend/data/productos.json
// Uso: DB_MODO=local en el .env y luego  npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const Producto = require('./models/Producto');
const productos = require('../frontend/data/productos.json');

async function sembrar() {
  // Freno de seguridad: el seed BORRA los productos, así que nunca corre contra Atlas
  if (process.env.DB_MODO !== 'local') {
    console.error('❌ El seed solo corre con DB_MODO=local en el .env. No se hizo nada.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI_LOCAL);
  await Producto.deleteMany({});
  await Producto.insertMany(productos);
  console.log('✅ Productos sembrados en la base local: ' + productos.length);
  await mongoose.disconnect();
}

sembrar().catch((err) => {
  console.error('❌ Error en el seed:', err.message);
  process.exit(1);
});