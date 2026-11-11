// 1. Importar dependencias
const express        = require('express');
const Producto       = require('../models/Producto');
const verificarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/admin');  // ← middleware S15
const router         = express.Router();

// 2. GET / — público, sin token
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// 2b. GET /:id — un solo producto por su _id (público)
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// 3. POST / — solo admin (verificarToken + verificarAdmin)
router.post('/', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const nuevo = await Producto.create(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. PUT /:id — solo admin
router.put('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const actualizado = await Producto.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    if (!actualizado) return res.status(404).json({ error: 'No encontrado' });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. DELETE /:id — solo admin
router.delete('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const eliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'No encontrado' });
    res.json({ mensaje: 'Eliminado', eliminado });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 6. Exportar
module.exports = router;