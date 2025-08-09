import { useState } from "react";

// Función para calcular los días que dura la comida
function calcularDias(totalCalorias, personas, caloriasPorDia) {
  if (caloriasPorDia <= 0 || personas <= 0) return 0;
  const caloriasTotalesPorDia = personas * caloriasPorDia;
  return totalCalorias / caloriasTotalesPorDia;
}

// Componente principal
export default function CalculadoraCalorias({ totalCalorias }) {
  // Estados para el formulario
  const [personas, setPersonas] = useState(1);
  const [caloriasPorDia, setCaloriasPorDia] = useState(0);
  const [dias, setDias] = useState(0);

  // Manejar el envío del formulario
  const manejarSubmit = (e) => {
    e.preventDefault();
  const resultado = calcularDias(totalCalorias, personas, caloriasPorDia);
  setDias(resultado);
  };

  return (
    <section className="flex flex-col items-center justify-center h-full mt-8 mb-4 border-4 border-white p-4 rounded-lg">
      <h2 className="text-xl font-bold">Calculadora de Calorías</h2>
      <form
        onSubmit={manejarSubmit}
        className="flex flex-col items-center justify-stretch h-full mt-16"
      >
        <label>
          Personas:
          <input
            type="number"
            min="1"
            value={personas === 0 ? "" : personas}
            onChange={(e) => {
              const val = e.target.value.replace(/^0+(?=\d)/, "");
              setPersonas(val === "" ? 0 : Number(val));
            }}
            className="text-background"
            required
          />
        </label>
        <br />
        <label>
          Calorías por día por persona:
          <input
            type="number"
            min="1"
            value={caloriasPorDia === 0 ? "" : caloriasPorDia}
            onChange={(e) => {
              const val = e.target.value.replace(/^0+(?=\d)/, "");
              setCaloriasPorDia(val === "" ? 0 : Number(val));
            }}
            className="text-background"
            required
          />
        </label>
        <br />
        <button type="submit" className="bg-atencion-secundary text-background font-bold hover:bg-atencion p-2 rounded cursor-pointer">Calcular</button>
      </form>
      {caloriasPorDia > 0 && personas > 0 && (
        dias < 1 ? (
          <p className="text-error font-bold">No hay suficiente comida para un día.</p>
        ) : (
          <p>
            Con {personas} personas consumiendo {caloriasPorDia} calorías por día,
            la comida alcanzaría para {dias.toFixed(2)} días.
          </p>
        )
      )}
    </section>
  );
}
