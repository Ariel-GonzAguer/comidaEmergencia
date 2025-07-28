// hooks
import { useState, useEffect } from "react";

// componentes
import AgregarButton from "../componentes/AgregarButton";

// error-bundary
import { ErrorBoundary } from "react-error-boundary";

// componentes
import ComidaActual from "../componentes/ComidaActual";

// store

export default function Home() {
  // store

  return (
    <>
      <ErrorBoundary
        fallback={<div>Something went wrong</div>}
        onError={(error, info) => {
          console.error("ErrorBoundary caught an error:", error, info);
        }}
      >
        <ComidaActual />
        <AgregarButton tipo="alimentos" />

      </ErrorBoundary>
    </>
  );
}
