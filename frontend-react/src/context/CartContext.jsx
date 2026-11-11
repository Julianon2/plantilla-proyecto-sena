import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const guardado = localStorage.getItem("carrito");
    return guardado ? JSON.parse(guardado) : [];
  });

  // Cada vez que cambia el carrito, se guarda solo
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(items));
  }, [items]);

  function agregarAlCarrito(producto) {
    const existe = items.find((item) => item.id === producto.id);
    if (existe) {
      setItems(
        items.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item,
        ),
      );
    } else {
      setItems([...items, { ...producto, cantidad: 1 }]);
    }
  }

  function cambiarCantidad(id, cambio) {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + cambio } : item,
      ),
    );
  }

  function quitarDelCarrito(id) {
    setItems(items.filter((item) => item.id !== id));
  }

  function vaciarCarrito() {
    setItems([]);
  }

  return (
    <CartContext.Provider
      value={{ items, agregarAlCarrito, cambiarCantidad, quitarDelCarrito, vaciarCarrito }}
    >
      {children}
    </CartContext.Provider>
  );
}