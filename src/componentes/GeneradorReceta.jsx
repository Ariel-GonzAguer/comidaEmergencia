// hooks
import { useRef, useState } from "react";

// estrategia de toast
import mostrarToastStrategy from "../scripts/strategies/toastStrategy";

// componentes
import RecetaIA from "./RecetaIA.jsx";

export default function GeneradorRecetas() {
  const [receta, setReceta] = useState({
    nombre: "",
    ingredientes: [],
    calorias: "",
    instrucciones: "",
  });

  const [loading, setLoading] = useState(false);

  const [openForm, setOpenForm] = useState(false);

  const inputRef = useRef("");

  function handleOpenForm() {
    setOpenForm(!openForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setReceta({
      nombre: "",
      ingredientes: [],
      calorias: "",
      instrucciones: "",
      id: "",
    });
    try {
      setOpenForm(false);
      const result = await fetch(`/api/openAI_RecipeService`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: inputRef.current.value.split(","),
        }),
      });
      const data = await result.json();
      let recetaGenerada = JSON.parse(data.output.replace(/'/g, '"'));
      setReceta({
        nombre: recetaGenerada.nombre || "",
        ingredientes: [recetaGenerada.ingredientes.join(", ")],
        calorias: recetaGenerada.calorias || "",
        instrucciones: recetaGenerada.instrucciones || "",
        id: recetaGenerada.id,
      });
      setLoading(false); // Desactivar loading tras procesar correctamente
    } catch (err) {
      console.error("Error al parsear la receta generada:", err);
      mostrarToastStrategy("error", {
        mensaje:
          "No se pudo parsear la receta generada. Mostrando texto original.",
      });
      setReceta({
        nombre: "Receta generada (texto)",
        ingredientes: [],
        calorias: "",
        instrucciones: "",
        id: "",
      });
      setLoading(false);
    } finally {
      inputRef.current.value = ""; // Limpiar el input después de enviar
    }
  }

  return (
    <>
      <button
        onClick={handleOpenForm}
        className="bg-light-primary text-background font-bold py-2 px-4 rounded cursor-pointer hover:bg-light-secundary mt-8 mb-4"
      >
        Generador de Recetas con IA
      </button>

      {openForm && (
        <form
          className="flex flex-col justify-center items-center mt-4 mb-4"
          onSubmit={handleSubmit}
        >
          <p>
            Escriba los ingredientes con los que quiere que la IA genere la
            receta. Separe cada ingrediente con una coma.
          </p>
          <label htmlFor="ingredientes">
            <textarea
              id="ingredientes"
              placeholder="Ingredientes"
              defaultValue={receta.ingredientes.join(",")}
              ref={inputRef}
              className="resize-none h-32 w-82 text-background"
            />
          </label>
          <button
            type="submit"
            className="bg-atencion-secundary text-background font-bold rounded p-2 cursor-pointer hover:bg-atencion"
          >
            Generar Receta
          </button>
        </form>
      )}
      <RecetaIA
        nombre={receta.nombre}
        ingredientes={receta.ingredientes}
        calorias={receta.calorias}
        instrucciones={receta.instrucciones}
        loadingState={loading}
      />
    </>
  );
}
