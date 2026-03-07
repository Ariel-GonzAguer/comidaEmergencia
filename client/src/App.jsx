import { useState, useCallback } from 'react'
import Header from './components/Header.jsx'
import FilterBar from './components/FilterBar.jsx'
import InsumoTable from './components/InsumoTable.jsx'
import InsumoModal from './components/InsumoModal.jsx'
import DeleteConfirm from './components/DeleteConfirm.jsx'
import Toast from './components/Toast.jsx'
import { useInsumos } from './hooks/useInsumos.js'

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
  } = useInsumos()

  const [modal, setModal] = useState(null)       // null | { modo: 'crear'|'editar', insumo? }
  const [confirmDelete, setConfirmDelete] = useState(null)  // null | insumo
  const [toast, setToast] = useState(null)

  const showToast = useCallback((msg, tipo = 'ok') => {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 3000)
  }, [])

  async function handleGuardar(datos) {
    try {
      if (modal.modo === 'crear') {
        await crearInsumo(datos)
        showToast('Insumo creado')
      } else {
        await actualizarInsumo(modal.insumo.id, datos)
        showToast('Insumo actualizado')
      }
      setModal(null)
    } catch (e) {
      showToast(e.message, 'error')
    }
  }

  async function handleEliminar() {
    try {
      await eliminarInsumo(confirmDelete.id)
      showToast('Insumo eliminado')
      setConfirmDelete(null)
    } catch (e) {
      showToast(e.message, 'error')
    }
  }

  return (
    <div className="flex flex-col min-h-dvh max-w-[1600px] mx-auto">
      <Header onNuevo={() => setModal({ modo: 'crear' })} total={insumos.length} />

      <FilterBar
        filtros={filtros}
        setFiltros={setFiltros}
        categorias={categorias}
      />

      {error && <p className="px-6 py-2 text-[#e06060] text-[12px]">Error: {error}</p>}

      <InsumoTable
        insumos={insumos}
        loading={loading}
        simbolosDef={simbolos}
        onEditar={(insumo) => setModal({ modo: 'editar', insumo })}
        onEliminar={(insumo) => setConfirmDelete(insumo)}
      />

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

      {toast && <Toast msg={toast.msg} tipo={toast.tipo} />}
    </div>
  )
}
