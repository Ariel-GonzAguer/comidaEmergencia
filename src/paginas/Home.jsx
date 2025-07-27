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

export default function Home() {
  // store
  const { alimentos, lugares, otros, notas, recetas } = useStore();

  const [alimentosObject, setAlimentosObject] = useState({});

  useEffect(() => {
    setAlimentosObject(alimentos);
  }, [alimentos]);

  return (
    <>
      <ErrorBoundary
        fallback={<div>Something went wrong</div>}
        onError={(error, info) => {
          console.error("ErrorBoundary caught an error:", error, info);
        }}
      >
        <ComidaActual />

        {/* <AgregarModal tipo="alimentos" /> */}
      </ErrorBoundary>
    </>
  );
}
