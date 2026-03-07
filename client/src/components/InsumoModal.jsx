/**
 * @file Modal/formulario para crear o editar un insumo.
 * @module components/InsumoModal
 */

import { useState, useEffect, useId, useRef } from 'react'

/**
 * Valores por defecto de un insumo vacío (usado al crear).
 * @constant {Object}
 */
const VACIO = {
  nombre: '',
  cantidad: '',
  unidad: '',
  categoria: 'alimentos',
  vencimiento: '',
  calorias: '',
  proteina: '',
  notas: '',
  simbolos: [],
}

/** @constant {string} Clases Tailwind reutilizables para inputs del formulario */
const INPUT = 'font-mono text-[14px] bg-[var(--bg3)] border border-[var(--edge)] text-[var(--ink)] px-2.5 py-[7px] rounded-sm outline-none transition-colors focus:border-[var(--accent-d)] focus-visible:ring-1 focus-visible:ring-[var(--accent)] placeholder:text-[var(--ink-dim)] w-full'
/** @constant {string} Clases Tailwind reutilizables para labels del formulario */
const LABEL = 'text-[14px] tracking-[0.1em] uppercase text-[var(--ink-mid)]'

/**
 * Modal con formulario para crear o editar un insumo.
 *
 * Se cierra con Escape, clic fuera del card, o el botón de cerrar.
 * En modo "editar" precarga los valores del insumo recibido.
 *
 * @param {Object}   props
 * @param {'crear'|'editar'} props.modo           - Modo de operación del formulario.
 * @param {import('../hooks/useInsumos').Insumo} [props.insumoInicial] - Insumo a editar (solo en modo "editar").
 * @param {string[]} props.categorias             - Categorías disponibles para el select.
 * @param {import('../hooks/useInsumos').Simbolo[]} props.simbolosDef - Símbolos disponibles.
 * @param {(datos: Object) => Promise<void>} props.onGuardar - Callback al enviar el formulario.
 * @param {() => void} props.onCerrar             - Callback para cerrar el modal.
 * @returns {JSX.Element}
 */
