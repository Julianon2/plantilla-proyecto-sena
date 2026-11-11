const mongoose = require('mongoose');
const { Schema } = mongoose;

const transaccionSchema = new Schema({

  // Referencia única generada por nosotros para identificar el pago ante Wompi
  wompiReference: { type: String, unique: true, required: true },

  // Monto en centavos y moneda — así lo exige la firma de integridad de Wompi
  amountInCents: { type: Number, required: true },
  currency:      { type: String, default: 'COP' },

  // Estado del intento de pago (no confundir con el estado de la Orden)
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'DECLINED', 'VOIDED', 'ERROR'],
    default: 'PENDING'
  },

  wompiTransactionId: { type: String },

  // Se llena solo si el pago fue aprobado y se creó la Orden
  orden: {
    type: Schema.Types.ObjectId,
    ref: 'Orden'
  },

  // Datos del carrito guardados temporalmente hasta que Wompi confirme el pago
  pendingOrderData: {
    usuario:   Schema.Types.ObjectId,
    productos: Array,
    total:     Number
  }

}, { timestamps: true });  // agrega createdAt y updatedAt

const Transaccion = mongoose.model('Transaccion', transaccionSchema);
module.exports = Transaccion;
