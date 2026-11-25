import { createContext, useState, useEffect } from "react";

export const FavoritosContext = createContext();

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState(() => {
    const guardado = localStorage.getItem("favoritos");
    return guardado ? JSON.parse(guardado) : [];
  });

  // Cada vez que cambia la lista, se guarda sola
  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  function esFavorito(id) {
    return favoritos.some((favorito) => favorito.id === id);
  }

  // Si ya estaba, se quita; si no estaba, se agrega
  function alternarFavorito(producto) {
    if (esFavorito(producto.id)) {
      setFavoritos(favoritos.filter((favorito) => favorito.id !== producto.id));
    } else {
      setFavoritos([...favoritos, producto]);
    }
  }

  return (
    <FavoritosContext.Provider value={{ favoritos, esFavorito, alternarFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
}
