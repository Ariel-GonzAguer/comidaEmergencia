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
    <div role="toolbar" aria-label="Filtros de inventario" className="px-6 py-3 flex flex-col gap-2.5 border-b border-edge bg-bg1">
      <search>
        <label htmlFor="buscar-insumo" className="sr-only">Buscar insumo</label>
        <span id="buscar-hint" className="sr-only">Presiona / para enfocar este campo</span>
        <input
          ref={inputRef}
          id="buscar-insumo"
          type="text"
          placeholder="Buscar insumo... [/]"
          value={filtros.texto}
          onChange={e => setFiltros(f => ({ ...f, texto: e.target.value }))}
          aria-describedby="buscar-hint"
          className="font-mono text-lg bg-bg3 border border-ink/50 text-ink px-3 py-1.75 rounded-sm outline-none w-full max-w-120 transition-colors placeholder:text-ink-dim focus:border-accent-d"
        />
      </search>
      <div role="group" aria-label="Filtrar por categoría" className="flex flex-wrap gap-1.5">
        {['todas', ...categorias].map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setFiltros(f => ({ ...f, categoria: cat }))}
            aria-pressed={filtros.categoria === cat}
            className={`font-mono text-[14px] tracking-widest px-2.5 py-0.75 border rounded-sm uppercase cursor-pointer transition-colors ${
              filtros.categoria === cat
                ? 'bg-bg3 border-accent-d text-accent'
                : 'border-edge text-ink-mid hover:border-edge-hi hover:text-ink'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}
