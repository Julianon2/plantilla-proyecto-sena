import { useState } from "react";

function Contador() {
  const [cuenta, setCuenta] = useState(0);

  return (
    <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow-md">
      <p className="text-4xl font-extrabold text-verde">{cuenta}</p>
      <div className="flex gap-3">
        <button
          onClick={() => setCuenta(cuenta > 0 ? cuenta - 1 : 0)}
          className="w-10 h-10 bg-slate-200 rounded-lg font-bold text-xl"
        >
          −
        </button>
        <button
          onClick={() => setCuenta(cuenta + 1)}
          className="w-10 h-10 bg-verde text-white rounded-lg font-bold text-xl"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default Contador;
