import { useState, useEffect } from "react";

const URL_COLOMBIA = "https://api-colombia.com/api/v1";

function porNombre(a, b) {
  return a.name.localeCompare(b.name);
}

// Departamentos de Colombia y los municipios del departamento elegido (por su nombre)
function useColombia(departamento) {
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);

  const elegido = departamentos.find((d) => d.name === departamento);
  const departamentoId = elegido ? elegido.id : null;

  useEffect(() => {
    fetch(URL_COLOMBIA + "/Department")
      .then((res) => res.json())
      .then((datos) => setDepartamentos(datos.sort(porNombre)))
      .catch(() => setDepartamentos([]));
  }, []);

  useEffect(() => {
    if (!departamentoId) {
      setMunicipios([]);
      return;
    }
    let vigente = true;
    fetch(URL_COLOMBIA + "/Department/" + departamentoId + "/cities")
      .then((res) => res.json())
      .then((datos) => {
        if (vigente) setMunicipios(datos.sort(porNombre));
      })
      .catch(() => {
        if (vigente) setMunicipios([]);
      });
    return () => {
      vigente = false;
    };
  }, [departamentoId]);

  return { departamentos, municipios };
}

export default useColombia;
