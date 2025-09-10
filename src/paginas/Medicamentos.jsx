// hooks
import { useState } from 'react';

// store
import useStore from '../stores/useStore';

// estrategia de toast
import mostrarToastStrategy from '../scripts/strategies/toastStrategy';

export default function Medicamentos() {
  // store
  const { medicamentos, actualizarElemento } = useStore();

  // estados para edición
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});

  /**
   * Maneja la edición de un medicamento estableciendo el estado de edición y llenando el formulario.
   * @param {Object} item - El medicamento a editar.
   */
  function handleEditar(item) {
    setEditando(item.id);
    setForm({ 
      nombre: item.nombre,
      uso: item.uso,
      cantidad: item.cantidad,
      fechaVencimiento: item.fechaVencimiento
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
   * Actualiza un medicamento existente con los valores del formulario.
   * Se valida que la cantidad sea un número positivo mayor que 0
   * antes de guardar para evitar valores inválidos.
   * @param {string} id - El identificador único del medicamento a actualizar.
   */
  async function handleGuardar(id) {
    const cantidad = Number(form.cantidad);

    if (isNaN(cantidad) || cantidad <= 0) {
      mostrarToastStrategy('error', { mensaje: 'La cantidad debe ser un número mayor a 0' });
      return;
    }

    await actualizarElemento('medicamentos', id, {
      ...medicamentos[id],
      nombre: form.nombre,
      uso: form.uso,
      cantidad,
      fechaVencimiento: form.fechaVencimiento,
    });
    setEditando(null);
    mostrarToastStrategy('success', { mensaje: 'Medicamento actualizado' });
  }

  /**
   * Cancela la acción de edición actual restableciendo el estado de edición a null.
   */
  function handleCancelar() {
    setEditando(null);
  }

  return (
    <section className="flex flex-col items-center justify-center h-full mt-16">
      {Object.entries(medicamentos).length > 0 ? (
        Object.entries(medicamentos).map(([id, item]) => (
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
                    Descripción:
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
                <div>
                  <label htmlFor="cantidad" className="block text-sm font-medium mb-1">
                    Cantidad:
                  </label>
                  <input
                    type="number"
                    id="cantidad"
                    name="cantidad"
                    value={form.cantidad}
                    onChange={handleChange}
                    min="1" // 🔒 evita valores negativos o 0 desde la UI
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-background"
                  />
                </div>
                <div>
                  <label htmlFor="fechaVencimiento" className="block text-sm font-medium mb-1">
                    Fecha de vencimiento:
                  </label>
                  <input
                    type="text"
                    id="fechaVencimiento"
                    name="fechaVencimiento"
                    value={form.fechaVencimiento}
                    onChange={handleChange}
                    placeholder="dd de mes de yyyy"
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
                <p className="mb-2"><strong>Descripción:</strong> {item.uso}</p>
                <p className="mb-2"><strong>Cantidad:</strong> {item.cantidad}</p>
                <p className="mb-4"><strong>Fecha de vencimiento:</strong> {item.fechaVencimiento}</p>
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
        <p>No hay medicamentos aún.</p>
      )}
    </section>
  );
}
