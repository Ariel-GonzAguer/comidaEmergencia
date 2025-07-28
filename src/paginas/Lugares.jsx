// store
import useStore from "../stores/useStore";

export default function Lugares(props) {
  // store
  const { lugares } = useStore();
  console.log("lugares", lugares);
  return (
    <section className="flex flex-col items-center justify-center h-full mt-16">
      {Object.entries(lugares).length > 0 ? (
        Object.entries(lugares).map(([id, lugar]) => (
          <article key={id}>
            <h3>{lugar.nombre}</h3>
            <ul>
              {Object.keys(lugar.alimentos).length > 0 ? (
                Object.entries(lugar.alimentos).map(
                  ([alimentoId, alimento]) => (
                    <li key={alimentoId}>
                      {alimento.nombre} - {alimento.cantidad} unidades
                    </li>
                  )
                )
              ) : (
                <li>No hay alimentos disponibles.</li>
              )}
            </ul>
          </article>
        ))
      ) : (
        <p>No hay lugares disponibles.</p>
      )}
    </section>
  );
}
