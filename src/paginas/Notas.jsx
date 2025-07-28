// store
import useStore from "../stores/useStore";

export default function Notas() {
  // store
  const { notas } = useStore();
  return (
    <section className="flex flex-col items-center justify-center h-full mt-16">
      {Object.entries(notas).length > 0 ? (
        Object.entries(notas).map(([id, item]) => (
          <article key={id}>
            <h3>{item.titulo}</h3>
            <p>{item.contenido}</p>
          </article>
        ))
      ) : (
        <p>No hay notas disponibles.</p>
      )}
    </section>
  );
}
