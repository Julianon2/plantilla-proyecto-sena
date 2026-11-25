import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(
    localStorage.getItem("usuario-nombre"),
  );
  const [rol, setRol] = useState(localStorage.getItem("usuario-rol"));

  function login(nombre, token, rolNuevo) {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario-nombre", nombre);
    localStorage.setItem("usuario-rol", rolNuevo);
    setUsuario(nombre);
    setRol(rolNuevo);
  }

  // Al cambiar el nombre en el perfil, el saludo del Navbar debe cambiar también
  function actualizarNombre(nombre) {
    localStorage.setItem("usuario-nombre", nombre);
    setUsuario(nombre);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario-nombre");
    localStorage.removeItem("usuario-rol");
    setUsuario(null);
    setRol(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, rol, login, logout, actualizarNombre }}>
      {children}
    </AuthContext.Provider>
  );
}