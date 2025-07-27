// hooks
import { useState, useEffect } from "react";

// componentes
import AgregarModal from "../componentes/AgregarModal";

// error-bundary
import { ErrorBoundary } from "react-error-boundary";

// componentes
import ComidaActual from "../componentes/ComidaActual";

// store
import useStore from "../stores/useStore";
useStore.persist.rehydrate(); // <- fuerza escritura / lectura

export default function Comida() {
  // store
  const { alimentos, lugares, otros, notas, recetas } = useStore();

  const [alimentosObject, setAlimentosObject] = useState({});

  useEffect(() => {
    setAlimentosObject(alimentos);
  }, [alimentos]);

  return (
    <>
      <ComidaActual />
      <ErrorBoundary
        fallback={<div>Something went wrong</div>}
        onError={(error, info) => {
          console.error("ErrorBoundary caught an error:", error, info);
        }}
      >
        <AgregarModal tipo="recetas" />
      </ErrorBoundary>

      {alimentosObject && Object.keys(alimentosObject).length > 0 ? (
        <div className="comida-container">
          {Object.values(alimentosObject).map((alimento) => (
            <div key={alimento.id} className="comida-item">
              <h3>{alimento.nombre}</h3>
              <p>Tipo: {alimento.tipo}</p>
              <p>Calorías: {alimento.calorias}</p>
              <p>Cantidad: {alimento.cantidad}</p>
              <p>Fecha de Vencimiento: {alimento.fechaVencimiento}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay alimentos disponibles.</p>
      )}
    </>
  );
}
