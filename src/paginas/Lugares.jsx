// store
import useStore from "../stores/useStore";

export default function Lugares(props) {
  // store
  const { lugares } = useStore();

  return (
    <section className="flex flex-col items-center justify-center h-full mt-16">
      {Object.keys(lugares).length > 0 ? (
        Object.entries(lugares).map(([, value]) => (
          <article
            id={value.id}
            key={value.id}
            className="border p-4 m-2 rounded-lg w-2xs"
          >
            <h3>{value.nombre}</h3>
            <ul>
              {Object.values(value.alimentos).map((elemento) => (
                <li key={elemento.id}>
                  {elemento.nombre} - {elemento.cantidad}
                </li>
              ))}
            </ul>
          </article>
        ))
      ) : (
        <p>No hay lugares disponibles.</p>
      )}
    </section>
  );
}
