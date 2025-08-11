/**
 * Componente para calcular cuántos días alcanza la comida según calorías disponibles, cantidad de personas y requerimiento diario.
 */

import { useState, useRef } from "react";

/**
 * Calcula cuántos días alcanza la comida disponible.
 * @param {number} totalCalorias - Calorías totales disponibles.
 * @param {number} personas - Cantidad de personas.
 * @param {number} caloriasPorDia - Calorías requeridas por persona y por día.
 * @returns {number} Días (decimal) que alcanza la comida.
 */
function calcularDias(totalCalorias, personas, caloriasPorDia) {
  if (caloriasPorDia <= 0 || personas <= 0) return 0;
  const caloriasTotalesPorDia = personas * caloriasPorDia;
  return totalCalorias / caloriasTotalesPorDia;
}

/**
 * Componente CalculadoraCalorias
 * @param {Object} props
 * @param {number} props.totalCalorias - Calorías totales disponibles (sumadas de todos los alimentos).
 * @returns {JSX.Element}
 */
export default function CalculadoraCalorias({ totalCalorias }) {
  // ref para cantidad de personas
  const personasRef = useRef(0);
  // ref para calorías por día por persona
  const caloriasPorDiaRef = useRef(2000);
  // Estado para resultado de días
  const [dias, setDias] = useState(0);

  /**
   * Maneja el envío del formulario y calcula los días.
   * @param {React.FormEvent} e
   */
  const manejarSubmit = (e) => {
    e.preventDefault();
    const resultado = calcularDias(
      totalCalorias,
      personasRef.current.value,
      caloriasPorDiaRef.current.value
    );
    setDias(resultado);
  };

  // Renderiza el formulario y el resultado
  return (
    <section className="flex flex-col items-center justify-center h-full mt-8 mb-4 border-4 border-white p-4 rounded-lg">
      {/* Título descriptivo */}
      <h2 className="text-xl font-bold">Calculadora de Calorías</h2>
      {/* Formulario para ingresar datos */}
      <form
        onSubmit={manejarSubmit}
        className="flex flex-col items-center justify-stretch h-full mt-16"
      >
        {/* Campo para cantidad de personas */}
        <label>
          Personas:
          <input
            type="number"
            min="1"
            defaultValue={1}
            ref={personasRef}
            className="text-background"
            required
          />
        </label>
        <br />
        {/* Campo para calorías por día por persona */}
        <label>
          Calorías por día por persona:
          <input
            type="number"
            min="1"
            defaultValue={2000}
            ref={caloriasPorDiaRef}
            className="text-background"
            required
          />
        </label>
        <br />
        {/* Botón para calcular */}
        <button
          type="submit"
          className="bg-atencion-secundary text-background font-bold hover:bg-atencion p-2 rounded cursor-pointer"
        >
          Calcular
        </button>
      </form>
      {/* Resultado: muestra días en decimales o mensaje si no alcanza */}
      {caloriasPorDiaRef.current.value > 0 &&
        personasRef.current.value > 0 &&
        (dias < 1 ? null : (
          <p>
            Con {personasRef.current.value} personas consumiendo {caloriasPorDiaRef.current.value} calorías por día, la comida alcanzaría para <strong>{dias.toFixed(2)}</strong> días.
          </p>
        ))}
      {caloriasPorDiaRef.current.value > 0 && personasRef.current.value > 0 && dias < 1 && (
        <p className="text-error font-bold">
          No hay suficiente comida para un día.
        </p>
      )}
    </section>
  );
}
