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
import CalculadoraCalorias from "../componentes/CalculadoraCalorias";

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
        <section className="flex items-center justify-between max-w-9/10 gap-10 mt-4 flex-wrap m-[0_auto]">
          <p>
            <strong>Alimentos totales:</strong>
            <span className="text-atencion-secundary">
              {Object.entries(alimentos).length}
            </span>
          </p>
          <p>
            <strong>Medicamentos totales:</strong>
            <span className="text-atencion-secundary">
              {Object.entries(medicamentos).length}
            </span>
          </p>
          <p>
            <strong>Lugares totales:</strong>
            <span className="text-atencion-secundary">
              {Object.entries(lugares).length}
            </span>
          </p>
          <p>
            <strong>Otros totales:</strong>
            <span className="text-atencion-secundary">
              {Object.entries(otros).length}
            </span>
          </p>
          <p>
            <strong>Notas totales:</strong>
            <span className="text-atencion-secundary">
              {Object.entries(notas).length}
            </span>
          </p>
          <p>
            <strong>Recetas totales:</strong>
            <span className="text-atencion-secundary">
              {Object.entries(recetas).length}
            </span>
          </p>
        </section>
        {/* Calorías totales y calculadora */}
        <section>
          <h3>
            <strong>Calorías totales: </strong>
            <span className="text-atencion-secundary">
              {getTotalCalorias()}
            </span>
          </h3>
        </section>
        <CalculadoraCalorias totalCalorias={getTotalCalorias()} />
      </ErrorBoundary>
    </section>
  );
}
