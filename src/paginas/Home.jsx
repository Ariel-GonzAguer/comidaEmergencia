/**
 * Página principal Home
 * Muestra el dashboard con botones para agregar elementos, estadísticas y utilidades clave.
 * Incluye manejo de errores con ErrorBoundary y cálculo de calorías totales.
 *
 * Estructura:
 * - Botones para agregar cada tipo de elemento (alimentos, lugares, notas, recetas, medicamentos, otros)
 * - Generador de recetas con IA
 * - Estadísticas de totales por tipo
 * - Calorías totales y calculadora de días
 *
 * Lógica principal:
 * - Obtiene los datos del store global
 * - Calcula la suma total de calorías de los alimentos
 * - Renderiza componentes clave y estadísticas
 * - Maneja errores globales con ErrorBoundary
 *
 * @returns {JSX.Element} Página principal con dashboard y utilidades
 */
// componentes
import AgregarButton from "../componentes/AgregarButton";
import GeneradorRecetas from "../componentes/GeneradorReceta";
import CalculadoraCalorias from "../componentes/CalculadoraCalorías";

// error-bundary
import { ErrorBoundary } from "react-error-boundary";

// data
import { keysArray } from "../servicios/firebaseService";

// store
import useStore from "../stores/useStore";

export default function Home() {
  const { alimentos, medicamentos, lugares, otros, notas, recetas } =
    useStore();

  /**
   * Calcula la suma total de calorías de todos los alimentos.
   * @returns {number} Calorías totales
   */
  function getTotalCalorias() {
    return Object.values(alimentos).reduce(
      (acc, alimento) => acc + (Number(alimento.calorias) || 0),
      0
    );
  }

  return (
    <section className="flex flex-col items-center justify-center h-full">
      {/* ErrorBoundary para capturar errores globales en la página */}
      <ErrorBoundary
        fallback={<div>Something went wrong</div>}
        onError={(error, info) => {
          console.error("ErrorBoundary caught an error:", error, info);
        }}
      >
        {/* Botones para agregar cada tipo de elemento */}
        <section className="flex items-center justify-center w-full mt-4 flex-wrap m-[0_auto]">
          {keysArray.map((key) => {
            return <AgregarButton key={key} tipo={key} />;
          })}
        </section>
        {/* Generador de recetas con IA */}
        <GeneradorRecetas />

        {/* Estadísticas de totales por tipo */}
        <section className="flex items-center justify-between max-w-9/10 gap-4 mt-4 flex-wrap m-[0_auto]">
          <p>
            <strong>Alimentos</strong> totales:{" "}
            {Object.entries(alimentos).length}
          </p>
          <p>
            <strong>Medicamentos</strong> totales:{" "}
            {Object.entries(medicamentos).length}
          </p>
          <p>
            <strong>Lugares</strong> totales: {Object.entries(lugares).length}
          </p>
          <p>
            <strong>Otros</strong> totales: {Object.entries(otros).length}
          </p>
          <p>
            <strong>Notas</strong> totales: {Object.entries(notas).length}
          </p>
          <p>
            <strong>Recetas</strong> totales: {Object.entries(recetas).length}
          </p>
        </section>
        {/* Calorías totales y calculadora */}
        <section>
          <h3>
            <strong>Calorías</strong> totales: {getTotalCalorias()}
          </h3>
        </section>
        <CalculadoraCalorias totalCalorias={getTotalCalorias()} />
      </ErrorBoundary>
    </section>
  );
}
