const express        = require('express');
const crypto         = require('crypto');   // nativo de Node
const Orden          = require('../models/Orden');
const Producto       = require('../models/Producto');
const Transaccion    = require('../models/Transaccion');
const verificarToken = require('../middleware/auth');
const router         = express.Router();

// POST /api/pagos/firma — generar firma de integridad para el Widget de Wompi
// El navegador solo dice QUÉ productos y CUÁNTOS: el total lo calcula este servidor
// con los precios de la base de datos, porque lo que llega del navegador se puede alterar.
// Luego genera una referencia única, calcula la firma SHA256 y guarda el pedido
// en Transaccion con estado PENDING.
router.post('/firma', verificarToken, async (req, res) => {
  const { productos } = req.body;

  if (!Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: 'Carrito vacío' });
  }

  // 1. Revisar cada línea: el id del producto y una cantidad entera de 1 en adelante
  const lineas = [];
  for (const p of productos) {
    const id = Number(p?.id);
    const cantidad = Number(p?.cantidad);
    if (!Number.isInteger(id) || !Number.isInteger(cantidad) || cantidad < 1) {
      return res.status(400).json({ error: 'Carrito con productos inválidos' });
    }
    lineas.push({ id, cantidad });
  }

  try {
    // 2. Traer de la base los productos del carrito, con sus precios reales
    const ids = lineas.map((l) => l.id);
    const enBase = await Producto.find({ id: { $in: ids } });

    // 3. El total lo calcula el servidor: precio ("$8.999.000" → 8999000) por cantidad.
    //    De paso arma las líneas de la orden con el _id de MongoDB que guarda el modelo Orden
    let total = 0;
    const items = [];
    for (const l of lineas) {
      const prod = enBase.find((x) => x.id === l.id);
      if (!prod) return res.status(400).json({ error: 'Carrito con productos inválidos' });
      total += Number(prod.precio.replace(/[$.]/g, '')) * l.cantidad;
      items.push({ producto: prod._id, cantidad: l.cantidad });
    }
    if (!total) return res.status(400).json({ error: 'No se pudo calcular el total' });

    // 4. Referencia única para esta transacción
    const reference = `TS-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const amountInCents = Math.round(total * 100);
    const currency = 'COP';

    // 5. Calcular firma de integridad — fórmula oficial Wompi
    const raw = `${reference}${amountInCents}${currency}${process.env.WOMPI_INTEGRITY_SECRET}`;
    const signature = crypto.createHash('sha256').update(raw).digest('hex');

    // 6. Guardar el carrito (ya validado) y el total en la Transaccion con estado PENDING
    await Transaccion.create({
      wompiReference: reference, amountInCents, currency,
      status: 'PENDING',
      pendingOrderData: { usuario: req.usuario.id, productos: items, total }
    });

    // 7. Devolver datos al Widget de Wompi en el frontend
    res.json({
      reference, amountInCents, currency, signature,
      publicKey: process.env.WOMPI_PUBLIC_KEY
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al generar la firma' });
  }
});

// Crea la Orden cuando Wompi confirma un pago APPROVED (usada por el polling y por el webhook)
async function confirmarAprobado(transaccion, wompiTx) {
  transaccion.status = wompiTx.status;
  transaccion.wompiTransactionId = wompiTx.id;

  if (wompiTx.status === 'APPROVED' && !transaccion.orden) {
    const pod = transaccion.pendingOrderData;
    const orden = await Orden.create({
      usuario: pod.usuario, productos: pod.productos, total: pod.total,
      wompiTransactionId: wompiTx.id, wompiReference: wompiTx.reference,
      estado: 'PAGO_CONFIRMADO'
    });
    transaccion.orden = orden._id;
  }

  await transaccion.save();
}

// GET /api/pagos/estado/:reference — polling
// El frontend consulta esta ruta cada 3 segundos para saber si el pago fue aprobado.
// Sin ngrok no llega el webhook de Wompi, así que mientras la Transaccion siga PENDING
// consultamos directamente la API pública de Wompi con la referencia para saber el resultado.
router.get('/estado/:reference', verificarToken, async (req, res) => {
  try {
    const tx = await Transaccion.findOne({ wompiReference: req.params.reference });
    if (!tx) return res.status(404).json({ error: 'Transacción no encontrada' });

    if (tx.status === 'PENDING') {
      // La API de transacciones de Wompi requiere la llave PRIVADA, no la pública
      const wompiRes = await fetch(
        `https://sandbox.wompi.co/v1/transactions?reference=${tx.wompiReference}`,
        { headers: { Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}` } }
      );

      if (!wompiRes.ok) {
        console.error('Error consultando Wompi:', wompiRes.status, await wompiRes.text());
      } else {
        const wompiJson = await wompiRes.json();
        const wompiTx = wompiJson.data?.[0];

        if (wompiTx && wompiTx.status !== 'PENDING') {
          await confirmarAprobado(tx, wompiTx);
        }
      }
    }

    res.json({ status: tx.status, ordenId: tx.orden ?? null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// POST /api/pagos/webhook — Wompi llama a esta ruta en producción
// (cuando hay servidor público). En desarrollo local el polling cubre esta función.
router.post('/webhook', async (req, res) => {
  const { signature, timestamp, data } = req.body;
  const secret = process.env.WOMPI_EVENTS_SECRET;
  if (!secret) return res.status(200).json({ ok: true }); // sin secreto → modo dev, ignorar

  const tx = data?.transaction;
  if (!tx) return res.status(400).json({ error: 'Payload inválido' });

  // Verificar firma del webhook (fórmula oficial Wompi)
  const props = (signature?.properties || []).map((prop) => {
    const path = prop.split('.').slice(1);
    let v = tx; for (const k of path) v = v?.[k]; return v;
  }).join('');

  const computed = crypto.createHash('sha256')
    .update(`${props}${timestamp}${secret}`).digest('hex');
  if (computed !== signature?.checksum) return res.status(400).json({ error: 'Firma inválida' });

  const transaccion = await Transaccion.findOne({ wompiReference: tx.reference });
  if (!transaccion) return res.status(404).json({ error: 'Transacción no encontrada' });

  await confirmarAprobado(transaccion, tx);
  res.json({ ok: true });
});

module.exports = router;
