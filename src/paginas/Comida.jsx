// hooks
import { useState, useEffect } from "react";

// componentes
import ComidaActual from "../componentes/ComidaActual";

// store
import useStore from "../stores/useStore";

export default function Comida() {
  // store
  const { alimentos } = useStore();
  console.log("Comida:", alimentos);

  return (
    <>
      <ComidaActual />
    </>
  );
}
