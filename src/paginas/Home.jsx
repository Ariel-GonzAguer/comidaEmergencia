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

  // Calcular suma total de calorías
  function getTotalCalorias() {
    return Object.values(alimentos).reduce(
      (acc, alimento) => acc + (Number(alimento.calorias) || 0),
      0
    );
  }

  return (
    <section className="flex flex-col items-center justify-center h-full">
      <ErrorBoundary
        fallback={<div>Something went wrong</div>}
        onError={(error, info) => {
          console.error("ErrorBoundary caught an error:", error, info);
        }}
      >
        <section className="flex items-center justify-center w-full mt-4 flex-wrap m-[0_auto]">
          {keysArray.map((key) => {
            return <AgregarButton key={key} tipo={key} />;
          })}
        </section>
        <GeneradorRecetas />

        <section className="flex items-center justify-between max-w-9/10 gap-4 mt-4 flex-wrap m-[0_auto]">
          <p>
            <strong>Alimentos</strong> totales:<strong></strong>{" "}
            {Object.entries(alimentos).length}
          </p>
          <p>
            <strong>Medicamentos</strong> totales:<strong></strong>{" "}
            {Object.entries(medicamentos).length}
          </p>
          <p>
            <strong>Lugares</strong> totales:<strong></strong>{" "}
            {Object.entries(lugares).length}
          </p>
          <p>
            <strong>Otros</strong> totales:<strong></strong>{" "}
            {Object.entries(otros).length}
          </p>
          <p>
            <strong>Notas</strong> totales:<strong></strong>{" "}
            {Object.entries(notas).length}
          </p>
          <p>
            <strong>Recetas</strong> totales:<strong></strong>{" "}
            {Object.entries(recetas).length}
          </p>
        </section>
        <section>
          <h3>
            <strong>Calorías</strong> totales:
            {getTotalCalorias()}
          </h3>
        </section>
        <CalculadoraCalorias totalCalorias={getTotalCalorias()} />
      </ErrorBoundary>
    </section>
  );
}