export default function InsumoModal({ modo, insumoInicial, categorias, simbolosDef, onGuardar, onCerrar }) {
  const [form, setForm] = useState(VACIO)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const titleId = useId()
  const closeBtnRef = useRef(null)

  // Mover foco al botón de cerrar cuando el modal abre (WCAG 2.4.3)
  useEffect(() => { closeBtnRef.current?.focus() }, [])

  useEffect(() => {
    if (modo === 'editar' && insumoInicial) {
      setForm({
        nombre:       insumoInicial.nombre       ?? '',
        cantidad:     insumoInicial.cantidad     ?? '',
        unidad:       insumoInicial.unidad       ?? '',
        categoria:    insumoInicial.categoria    ?? 'alimentos',
        vencimiento:  insumoInicial.vencimiento  ?? '',
        calorias:     insumoInicial.calorias     != null ? String(insumoInicial.calorias) : '',
        proteina:     insumoInicial.proteina     != null ? String(insumoInicial.proteina) : '',
        notas:        insumoInicial.notas        ?? '',
        simbolos:     insumoInicial.simbolos     ?? [],
      })
    } else {
      setForm(VACIO)
    }
  }, [modo, insumoInicial])

  /**
   * Actualiza un campo individual del formulario.
   *
   * @param {string} campo - Nombre del campo a actualizar.
   * @param {*}      valor - Nuevo valor.
   */
  function set(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }))
  }

  /**
   * Alterna la selección de un símbolo en el formulario.
   *
   * @param {string} cod - Código del símbolo a activar/desactivar.
   */
  function toggleSimbolo(cod) {
    setForm(f => ({
      ...f,
      simbolos: f.simbolos.includes(cod)
        ? f.simbolos.filter(s => s !== cod)
        : [...f.simbolos, cod],
    }))
  }

  /**
   * Handler del formulario. Valida el nombre, convierte campos numéricos
   * y delega en `onGuardar`.
   *
   * @async
   * @param {Event} e - Evento submit del formulario.
   */
  async function handleSubmit(e) {
    e.preventDefault()
    setErr('')
    if (!form.nombre.trim()) { setErr('El nombre es obligatorio'); return }
    setSaving(true)
    try {
      await onGuardar({
        ...form,
        calorias: form.calorias !== '' ? Number(form.calorias) : null,
        proteina: form.proteina !== '' ? Number(form.proteina) : null,
      })
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  // Cerrar con Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onCerrar() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCerrar])

  const btnBase = 'font-mono text-[14px] px-3.5 py-1.5 border rounded-sm tracking-[0.06em] bg-transparent cursor-pointer transition-colors whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg)]'

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-5"
      onClick={e => e.target === e.currentTarget && onCerrar()}
    >
      {/* Dialog: role + aria-modal + aria-labelledby (WCAG 4.1.2 / 2.4.3) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-[var(--bg2)] border border-[var(--edge-hi)] rounded-sm w-full max-w-[560px] max-h-[90dvh] overflow-y-auto flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-[18px] py-3.5 border-b border-[var(--edge)]">
          <h2 id={titleId} className="text-[14px] tracking-[0.12em] uppercase text-[var(--ink-mid)] m-0 font-normal">
            {modo === 'crear' ? '+ nuevo insumo' : '✎ editar insumo'}
          </h2>
          {/* Botón cerrar: ref para foco inicial + aria-label para SR (WCAG 2.4.6 / 4.1.2) */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar diálogo"
            className="text-[var(--ink-dim)] hover:text-[var(--accent)] text-[14px] min-w-[32px] min-h-[32px] flex items-center justify-center bg-transparent border-none cursor-pointer transition-colors rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg)]"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {/* noValidate: validación accesible manual (WCAG 3.3.1) */}
        <form className="p-[18px] flex flex-col gap-3.5" onSubmit={handleSubmit} noValidate>

          {/* Nombre — campo requerido (WCAG 1.3.1 / 3.3.2) */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="f-nombre" className={LABEL}>
              Nombre
              <span aria-hidden="true" className="ml-1 text-[#e06060]" title="Requerido">*</span>
              <span className="sr-only">(requerido)</span>
            </label>
            <input
              id="f-nombre"
              className={INPUT}
              value={form.nombre}
              onChange={e => set('nombre', e.target.value)}
              autoFocus
              placeholder="Ej: Arroz blanco"
              aria-required="true"
            />
          </div>

          {/* Cantidad + Unidad */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="f-cantidad" className={LABEL}>Cantidad</label>
              <input id="f-cantidad" className={INPUT} value={form.cantidad} onChange={e => set('cantidad', e.target.value)} placeholder="Ej: 2x 500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="f-unidad" className={LABEL}>Unidad</label>
              <input id="f-unidad" className={INPUT} value={form.unidad} onChange={e => set('unidad', e.target.value)} placeholder="g / ml / kg" />
            </div>
          </div>

          {/* Categoría + Vencimiento */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="f-categoria" className={LABEL}>Categoría</label>
              <select
                id="f-categoria"
                className={`${INPUT} cursor-pointer appearance-none`}
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23555550'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: '28px' }}
                value={form.categoria}
                onChange={e => set('categoria', e.target.value)}
              >
                {categorias.map(c => <option key={c} value={c} style={{ background: 'var(--bg3)' }}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="f-vencimiento" className={LABEL}>Vencimiento</label>
              <input id="f-vencimiento" className={INPUT} value={form.vencimiento} onChange={e => set('vencimiento', e.target.value)} placeholder="AAAA-MM o 'no vence'" />
            </div>
          </div>

          {/* Calorías + Proteína */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="f-calorias" className={LABEL}>Calorías (kcal/porción)</label>
              <input id="f-calorias" className={INPUT} type="number" min="0" value={form.calorias} onChange={e => set('calorias', e.target.value)} placeholder="—" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="f-proteina" className={LABEL}>Proteína (g/porción)</label>
              <input id="f-proteina" className={INPUT} type="number" min="0" step="0.1" value={form.proteina} onChange={e => set('proteina', e.target.value)} placeholder="—" />
            </div>
          </div>

          {/* Notas */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="f-notas" className={LABEL}>Notas</label>
            <input id="f-notas" className={INPUT} value={form.notas} onChange={e => set('notas', e.target.value)} placeholder="Observaciones..." />
          </div>

          {/* Símbolos — fieldset semántico (WCAG 1.3.1) + aria-pressed (WCAG 4.1.2) */}
          <fieldset className="flex flex-col gap-1.5 border-0 p-0 m-0">
            <legend className={LABEL}>Estado / Símbolos</legend>
            <div className="flex flex-wrap gap-1.5">
              {simbolosDef.map(s => (
                <button
                  key={s.codigo}
                  type="button"
                  onClick={() => toggleSimbolo(s.codigo)}
                  aria-pressed={form.simbolos.includes(s.codigo)}
                  aria-label={s.descripcion}
                  className={`font-mono text-[14px] font-semibold px-2.5 py-1 rounded-sm border cursor-pointer tracking-[0.05em] transition-all outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg)] ${
                    form.simbolos.includes(s.codigo)
                      ? 'border-[var(--accent-d)] text-[var(--accent)] bg-[#1e1800]'
                      : 'border-[var(--edge)] bg-[var(--bg3)] text-[var(--ink-dim)] hover:border-[var(--edge-hi)] hover:text-[var(--ink)]'
                  }`}
                >
                  <span aria-hidden="true">{s.codigo}</span>
                </button>
              ))}
            </div>
          </fieldset>

          {/* Error — role=alert para anuncio inmediato (WCAG 4.1.3) */}
          {err && (
            <p role="alert" aria-live="assertive" aria-atomic="true" className="text-[14px] text-[#e06060] px-2.5 py-1.5 border border-[#5c1f1f] rounded-sm">{err}</p>
          )}

          <div className="flex justify-end gap-2 pt-1 border-t border-[var(--edge)] mt-auto">
            <button
              type="button"
              onClick={onCerrar}
              className={`${btnBase} border-[var(--edge)] text-[var(--ink-mid)] hover:border-[var(--edge-hi)] hover:text-[var(--ink)]`}
            >cancelar</button>
            {/* aria-busy + aria-disabled comunican estado de carga (WCAG 4.1.2) */}
            <button
              type="submit"
              disabled={saving}
              aria-busy={saving}
              aria-disabled={saving}
              aria-label={saving ? 'Guardando, por favor espere' : modo === 'crear' ? 'Crear insumo' : 'Guardar cambios'}
              className={`${btnBase} border-[var(--accent-d)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)] hover:border-[var(--accent)] disabled:opacity-50`}
            >
              {saving ? '...' : modo === 'crear' ? 'crear' : 'guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
