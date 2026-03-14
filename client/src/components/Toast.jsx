/**
 * Notificación efímera (toast) que aparece en la esquina inferior derecha.
 * Muestra un mensaje de éxito o error con animación de entrada.
 *
 * @param {Object} props
 * @param {string}          props.mensaje  - Texto a mostrar.
 * @param {'ok'|'error'}    props.tipo - Tipo de notificación (define color/icono).
 * @returns {JSX.Element}
 */
export default function Toast({ mensaje, tipo }) {
  const isErr = tipo === 'error';
  return (
    <div
      role={isErr ? 'alert' : 'status'}
      aria-live={isErr ? 'assertive' : 'polite'}
      aria-atomic="true"
      aria-label={isErr ? 'Error' : 'Éxito'}
      className={`fixed text-white bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 rounded-sm font-mono text-base tracking-[0.06em] z-200 border ${
        isErr ? 'bg-danger border-danger-hi ' : 'bg-ok border-[#3a7a50]'
      }`}
      style={{ animation: 'slideIn 0.2s ease' }}
    >
      <span aria-hidden="true">{isErr ? '✕' : '✓'}</span>
      <span>{mensaje}</span>
    </div>
  );
}
