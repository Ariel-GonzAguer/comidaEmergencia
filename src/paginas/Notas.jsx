// hooks
import { useState } from 'react';

// store
import useStore from '../stores/useStore';

// estrategia de toast
import mostrarToastStrategy from '../scripts/strategies/toastStrategy';

export default function Notas() {
  // store
  const { notas, actualizarElemento } = useStore();

  // estados para edición
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});

  // actualizar nota
  async function handleGuardar(id) {
    await actualizarElemento('notas', id, {
      ...notas[id],
      contenido: form.contenido,
    });
    setEditando(null);
    mostrarToastStrategy('success', { mensaje: 'Nota actualizada' });
  }

  function handleEditar(item) {
    setEditando(item.id);
    setForm({ contenido: item.contenido });
  }

  function handleCancelar() {
    setEditando(null);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <section className="flex flex-col items-center justify-center h-full mt-16">
      {Object.entries(notas).length > 0 ? (
        Object.entries(notas).map(([id, item]) => (
          <article key={id} className="border-2 border-white rounded-lg p-4 mb-4 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-2">{item.nombre}</h2>
            {editando === item.id ? (
              <>
                <textarea
                  name="contenido"
                  value={form.contenido}
                  onChange={handleChange}
                  className="w-full h-24 mb-2 p-2 border rounded text-background"
                />
                <div className="flex justify-between">
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
                </div>
              </>
            ) : (
              <>
                <p>{item.contenido}</p>
                <p>creado: {item.fecha}</p>
                <div className="flex justify-between">
                  <button
                    className="bg-error text-white px-2 py-1 rounded cursor-pointer border-2 border-error hover:border-warning"
                    onClick={() =>
                      mostrarToastStrategy('eliminar', {
                        key: 'notas',
                        id: item.id,
                      })
                    }
                  >
                    Eliminar
                  </button>
                  <button
                    className="bg-warning text-background px-2 py-1 rounded cursor-pointer border-2 border-warning hover:border-error"
                    onClick={() => handleEditar(item)}
                  >
                    Editar
                  </button>
                </div>
              </>
            )}
          </article>
        ))
      ) : (
        <p>No hay notas disponibles.</p>
      )}
    </section>
  );
}
