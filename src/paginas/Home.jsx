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

export default function Home() {
  // store
  const { getFirebaseData } = useStore();

  return (
    <>
      <ErrorBoundary
        fallback={<div>Something went wrong</div>}
        onError={(error, info) => {
          console.error("ErrorBoundary caught an error:", error, info);
        }}
      >
        <ComidaActual />

        <button
          onClick={getFirebaseData}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Actualizar
        </button>

        <AgregarModal tipo="lugares" />
        <AgregarModal tipo="alimentos" />
      </ErrorBoundary>
    </>
  );
}
