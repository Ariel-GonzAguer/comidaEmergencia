import { useEffect, useRef, useId, useCallback } from 'react'

/**
 * Diálogo modal de confirmación para eliminar un insumo.
 * Se cierra al hacer clic fuera del card o al presionar "cancelar" / Escape.
 *
 * @param {Object}   props
 * @param {string}   props.nombre     - Nombre del insumo a eliminar (se muestra al usuario).
 * @param {() => void} props.onConfirmar - Callback al confirmar la eliminación.
 * @param {() => void} props.onCancelar  - Callback al cancelar.
 * @returns {JSX.Element}
 */
export default function DeleteConfirm({ nombre, onConfirmar, onCancelar }) {
  const titleId = useId()
  const descId = useId()
  const cancelBtnRef = useRef(null)
  const dialogRef = useRef(null)

  // Mover foco al botón cancelar cuando el diálogo abre (WCAG 2.4.3)
  useEffect(() => { cancelBtnRef.current?.focus() }, [])

  // Cerrar con Escape (WCAG 2.1.1)
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onCancelar() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancelar])

  // Focus trap: mantener foco dentro del diálogo (WCAG 2.4.3)
  const handleKeyDown = useCallback((e) => {
    if (e.key !== 'Tab' || !dialogRef.current) return
    const focusable = dialogRef.current.querySelectorAll('button')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }, [])

  const btnBase = 'font-mono text-lg px-3.5 py-1.5 border rounded-sm tracking-[0.06em] bg-transparent cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-bg'
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-100 p-5"
      onClick={e => e.target === e.currentTarget && onCancelar()}
    >
      {/* role=dialog + aria-modal comunican al SR que es un diálogo modal (WCAG 4.1.2) */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="bg-bg2 border border-edge-hi rounded-sm w-full max-w-95 flex flex-col"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="px-4.5 py-3.5 border-b border-edge">
          <h2 id={titleId} className="text-lg tracking-[0.12em] uppercase text-ink-mid m-0 font-normal">
            <span aria-hidden="true">⚠ </span>eliminar insumo
          </h2>
        </div>
        <div className="px-4.5 py-5 flex flex-col gap-2 text-[14px]">
          <p>¿Eliminar <strong className="text-ink-hi">{nombre}</strong>?</p>
          <p id={descId} className="text-ink-dim">Esta acción no se puede deshacer.</p>
        </div>
        <div className="flex justify-end gap-2 px-4.5 py-3.5 border-t border-edge">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancelar}
            className={`${btnBase} border-edge text-ink-mid hover:border-edge-hi hover:text-ink`}
          >cancelar</button>
          <button
            type="button"
            onClick={onConfirmar}
            aria-label={`Confirmar eliminación de ${nombre}`}
            className={`${btnBase} border-danger text-[#e06060] hover:bg-danger-hi hover:text-white hover:border-danger-hi`}
          >eliminar</button>
        </div>
      </div>
    </div>
  )
}
