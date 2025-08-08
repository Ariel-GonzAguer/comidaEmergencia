// store
import useStore from "../stores/useStore";
export default function Otros() {
  // store
  const { otros } = useStore();
  return (
    <section className="flex flex-col items-center justify-center h-full mt-16">
      {Object.entries(otros).length > 0 ? (
        Object.entries(otros).map(([id, item]) => (
          <article key={id} className="border-2 border-white rounded-lg p-4 mb-4 w-full max-w-md">
            <h3 className="text-2xl font-bold">{item.nombre}</h3>
            <p>{item.uso}</p>
          </article>
        ))
      ) : (
        <p>No hay otros elementos disponibles.</p>
      )}
    </section>
  );
}
