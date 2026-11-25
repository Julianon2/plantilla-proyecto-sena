import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

// Pide datos al backend con el token de la sesión.
// Devuelve { datos, cargando, error } para que cada página decida qué dibujar.
function useApi(ruta) {
  const { logout } = useContext(AuthContext);
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        const respuesta = await fetch("http://localhost:3000" + ruta, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });

        // 401: no hay token. 403: el token ya no sirve (venció o está mal).
        // Se cierra la sesión y se manda a ingresar, para volver después a esta misma página.
        if (respuesta.status === 401 || respuesta.status === 403) {
          logout();
          navegar("/login", {
            state: {
              aviso: "Tu sesión terminó. Ingresa de nuevo para continuar",
              desde: ubicacion.pathname,
            },
          });
          return;
        }
        if (!respuesta.ok) throw new Error("respuesta no válida");

        setDatos(await respuesta.json());
      } catch {
        setError("No se pudieron cargar los datos. Revisa que el backend esté encendido.");
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [ruta]);

  return { datos, cargando, error };
}

export default useApi;
