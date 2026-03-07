/**
 * @file Barra de filtros: campo de búsqueda por texto y botones de categoría.
 * @module components/FilterBar
 */

import { useEffect, useRef } from 'react'

/**
 * Barra de filtros con búsqueda de texto (atajo `/`) y selección de categoría.
 *
 * Registra un listener de teclado global: al presionar `/` (fuera de inputs)
 * se enfoca automáticamente el campo de búsqueda.
 *
 * @param {Object}   props
 * @param {import('../hooks/useInsumos').Filtros} props.filtros    - Estado actual de los filtros.
 * @param {Function} props.setFiltros  - Setter para actualizar los filtros.
 * @param {string[]} props.categorias  - Lista de categorías disponibles.
 * @returns {JSX.Element}
 */
export default function FilterBar({ filtros, setFiltros, categorias }) {
  const inputRef = useRef(null)

  useEffect(() => {
    function onKey(e) {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="px-6 py-3 flex flex-col gap-2.5 border-b border-[var(--edge)] bg-[var(--bg1)]">
      {/* label .sr-only: visible para SR, oculto visualmente (WCAG 1.3.1) */}
      <label htmlFor="buscar-insumo" className="sr-only">Buscar insumo</label>
      <input
        ref={inputRef}
        id="buscar-insumo"
        type="text"
        placeholder="Buscar insumo... [/]"
        value={filtros.texto}
        onChange={e => setFiltros(f => ({ ...f, texto: e.target.value }))}
        className="font-mono text-[14px] bg-[var(--bg3)] border border-[var(--edge)] text-[var(--ink)] px-3 py-[7px] rounded-sm outline-none w-full max-w-[480px] transition-colors placeholder:text-[var(--ink-dim)] focus:border-[var(--accent-d)]"
      />
      <div className="flex flex-wrap gap-1.5">
        {['todas', ...categorias].map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setFiltros(f => ({ ...f, categoria: cat }))}
            aria-pressed={filtros.categoria === cat}
            className={`font-mono text-[14px] tracking-[0.1em] px-2.5 py-[3px] border rounded-sm uppercase cursor-pointer transition-colors ${
              filtros.categoria === cat
                ? 'bg-[var(--bg3)] border-[var(--accent-d)] text-[var(--accent)]'
                : 'border-[var(--edge)] text-[var(--ink-mid)] hover:border-[var(--edge-hi)] hover:text-[var(--ink)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}
