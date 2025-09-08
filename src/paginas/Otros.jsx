// hooks
import { useState } from 'react';

// store
import useStore from '../stores/useStore';

// estrategia de toast
import mostrarToastStrategy from '../scripts/strategies/toastStrategy';

export default function Otros() {
  // store
  const { otros, actualizarElemento } = useStore();

  // estados para edición
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});

  /**
   * Maneja la edición de un ítem estableciendo el estado de edición y llenando el formulario.
   * @param {Object} item - El ítem a editar.
   */
  function handleEditar(item) {
    setEditando(item.id);
    setForm({ 
      nombre: item.nombre,
      uso: item.uso 
    });
  }

  /**
   * Maneja los cambios en los campos del formulario.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e
   */
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  /**
   * Actualiza un ítem existente con los valores del formulario.
   * @param {string} id - El identificador único del ítem a actualizar.
   */
  async function handleGuardar(id) {
    await actualizarElemento('otros', id, {
      ...otros[id],
      nombre: form.nombre,
      uso: form.uso,
    });
    setEditando(null);
    mostrarToastStrategy('success', { mensaje: 'Ítem actualizado' });
  }

  /**
   * Cancela la acción de edición actual restableciendo el estado de edición a null.
   */
  function handleCancelar() {
    setEditando(null);
  }

  return (
    <section className="flex flex-col items-center justify-center h-full mt-16">
      {Object.entries(otros).length > 0 ? (
        Object.entries(otros).map(([id, item]) => (
          <article key={id} className="border-2 border-white rounded-lg p-4 mb-4 w-full max-w-md">
            {editando === item.id ? (
              // Modo edición
              <div className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium mb-1">
                    Nombre:
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-background"
                  />
                </div>
                <div>
                  <label htmlFor="uso" className="block text-sm font-medium mb-1">
                    Uso:
                  </label>
                  <textarea
                    id="uso"
                    name="uso"
                    value={form.uso}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-background"
                  />
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleGuardar(id)}
                    className="bg-good text-white px-3 py-1 rounded cursor-pointer border-2 border-good hover:border-atencion transition-colors duration-200"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={handleCancelar}
                    className="bg-error text-white px-3 py-1 rounded cursor-pointer border-2 border-error hover:border-warning transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              // Modo visualización
              <div>
                <h3 className="text-2xl font-bold mb-2">{item.nombre}</h3>
                <p className="mb-4">{item.uso}</p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleEditar(item)}
                    className="bg-warning text-background px-3 py-1 rounded cursor-pointer border-2 border-warning hover:border-error transition-colors duration-200 font-bold"
                  >
                    Actualizar
                  </button>
                </div>
              </div>
            )}
          </article>
        ))
      ) : (
        <p>No hay otros elementos disponibles.</p>
      )}
    </section>
  );
}