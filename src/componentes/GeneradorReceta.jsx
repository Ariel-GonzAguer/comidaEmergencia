// hooks
import { useRef, useState } from "react";

export default function GeneradorRecetas() {
  const [receta, setReceta] = useState({
    nombre: "",
    ingredientes: [],
    calorias: "",
    notas: "",
  });

  const [openForm, setOpenForm] = useState(false);

  const inputRef = useRef("");

  function handleOpenForm() {
    setOpenForm(!openForm);
  }

  async function handleSubmit(e) {
    // console.log("submit");
    e.preventDefault();
    const result = await fetch(`/api/openAI_RecipeService`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: inputRef.current.value.split(","),
      }),
    });
    console.log("fetch terminado");
    const data = await result.json();
    console.log("json parseado");
    console.log(result);
    console.log("1");
    console.log(data);
    console.log("2");
    // La IA retorna un JSON, así que lo parseamos directamente
    let recetaGenerada = {};
    try {
      recetaGenerada = JSON.parse(data.output.replace(/'/g, '"'));
    } catch (err) {
      console.error("Error al parsear la receta generada:", err);
      recetaGenerada = {
        nombre: "Error al parsear receta",
        ingredientes: [],
        calorias: "",
        instrucciones: [],
      };
    }
    setReceta({
      nombre: recetaGenerada.nombre || "",
      ingredientes: recetaGenerada.ingredientes || [],
      calorias: recetaGenerada.calorias || "",
      notas: Array.isArray(recetaGenerada.instrucciones) ? recetaGenerada.instrucciones.join(" ") : recetaGenerada.instrucciones || "",
    });
    inputRef.current.value = ""; // Limpiar el input después de enviar
  }

  return (
    <>
      <button
        onClick={handleOpenForm}
        className="bg-light-primary text-background font-bold py-2 px-4 rounded cursor-pointer hover:bg-light-secundary"
      >
        Generador de Recetas con IA
      </button>

      {openForm && (
        <form
          className="flex flex-col justify-center items-center mt-4"
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
      {receta.nombre && (
        <div className="mt-4">
          <p>
            <strong>Nombre:</strong> {receta.nombre}
          </p>

          <strong>Ingredientes:</strong>
          <ul>
            {receta.ingredientes.map((ingrediente, index) => (
              <li key={index}>{ingrediente}</li>
            ))}
          </ul>

          <p>
            <strong>Calorías:</strong> {receta.calorias}
          </p>
          <p>
            <strong>Notas:</strong> {receta.notas}
          </p>
        </div>
      )}
    </>
  );
}
