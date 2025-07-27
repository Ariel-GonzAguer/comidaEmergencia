// store
import useStore from "../stores/useStore";

export default function Recetas() {
  // store
  const { recetas } = useStore();
  console.log("Recetas:", recetas);
  return (
    <section
      title="Recetas"
      className="flex flex-col items-center justify-center h-full mt-16"
    >
      {Object.entries(recetas).length > 0 ? (
        Object.entries(recetas).map(([id, receta]) => (
          <article
            key={id}
            className="w-full max-w-3xl p-4 border-2 border-gray-300 rounded-lg"
          >
            <h3 className="text-3xl text-right font-bold mb-2">
              {receta.nombre}
            </h3>
            <p className="font-bold">→ Ingredientes:</p>
            <ul>
              {receta.ingredientes.split(",").map((ingrediente, index) => (
                <li key={index} className="block">
                  ○ {ingrediente}
                </li>
              ))}
            </ul>
            <p className="font-bold">→ Calorías: {receta.calorias}kcal</p>
            <p className="font-bold">→ Instrucciones:</p>
            <p>{receta.instrucciones}</p>
          </article>
        ))
      ) : (
        <p>No hay recetas disponibles.</p>
      )}
    </section>
  );
}
