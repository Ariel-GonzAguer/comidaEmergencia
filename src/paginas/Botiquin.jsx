// store
import useStore from "../stores/useStore";

export default function Botiquin() {
  // store
  const { botiquin } = useStore();
  return (
    <section className="flex flex-col items-center justify-center h-full mt-16">
      {Object.entries(botiquin).length > 0 ? (
        Object.entries(botiquin).map(([id, item]) => (
          <article key={id}>
            <h3>{item.nombre}</h3>
            <p>Descripción: {item.descripcion}</p>
            <p>Cantidad: {item.cantidad}</p>
          </article>
        ))
      ) : (
        <p>No hay elementos en el botiquín.</p>
      )}
    </section>
  );
}
