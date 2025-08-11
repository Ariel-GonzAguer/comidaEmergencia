/**
 * Componente ComidaActual
 * Muestra la tabla de alimentos actuales, permite editar, eliminar y ordenar por diferentes campos.
 * Utiliza el store para acceder y actualizar los alimentos y lugares.
 */

// hooks
import { useState } from 'react';

// store
import useStore from '../stores/useStore';

// estrategia de toast
import mostrarToastStrategy from '../scripts/strategies/toastStrategy';

export default function ComidaActual() {
  // Estado para saber qué alimento se está editando
  const [editando, setEditando] = useState(null);
  // Estado para el formulario de edición
  const [form, setForm] = useState({});
  // Estado para el tipo de ordenación
  const [orden, setOrden] = useState('nombre');

  // Obtiene alimentos, lugares y función para actualizar del store
  const { alimentos, lugares, actualizarElemento } = useStore();

  // Clases para estilos de la tabla
  const classTrEditando = 'border border-white px-2 py-1 text-black';
  const classTh = 'border px-2 py-1';

  /**
   * Maneja la edición de un alimento estableciendo el estado de edición y llenando el formulario con los datos del alimento.
   * @param {Object} alimento - El alimento a editar.
   */
  function handleEditar(alimento) {
    setEditando(alimento.id);
    setForm({
      nombre: alimento.nombre,
      cantidad: alimento.cantidad,
      fechaVencimiento: alimento.fechaVencimiento,
      calorias: alimento.calorias,
      tipo: alimento.tipo,
      ubicacion: alimento.ubicacion
        ? { id: alimento.ubicacion.id, nombre: alimento.ubicacion.nombre }
        : null,
    });
  }

  /**
   * Maneja los cambios en los campos del formulario.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e
   */
  function handleChange(e) {
    if (e.target.name === 'ubicacion') {
      const lugarObj = lugares[e.target.value];
      setForm({
        ...form,
        ubicacion: lugarObj ? { id: lugarObj.id, nombre: lugarObj.nombre } : null,
      });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  }

  /**
   * Actualiza un alimento existente con los valores del formulario.
   * @param {string|number} id - El identificador único del alimento a actualizar.
   */
  async function handleGuardar(id) {
    await actualizarElemento('alimentos', id, {
      ...alimentos[id],
      ...form,
      cantidad: Number(form.cantidad),
      calorias: Number(form.calorias),
    });
    setEditando(null);
    mostrarToastStrategy('success', { mensaje: 'Alimento actualizado' });
  }

  /**
   * Cancela la acción de edición actual restableciendo el estado de edición a null.
   */
  function handleCancelar() {
    setEditando(null);
  }

  /**
   * Ordena los alimentos según el campo seleccionado.
   * @param {Object} alimentosObj - Objeto de alimentos.
   * @returns {Array} Array de alimentos ordenados.
   */
  function ordenarAlimentos(alimentosObj) {
    const alimentosArr = Object.entries(alimentosObj);
    switch (orden) {
      case 'nombre':
        return alimentosArr.sort(([, a], [, b]) =>
          a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
        );
      case 'tipo':
        return alimentosArr.sort(([, a], [, b]) =>
          a.tipo.localeCompare(b.tipo, 'es', { sensitivity: 'base' })
        );
      case 'fechaVencimiento':
        return alimentosArr.sort(
          ([, a], [, b]) => new Date(b.fechaVencimiento) - new Date(a.fechaVencimiento)
        );
      case 'calorias':
        return alimentosArr.sort(([, a], [, b]) => b.calorias - a.calorias);
      default:
        return alimentosArr;
    }
  }

  // Renderiza la tabla de alimentos y el formulario de edición
  return (
    <section className="flex flex-col items-center justify-center w-[98%] m-[0_auto] mt-4">
      <h2>Comida Actual</h2>
      {/* Filtro de ordenación */}
      <div className="mb-4 flex gap-2 items-center">
        <label htmlFor="ordenar-comida">Ordenar por:</label>
        <select
          id="ordenar-comida"
          value={orden}
          onChange={e => setOrden(e.target.value)}
          className="border px-2 py-1 rounded text-background w-60"
        >
          <option value="nombre">Nombre (A-Z)</option>
          <option value="tipo">Tipo (A-Z)</option>
          <option value="fechaVencimiento">Fecha de vencimiento</option>
          <option value="calorias">Calorías</option>
        </select>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="min-w-[600px] border border-gray-300 text-center m-[0_auto]">
          <thead>
            <tr>
              {[
                'Nombre',
                'Cantidad',
                'Fecha de vencimiento',
                'Calorías',
                'Tipo',
                'Ubicación',
                'Acciones',
              ].map(header => (
                <th key={header} title={header} className={classTh}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ordenarAlimentos(alimentos).map(([id, alimento]) => (
              <tr key={id}>
                {/* Renderiza modo edición o modo visual según el estado */}
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
                        value={form.ubicacion?.id || ''}
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
                  <>
                    <td className="border px-2 py-1">{alimento.nombre}</td>
                    <td className="border px-2 py-1">{alimento.cantidad}</td>
                    <td className="border px-2 py-1">{alimento.fechaVencimiento}</td>
                    <td className="border px-2 py-1">{alimento.calorias}</td>
                    <td className="border px-2 py-1">{alimento.tipo}</td>
                    <td className="border px-2 py-1">{alimento.ubicacion?.nombre}</td>
                    <td className="px-2 py-1 flex flex-col gap-2 justify-center items-center">
                      <button
                        className="bg-error text-white px-2 py-1 rounded cursor-pointer border-2 border-error hover:border-warning"
                        onClick={() =>
                          mostrarToastStrategy('eliminar', {
                            key: 'alimentos',
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
