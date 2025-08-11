// store
import useStore from '../stores/useStore';

// estrategia de toast
import mostrarToastStrategy from '../scripts/strategies/toastStrategy';

export default function Lugares() {
  // store
  const { lugares } = useStore();

  return (
    <section className="flex flex-col items-center justify-center h-full mt-16">
      {Object.keys(lugares).length > 0 ? (
        Object.entries(lugares).map(([, value]) => (
          <article id={value.id} key={value.id} className="border p-4 m-2 rounded-lg w-2xs">
            <h3>{value.nombre}</h3>
            <ul>
              {Object.values(value.alimentos).map(elemento => (
                <li key={elemento.id}>
                  {elemento.nombre} - {elemento.cantidad}
                </li>
              ))}
            </ul>
            <button
              className="bg-error text-white px-2 py-1 rounded cursor-pointer border-2 border-error hover:border-warning"
              onClick={() =>
                mostrarToastStrategy('eliminar', {
                  key: 'lugares',
                  id: value.id,
                  mensaje: `¿Desea eliminar el lugar ${value.nombre} permanentemente con todo su contenido?`,
                })
              }
            >
              Eliminar
            </button>
          </article>
        ))
      ) : (
        <p>No hay lugares disponibles.</p>
      )}
    </section>
  );
}
