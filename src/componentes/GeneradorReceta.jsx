// hooks
import { useRef, useState } from "react";

export default function GeneradorRecetas() {
  const [receta, setReceta] = useState({
    nombre: "",
    ingredientes: [],
    notas: "",
  });

  const [openForm, setOpenForm] = useState(false);

  const inputRef = useRef("");

  function handleOpenForm() {
    setOpenForm(!openForm);
  }

  function handleSubmit(e) {
    const result = fetch()
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
        <form className="flex flex-col justify-center items-center mt-4">
          <p>
            Escriba los ingredientes con los que quiere que la IA genere la
            receta:
          </p>
          <label htmlFor="ingredientes">
            <textarea
              id="ingredientes"
              placeholder="Ingredientes"
              value={receta.ingredientes.join("\n")}
              ref={inputRef}
              className="resize-none h-32"
            />
          </label>
          <button type="submit" className="bg-atencion-secundary text-background font-bold rounded p-2 cursor-pointer hover:bg-atencion">Generar Receta</button>
        </form>
      )}
    </>
  );
}
