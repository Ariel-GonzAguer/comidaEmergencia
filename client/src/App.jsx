/**
 * @file Componente raíz de la aplicación de inventario de emergencia.
 *
 * Orquesta el estado de la UI (modal, confirmación de eliminación, toast)
 * y conecta los componentes de presentación con el hook {@link useInsumos}.
 *
 * @module App
 */

import { useState, useCallback } from 'react';
import Header from './components/Header.jsx';
import FilterBar from './components/FilterBar.jsx';
import InsumoTable from './components/InsumoTable.jsx';
import InsumoModal from './components/InsumoModal.jsx';
import DeleteConfirm from './components/DeleteConfirm.jsx';
import Toast from './components/Toast.jsx';
import { useInsumos } from './hooks/useInsumos.js';

/**
 * Componente raíz que renderiza la interfaz completa del inventario.
 *
 * Administra tres piezas de estado UI:
 * - `modal`         – controla la apertura del formulario de crear/editar.
 * - `confirmDelete` – controla el diálogo de confirmación de eliminación.
 * - `toast`         – notificaciones efímeras de éxito/error.
 *
 * @returns {JSX.Element}
 */
export default function App() {
  const {
    insumos,
    categorias,
    simbolos,
    loading,
    error,
    filtros,
    setFiltros,
    crearInsumo,
    actualizarInsumo,
    eliminarInsumo,
  } = useInsumos();

  const [modal, setModal] = useState(null); // null | { modo: 'crear'|'editar', insumo? }
  const [confirmDelete, setConfirmDelete] = useState(null); // null | insumo
  const [toast, setToast] = useState(null);

  /**
   * Muestra una notificación toast que desaparece automáticamente tras 3 segundos.
   *
   * @param {string} msg            - Texto a mostrar.
   * @param {'ok'|'error'} [tipo='ok'] - Estilo visual del toast.
   */
  const showToast = useCallback((msg, tipo = 'ok') => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3000);
  }, []);

  /**
   * Handler para guardar un insumo (crear o editar según el modo del modal).
   * Cierra el modal tras éxito y muestra un toast.
   *
   * @async
   * @param {Object} datos - Campos del formulario del insumo.
   */
  async function handleGuardar(datos) {
    try {
      if (modal.modo === 'crear') {
        await crearInsumo(datos);
        showToast('Insumo creado');
      } else {
        await actualizarInsumo(modal.insumo.id, datos);
        showToast('Insumo actualizado');
      }
      setModal(null);
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  /**
   * Handler para confirmar la eliminación de un insumo.
   * Cierra el diálogo tras éxito y muestra un toast.
   *
   * @async
   */
  async function handleEliminar() {
    try {
      await eliminarInsumo(confirmDelete.id);
      showToast('Insumo eliminado');
      setConfirmDelete(null);
    } catch (e) {
      showToast(e.message, 'error');
    }
  }

  return (
    <div className="flex flex-col min-h-dvh max-w-400 mx-auto">
      <Header onNuevo={() => setModal({ modo: 'crear' })} total={insumos.length} />

      <FilterBar filtros={filtros} setFiltros={setFiltros} categorias={categorias} />

      <main id="contenido-principal">
        {error && (
          <p role="alert" className="px-6 py-2 text-[#e06060] text-[14px]">
            Error: {error}
          </p>
        )}

        <InsumoTable
          insumos={insumos}
          loading={loading}
          simbolosDef={simbolos}
          onEditar={insumo => setModal({ modo: 'editar', insumo })}
          onEliminar={insumo => setConfirmDelete(insumo)}
        />
      </main>

      {modal && (
        <InsumoModal
          modo={modal.modo}
          insumoInicial={modal.insumo}
          categorias={categorias}
          simbolosDef={simbolos}
          onGuardar={handleGuardar}
          onCerrar={() => setModal(null)}
        />
      )}

      {confirmDelete && (
        <DeleteConfirm
          nombre={confirmDelete.nombre}
          onConfirmar={handleEliminar}
          onCancelar={() => setConfirmDelete(null)}
        />
      )}

      {toast && <Toast mensaje={toast.mensaje} tipo={toast.tipo} />}
    </div>
  );
}
