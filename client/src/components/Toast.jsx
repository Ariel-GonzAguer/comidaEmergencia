/**
 * Notificación efímera (toast) que aparece en la esquina inferior derecha.
 * Muestra un mensaje de éxito o error con animación de entrada.
 *
 * @param {Object} props
 * @param {string}          props.msg  - Texto a mostrar.
 * @param {'ok'|'error'}    props.tipo - Tipo de notificación (define color/icono).
 * @returns {JSX.Element}
 */
export default function Toast({ msg, tipo }) {
  const isErr = tipo === 'error'
  return (
    <div
      role={isErr ? 'alert' : 'status'}
      aria-live={isErr ? 'assertive' : 'polite'}
      aria-atomic="true"
      className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 rounded-sm font-mono text-[14px] tracking-[0.06em] z-[200] border ${
        isErr
          ? 'bg-[var(--danger)] border-[var(--danger-hi)] text-[#e06060]'
          : 'bg-[var(--ok)] border-[#3a7a50] text-[#80d89a]'
      }`}
      style={{ animation: 'slideIn 0.2s ease' }}
    >
      <span>{isErr ? '✕' : '✓'}</span>
      <span>{msg}</span>
    </div>
  )
}
