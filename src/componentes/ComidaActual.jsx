import useStore from "../stores/useStore";

export default function ComidaActual() {
  const { alimentos } = useStore();

  return (
    <section className="flex flex-col items-center justify-center">
      <h2>Comida Actual</h2>
      <div className="overflow-x-auto w-full">
        <table className="min-w-[600px] border border-gray-300 text-center m-[0_auto]">
          <thead>
            <tr>
              <th className="border px-2 py-1">Nombre</th>
              <th className="border px-2 py-1">Cantidad</th>
              <th className="border px-2 py-1">Fecha de vencimiento</th>
              <th className="border px-2 py-1">Calorías</th>
              <th className="border px-2 py-1">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(alimentos).map(([id, alimento]) => (
              <tr key={id}>
                <td className="border px-2 py-1">{alimento.nombre}</td>
                <td className="border px-2 py-1">{alimento.cantidad}</td>
                <td className="border px-2 py-1">
                  {alimento.fechaVencimiento}
                </td>
                <td className="border px-2 py-1">{alimento.calorias}</td>
                <td className="border px-2 py-1">{alimento.tipo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
