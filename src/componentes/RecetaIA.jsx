// hooks
import { useState } from "react";

// store
import useStore from "../stores/useStore";

// clases
import RecetaClass from "../clases/RecetaClass.js";

// estrategia de toast
import mostrarToastStrategy from "../scripts/strategies/toastStrategy";

// validación - zod
import { recetaSchema } from "../servicios/esquemasZod";

export default function RecetaIA({
  nombre,
  ingredientes,
  calorias,
  instrucciones,
  loadingState,
}) {
  const [guardada, setGuardada] = useState(false);

  // store
  const { agregarElemento } = useStore();

  // Actualizar receta cada vez que cambian las props
  const receta = {
    nombre: nombre || "",
    ingredientes: ingredientes || [],
    calorias: calorias || "",
    instrucciones: instrucciones || "",
  };

  async function handleGuardarReceta() {
    try {
      const resultadoValidacion = await recetaSchema.parseAsync(receta);
      const recetaInstancia = RecetaClass.crearReceta(
        resultadoValidacion.nombre,
        resultadoValidacion.ingredientes.join(", "),
        resultadoValidacion.calorias,
        resultadoValidacion.instrucciones
      );
      agregarElemento(recetaInstancia.getReceta(), "recetas");
      setGuardada(true);
      mostrarToastStrategy("success", { mensaje: "Receta guardada con éxito" });
      setInterval(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      mostrarToastStrategy("error", { mensaje: "Error al guardar la receta" });
    }
  }

  function handleEliminarReceta() {
    window.location.reload();
  }

  return (
    <section>
      {loadingState ? (
        <>
          <p>Hay un gato creando su receta...</p>
          <img src="/OrangeCat_SVG.svg" alt="Cargando..." />
        </>
      ) : receta.nombre ? (
        <article className="w-full max-w-3xl p-4 border-2 border-gray-300 rounded-lg">
          <details>
            <summary className="text-3xl text-center font-bold mb-2 text-white">
              {receta.nombre}
            </summary>
            <p>
              <strong>Ingredientes:</strong> {receta.ingredientes.join(", ")}
            </p>
            <p>
              <strong>Calorías:</strong> {receta.calorias}
            </p>
            <p>
              <strong>Instrucciones:</strong> {receta.instrucciones}
            </p>
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={handleGuardarReceta}
                className="bg-good text-white font-bold py-2 px-4 rounded cursor-pointer hover:bg-atencion hover:text-background"
              >
                Guardar receta
              </button>
              {!guardada && (
                <button
                  type="button"
                  onClick={handleEliminarReceta}
                  className="bg-error text-white font-bold py-2 px-4 rounded cursor-pointer hover:bg-warning hover:text-background"
                >
                  Eliminar receta
                </button>
              )}
            </div>
          </details>
        </article>
      ) : null}
    </section>
  );
}
