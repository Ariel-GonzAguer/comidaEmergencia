import { useEffect, useRef, useId } from 'react'

/**
 * Diálogo modal de confirmación para eliminar un insumo.
 * Se cierra al hacer clic fuera del card o al presionar "cancelar".
 *
 * @param {Object}   props
 * @param {string}   props.nombre     - Nombre del insumo a eliminar (se muestra al usuario).
 * @param {() => void} props.onConfirmar - Callback al confirmar la eliminación.
 * @param {() => void} props.onCancelar  - Callback al cancelar.
 * @returns {JSX.Element}
 */
export default function DeleteConfirm({ nombre, onConfirmar, onCancelar }) {
  const titleId = useId()
  const cancelBtnRef = useRef(null)

  // Mover foco al botón cancelar cuando el diálogo abre (WCAG 2.4.3)
  useEffect(() => { cancelBtnRef.current?.focus() }, [])

  const btnBase = 'font-mono text-[14px] px-3.5 py-1.5 border rounded-sm tracking-[0.06em] bg-transparent cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg)]'
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-5"
      onClick={e => e.target === e.currentTarget && onCancelar()}
    >
      {/* role=dialog + aria-modal comunican al SR que es un diálogo modal (WCAG 4.1.2) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-[var(--bg2)] border border-[var(--edge-hi)] rounded-sm w-full max-w-[380px] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-[18px] py-3.5 border-b border-[var(--edge)]">
          <h2 id={titleId} className="text-[14px] tracking-[0.12em] uppercase text-[var(--ink-mid)] m-0 font-normal">
            ⚠ eliminar insumo
          </h2>
        </div>
        <div className="px-[18px] py-5 flex flex-col gap-2 text-[14px]">
          <p>¿Eliminar <strong className="text-[var(--ink-hi)]">{nombre}</strong>?</p>
          <p className="text-[var(--ink-dim)]">Esta acción no se puede deshacer.</p>
        </div>
        <div className="flex justify-end gap-2 px-[18px] py-3.5 border-t border-[var(--edge)]">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancelar}
            className={`${btnBase} border-[var(--edge)] text-[var(--ink-mid)] hover:border-[var(--edge-hi)] hover:text-[var(--ink)]`}
          >cancelar</button>
          <button
            type="button"
            onClick={onConfirmar}
            aria-label={`Confirmar eliminación de ${nombre}`}
            className={`${btnBase} border-[var(--danger)] text-[#e06060] hover:bg-[var(--danger-hi)] hover:text-white hover:border-[var(--danger-hi)]`}
          >eliminar</button>
        </div>
      </div>
    </div>
  )
}
