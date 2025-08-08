// hooks
import { useState } from "react";

// store
import useStore from "../stores/useStore";

// estrategia de toast
import mostrarToastStrategy from "../scripts/strategies/toastStrategy";

export default function ComidaActual() {
  // estados
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});

  // store
  const { alimentos, lugares, actualizarElemento } = useStore();

  // clase para elementos de la tabla
  const classTrEditando = "border border-white px-2 py-1 text-black";
  const classTh = "border px-2 py-1";

  // manejar editar
  /**
   * Maneja la edición de un alimento estableciendo el estado de edición y llenando el formulario con los datos del alimento.
   *
   * @param {Object} alimento - El alimento a editar.
   * @param {number|string} alimento.id - El identificador único del alimento.
   * @param {string} alimento.nombre - El nombre del alimento.
   * @param {number} alimento.cantidad - La cantidad del alimento.
   * @param {string} alimento.fechaVencimiento - La fecha de vencimiento del alimento.
   * @param {number} alimento.calorias - Las calorías del alimento.
   * @param {string} alimento.tipo - El tipo/categoría del alimento.
   * @param {Object} [alimento.ubicacion] - El objeto de ubicación del alimento.
   * @param {number|string} [alimento.ubicacion.id] - El identificador único de la ubicación.
   * @param {string} [alimento.ubicacion.nombre] - El nombre de la ubicación.
   */
  function handleEditar(alimento) {
    setEditando(alimento.id);
    setForm({
      nombre: alimento.nombre,
      cantidad: alimento.cantidad,
      fechaVencimiento: alimento.fechaVencimiento,
      calorias: alimento.calorias,
      tipo: alimento.tipo,
      ubicacion: alimento.ubicacion ? { id: alimento.ubicacion.id, nombre: alimento.ubicacion.nombre } : null,
    });
  }

  // manejar cambios en el formulario
  /**
   * Maneja los cambios en los campos del formulario.
   * - Si el campo cambiado es "ubicacion", actualiza el estado del formulario con el objeto de ubicación seleccionado (id y nombre) desde el array `lugares`.
   * - Para otros campos, actualiza el estado del formulario con el nuevo valor para el campo correspondiente.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - El evento de cambio generado por el campo de entrada.
   */
  function handleChange(e) {
    if (e.target.name === "ubicacion") {
      const lugarObj = lugares[e.target.value];
      setForm({
        ...form,
        ubicacion: lugarObj ? { id: lugarObj.id, nombre: lugarObj.nombre } : null,
      });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  }

  // manejar guardar cambios
  /**
   * Actualiza un alimento existente con los valores del formulario.
   *
   * @async
   * @function handleGuardar
   * @param {string|number} id - El identificador único del alimento a actualizar.
   * @returns {Promise<void>} Se resuelve cuando la actualización está completa.
   *
   * @description
   * Fusiona los valores actuales del formulario en el alimento especificado, asegurando que
   * 'cantidad' y 'calorias' se almacenen como números. Después de actualizar, restablece
   * el estado de edición y muestra una notificación de éxito.
   */
  async function handleGuardar(id) {
    await actualizarElemento("alimentos", id, {
      ...alimentos[id],
      ...form,
      cantidad: Number(form.cantidad),
      calorias: Number(form.calorias),
    });
    setEditando(null);
    mostrarToastStrategy("success", { mensaje: "Alimento actualizado" });
  }

  // manejar cancelar edición
  /**
   * Cancela la acción de edición actual restableciendo el estado de edición a null.
   * Normalmente se usa para salir del modo de edición sin guardar cambios.
   */
  function handleCancelar() {
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
                      <select
                        name="ubicacion"
                        className="w-24"
                        value={form.ubicacion?.id || ""}
                        onChange={handleChange}
                      >
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
                        onClick={() => handleGuardar(id)}
                      >
                        Guardar
                      </button>
                      <button
                        className="bg-gray-400 text-background px-2 py-1 rounded cursor-pointer hover:bg-light-primary"
                        onClick={handleCancelar}
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
                          mostrarToastStrategy("eliminar", {
                            key: "alimentos",
                            id: alimento.id,
                          })
                        }
                      >
                        Eliminar
                      </button>
                      <button
                        className="bg-warning text-background px-2 py-1 rounded cursor-pointer border-2 border-warning hover:border-error"
                        onClick={() => handleEditar(alimento)}
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
