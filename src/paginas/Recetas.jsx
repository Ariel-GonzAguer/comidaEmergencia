// store
import useStore from '../stores/useStore';

// estrategia de toast
import mostrarToastStrategy from '../scripts/strategies/toastStrategy';

export default function Recetas() {
  // store
  const { recetas } = useStore();
  console.log('Recetas:', recetas);
  return (
    <section title="Recetas" className="flex flex-col items-center justify-center h-full mt-16">
      {Object.entries(recetas).length > 0 ? (
        Object.entries(recetas).map(([id, receta]) => (
          <details key={id}>
            <summary className="text-3xl text-center font-bold mb-2 text-white">
              {receta.nombre}
            </summary>
            <article key={id} className="w-full max-w-3xl p-4 border-2 border-gray-300 rounded-lg">
              <p className="font-bold">→ Ingredientes:</p>
              <ul>
                {receta.ingredientes.split(',').map((ingrediente, index) => (
                  <li key={index} className="block">
                    ○ {ingrediente}
                  </li>
                ))}
              </ul>
              <p className="font-bold">→ Calorías: {receta.calorias}kcal</p>
              <p className="font-bold">→ Instrucciones:</p>
              <p>{receta.instrucciones}</p>
              <button
                className="bg-error text-white px-2 py-1 rounded cursor-pointer border-2 border-error hover:border-warning"
                onClick={() =>
                  mostrarToastStrategy('eliminar', {
                    key: 'recetas',
                    id: id,
                  })
                }
              >
                Eliminar
              </button>
            </article>
          </details>
        ))
      ) : (
        <p>No hay recetas disponibles.</p>
      )}
    </section>
  );
}
