// El precio llega como texto: "$8.999.000". Para sumar hay que volverlo número.
export function precioANumero(precio) {
  return Number(precio.replace(/[$.]/g, ""));
}

// Y para mostrarlo, de número otra vez a texto con puntos: 8999000 -> "$8.999.000"
export function formatearPrecio(numero) {
  return "$" + numero.toLocaleString("es-CO");
}