// store
import useStore from "../stores/useStore";

export default function Medicamentos() {
  // store
  const { medicamentos } = useStore();
  return (
    <section className="flex flex-col items-center justify-center h-full mt-16">
      {Object.entries(medicamentos).length > 0 ? (
        Object.entries(medicamentos).map(([id, item]) => (
          <article key={id}>
            <h3>{item.nombre}</h3>
            <p>Descripción: {item.descripcion}</p>
            <p>Cantidad: {item.cantidad}</p>
          </article>
        ))
      ) : (
        <p>No hay medicamentos aún.</p>
      )}
    </section>
  );
}
