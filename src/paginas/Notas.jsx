// store
import useStore from "../stores/useStore";

export default function Notas() {
  // store
  const { notas } = useStore();
  return (
    <section className="flex flex-col items-center justify-center h-full mt-16">
      {Object.entries(notas).length > 0 ? (
        Object.entries(notas).map(([id, item]) => (
          <article key={id} className="border-2 border-white rounded-lg p-4 mb-4 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-2">{item.nombre}</h2>
            <p>{item.contenido}</p>
            <p>creado: {item.fecha}</p>
          </article>
        ))
      ) : (
        <p>No hay notas disponibles.</p>
      )}
    </section>
  );
}
