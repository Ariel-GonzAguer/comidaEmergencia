// store
import useStore from "../stores/useStore";
export default function Otros(props) {
  // store
  const { otros } = useStore();
  return (
    <section className="flex flex-col items-center justify-center h-full mt-16">
      {Object.entries(otros).length > 0 ? (
        Object.entries(otros).map(([id, item]) => (
          <article key={id}>
            <h3>{item.titulo}</h3>
            <p>{item.contenido}</p>
          </article>
        ))
      ) : (
        <p>No hay otros elementos disponibles.</p>
      )}
    </section>
  );
}
