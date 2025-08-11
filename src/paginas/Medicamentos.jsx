// store
import useStore from '../stores/useStore';

export default function Medicamentos() {
  // store
  const { medicamentos } = useStore();
  return (
    <section className="flex flex-col items-center justify-center h-full mt-16">
      {Object.entries(medicamentos).length > 0 ? (
        Object.entries(medicamentos).map(([id, item]) => (
          <article key={id} className="border-2 border-white rounded-lg p-4 mb-4 w-full max-w-md">
            <h3 className="text-2xl font-bold">{item.nombre}</h3>
            <p>Descripción: {item.uso}</p>
            <p>Cantidad: {item.cantidad}</p>
            <p>Fecha de vencimiento: {item.fechaVencimiento}</p>
          </article>
        ))
      ) : (
        <p>No hay medicamentos aún.</p>
      )}
    </section>
  );
}
