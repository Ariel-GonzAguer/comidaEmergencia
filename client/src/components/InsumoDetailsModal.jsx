/**
 * @file Modal para visualizar toda la información detallada de un insumo.
 * @module components/InsumoDetailsModal
 */

import { useEffect, useId, useRef, useCallback, useState } from 'react';

/**
 * Badge visual pequeño que muestra el código de un símbolo con su color asociado.
 * (Reutilizado o similar al de InsumoTable)
 */
const SIMBOLO_CLASS = {
  V: 'simbolo simbolo-v',
  '*': 'simbolo simbolo-star',
  R: 'simbolo simbolo-r',
  PS: 'simbolo simbolo-ps',
};

function SimboloBadge({ codigo, descripcion }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className={SIMBOLO_CLASS[codigo] ?? 'simbolo'} aria-hidden="true">
        {codigo}
      </span>
      <span className="text-base font-mono text-ink-mid">{descripcion}</span>
    </div>
  );
}

/**
 * Formatea una fecha ISO a un formato legible en español.
 * @param {string} isoString 
 * @returns {string}
 */
const formatFecha = (isoString) => {
  if (!isoString) return '—';
  try {
    return new Date(isoString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoString;
  }
};

/**
 * Modal de solo lectura para ver los detalles de un insumo.
 *
 * @param {Object} props
 * @param {import('../hooks/useInsumos').Insumo} props.insumo - Insumo base (resumen).
 * @param {import('../hooks/useInsumos').Simbolo[]} props.simbolosDef - Definiciones de símbolos.
 * @param {(id: string) => Promise<import('../hooks/useInsumos').Insumo>} props.onFetchDetalle - Función para traer info completa.
 * @param {() => void} props.onCerrar - Callback para cerrar el modal.
 * @returns {JSX.Element}
 */
export default function InsumoDetailsModal({ insumo: insumoBase, simbolosDef, onFetchDetalle, onCerrar }) {
  const [insumo, setInsumo] = useState(insumoBase);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);
  const titleId = useId();
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Cargar info completa al montar
  useEffect(() => {
    async function cargar() {
      try {
        setLoading(true);
        const completo = await onFetchDetalle(insumoBase.id);
        setInsumo(completo);
      } catch (err) {
        setErrorStatus('No se pudo cargar la información completa.');
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [insumoBase.id, onFetchDetalle]);

  // Mover foco al botón de cerrar al abrir (WCAG 2.4.3)
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  // Cerrar con Escape (WCAG 2.1.1)
  useEffect(() => {
    const handleEsc = e => {
      if (e.key === 'Escape') onCerrar();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onCerrar]);

  // Bloquear scroll del body al abrir el modal
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = 'auto');
  }, []);

  // Focus trap básico
  const handleKeyDown = useCallback(e => {
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const focusable = dialogRef.current.querySelectorAll(
      'button, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  if (!insumoBase) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onCerrar}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-lg bg-bg2 border border-edge shadow-xl p-6 rounded-sm flex flex-col gap-6 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="flex justify-between items-start border-b border-edge-dim pb-4">
          <div>
            <span className="text-base font-mono uppercase tracking-[0.2em] text-accent mb-1 block">
              Detalle del Insumo {loading && ' (Cargando...)'}
            </span>
            <h2 id={titleId} className="text-2xl font-mono font-bold text-ink uppercase leading-tight">
              {insumo.nombre}
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onCerrar}
            className="p-2 hover:bg-bg3 text-ink-dim hover:text-ink transition-colors"
            aria-label="Cerrar modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {errorStatus && (
          <div className="bg-[#e06060]/10 border border-[#e06060] text-[#e06060] p-3 text-base font-mono">
            {errorStatus}
          </div>
        )}

        {/* Contenido principal: Grid de información */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          <div className="flex flex-col gap-1">
            <span className="text-base font-mono uppercase tracking-widest text-ink-mid">
              Cantidad / Unidad
            </span>
            <div className="text-lg font-mono text-ink">
              {insumo.cantidad} <span className="text-ink-dim">{insumo.unidad}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-base font-mono uppercase tracking-widest text-ink-mid">
              Categoría
            </span>
            <div className="text-lg font-mono text-ink capitalize">{insumo.categoria}</div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-base font-mono uppercase tracking-widest text-ink-mid">
              Vencimiento
            </span>
            <div className="text-lg font-mono text-ink">{insumo.vencimiento || '—'}</div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-base font-mono uppercase tracking-widest text-ink-mid">
              Kcal / Prot
            </span>
            <div className="text-lg font-mono text-ink">
              {insumo.calorias || '0'} kcal / {insumo.proteina || '0'}g
            </div>
          </div>
        </div>

        {/* Sección de Auditoría (Fechas) */}
        {!loading && (
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t border-edge-dim border-dashed">
            <div className="flex flex-col gap-1">
              <span className="text-base font-mono uppercase tracking-widest text-ink-dim">
                Creado el
              </span>
              <div className="text-base font-mono text-ink-mid">
                {formatFecha(insumo.creadoEn)}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-base font-mono uppercase tracking-widest text-ink-dim">
                Actualizado el
              </span>
              <div className="text-base font-mono text-ink-mid">
                {formatFecha(insumo.actualizadoEn)}
              </div>
            </div>
          </div>
        )}

        {/* Sección de Símbolos */}
        {insumo.simbolos && insumo.simbolos.length > 0 && (
          <div className="border-t border-edge-dim pt-4">
            <span className="text-base font-mono uppercase tracking-widest text-ink-mid mb-3 block">
              Clasificación y Símbolos
            </span>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {insumo.simbolos.map(codigo => {
                const def = simbolosDef.find(s => s.codigo === codigo);
                return (
                  <SimboloBadge
                    key={codigo}
                    codigo={codigo}
                    descripcion={def ? def.descripcion : codigo}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Sección de Notas */}
        <div className="border-t border-edge-dim pt-4">
          <span className="text-base font-mono uppercase tracking-widest text-ink-mid mb-2 block">
            Notas adicionales
          </span>
          <p className="text-base text-ink-mid leading-relaxed italic bg-bg3/50 p-3 border-l-2 border-edge min-h-12">
            {insumo.notas || 'Sin observaciones registradas.'}
          </p>
        </div>

        {/* Footer con acciones (opcional, por ahora solo cerrar) */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onCerrar}
            className="px-6 py-2.5 bg-bg3 border border-edge hover:border-ink-dim text-ink-mid hover:text-ink font-mono uppercase tracking-widest transition-all text-base"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
