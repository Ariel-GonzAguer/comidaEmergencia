// hooks
import { useState } from "react";

// store
import useStore from "../stores/useStore";

// estrategia de toast
import mostrarToastStrategy from "../scripts/estrategias/toastStrategy";

export default function ComidaActual() {
  // estados
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});

  // store
  const { alimentos, lugares, actualizarElemento } = useStore();

  // clase para elementos de la tabla
  const classTrEditando = "border border-white px-2 py-1 text-black";
  const classTh = "border px-2 py-1";

  function handleEditClick(alimento) {
    setEditando(alimento.id);
    setForm({
      nombre: alimento.nombre,
      cantidad: alimento.cantidad,
      fechaVencimiento: alimento.fechaVencimiento,
      calorias: alimento.calorias,
      tipo: alimento.tipo,
      ubicacion: alimento.ubicacion,
    });
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave(id) {
    await actualizarElemento("alimentos", id, {
      ...alimentos[id],
      ...form,
      cantidad: Number(form.cantidad),
      calorias: Number(form.calorias),
    });
    setEditando(null);
    mostrarToastStrategy.success("Alimento actualizado");
  }

  function handleCancel() {
    setEditando(null);
  }

  return (
    <section className="flex flex-col items-center justify-center w-[98%] m-[0_auto] mt-4">
      <h2>Comida Actual</h2>
      <div className="overflow-x-auto w-full">
        <table className="min-w-[600px] border border-gray-300 text-center m-[0_auto]">
          <thead>
            <tr>
              {[
                "Nombre",
                "Cantidad",
                "Fecha de vencimiento",
                "Calorías",
                "Tipo",
                "Ubicación",
                "Acciones",
              ].map((header) => (
                <th key={header} title={header} className={classTh}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(alimentos).map(([id, alimento]) => (
              <tr key={id}>
                {/* modo editar */}
                {editando === id ? (
                  <>
                    <td className={classTrEditando}>
                      <input
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        className="w-24"
                      />
                    </td>
                    <td className={classTrEditando}>
                      <input
                        name="cantidad"
                        type="number"
                        value={form.cantidad}
                        onChange={handleChange}
                        className="w-24"
                      />
                    </td>
                    <td className={classTrEditando}>
                      <input
                        name="fechaVencimiento"
                        value={form.fechaVencimiento}
                        onChange={handleChange}
                        className="w-54"
                      />
                    </td>
                    <td className={classTrEditando}>
                      <input
                        name="calorias"
                        type="number"
                        value={form.calorias}
                        onChange={handleChange}
                        className="w-24"
                      />
                    </td>
                    <td className={classTrEditando}>
                      <input
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                        className="w-24"
                      />
                    </td>
                    <td className={classTrEditando}>
                      <select name="ubicacion" className="w-24" id="">
                        {Object.entries(lugares).map(([id, lugar]) => (
                          <option key={id} value={id}>
                            {lugar.nombre}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 flex gap-2 justify-center items-center">
                      <button
                        className="bg-good text-white px-2 py-1 rounded cursor-pointer hover:bg-light-secundary hover:text-background"
                        onClick={() => handleSave(id)}
                      >
                        Guardar
                      </button>
                      <button
                        className="bg-gray-400 text-background px-2 py-1 rounded cursor-pointer hover:bg-light-primary"
                        onClick={handleCancel}
                      >
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  // Mostrar datos del alimento
                  <>
                    <td className="border px-2 py-1">{alimento.nombre}</td>
                    <td className="border px-2 py-1">{alimento.cantidad}</td>
                    <td className="border px-2 py-1">
                      {alimento.fechaVencimiento}
                    </td>
                    <td className="border px-2 py-1">{alimento.calorias}</td>
                    <td className="border px-2 py-1">{alimento.tipo}</td>
                    <td className="border px-2 py-1">
                      {alimento.ubicacion?.nombre}
                    </td>
                    <td className="px-2 py-1 flex flex-col gap-2 justify-center items-center">
                      <button
                        className="bg-error text-white px-2 py-1 rounded cursor-pointer border-2 border-error hover:border-warning"
                        onClick={() =>
                          mostrarToastStrategy.eliminar(alimento.id)
                        }
                      >
                        Eliminar
                      </button>
                      <button
                        className="bg-warning text-background px-2 py-1 rounded cursor-pointer border-2 border-warning hover:border-error"
                        onClick={() => handleEditClick(alimento)}
                      >
                        Actualizar
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
