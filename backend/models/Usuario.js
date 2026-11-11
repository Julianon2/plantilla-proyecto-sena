// 1. Importar Mongoose
const mongoose = require('mongoose');

// 2. Schema del usuario
const usuarioSchema = new mongoose.Schema({
  nombre:       { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  password:     { type: String, required: true },
  departamento: { type: String, default: '' },
  municipio:    { type: String, default: '' },
  rol:          { type: String,
                 enum: ['admin', 'cliente'],
                 default: 'cliente' }
});

// 3. Exportar el Model
const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;