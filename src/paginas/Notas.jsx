// store
import useStore from "../stores/useStore";

// estrategia de toast
import mostrarToastStrategy from "../scripts/strategies/toastStrategy";

export default function Notas() {
  // store
  const { notas } = useStore();
  return (
    <section className="flex flex-col items-center justify-center h-full mt-16">
      {Object.entries(notas).length > 0 ? (
        Object.entries(notas).map(([id, item]) => (
          <article
            key={id}
            className="border-2 border-white rounded-lg p-4 mb-4 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-2">{item.nombre}</h2>
            <p>{item.contenido}</p>
            <p>creado: {item.fecha}</p>
            <button
              className="bg-error text-white px-2 py-1 rounded cursor-pointer border-2 border-error hover:border-warning"
              onClick={() =>
                mostrarToastStrategy("eliminar", {
                  key: "notas",
                  id: item.id,
                })
              }
            >
              Eliminar
            </button>
          </article>
        ))
      ) : (
        <p>No hay notas disponibles.</p>
      )}
    </section>
  );
}
