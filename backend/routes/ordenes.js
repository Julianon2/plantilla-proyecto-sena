const express        = require('express');
const mongoose       = require('mongoose');
const Orden          = require('../models/Orden');
const verificarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/admin');
const router         = express.Router();

// POST /api/ordenes — crear una orden
// El usuario logueado crea su propia orden
router.post('/', verificarToken, async (req, res) => {
  try {
    const { productos, total } = req.body;

    // Filtrar productos con ObjectId válido — evita el error de cast
    const productosValidos = (productos || []).filter(p =>
      p.producto && mongoose.Types.ObjectId.isValid(p.producto)
    );

    if (productosValidos.length === 0) {
      return res.status(400).json({
        error: 'El carrito no tiene productos válidos. Vacía el carrito, agrega productos desde la tienda e intenta de nuevo.'
      });
    }

    const nuevaOrden = await Orden.create({
      usuario:   req.usuario.id,
      productos: productosValidos,
      total
    });
    res.status(201).json(nuevaOrden);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/ordenes/admin/todas — el admin ve TODAS las órdenes de todos los usuarios
// Declarada antes de "GET /" para no chocar con futuras rutas GET /:id
router.get('/admin/todas', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const ordenes = await Orden
      .find({})
      .populate('usuario', 'nombre email')
      .populate('productos.producto', 'nombre precio')
      .sort({ createdAt: -1 });
    res.json(ordenes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/ordenes/:id/estado — el admin cambia el estado de una orden
// Mismo orden que ESTADOS_ORDEN en frontend/js/admin.js: el flujo real empieza
// en PAGO_CONFIRMADO (la orden solo existe tras el pago aprobado por Wompi).
const ESTADOS_VALIDOS = ['PAGO_CONFIRMADO', 'procesando', 'enviado', 'entregado', 'pendiente'];

router.patch('/:id/estado', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { estado } = req.body;

    if (!ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const orden = await Orden.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    );

    if (!orden) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json(orden);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/ordenes — mis órdenes
// Cada usuario ve solo sus propias órdenes
router.get('/', verificarToken, async (req, res) => {
  try {
    const ordenes = await Orden
      .find({ usuario: req.usuario.id })
      .populate('usuario', 'nombre email')
      .populate('productos.producto', 'nombre precio');
    res.json(ordenes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;