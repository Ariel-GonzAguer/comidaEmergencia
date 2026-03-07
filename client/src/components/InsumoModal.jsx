import { useState, useEffect } from 'react'

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

const INPUT = 'font-mono text-[12px] bg-[var(--bg3)] border border-[var(--edge)] text-[var(--ink)] px-2.5 py-[7px] rounded-sm outline-none transition-colors focus:border-[var(--accent-d)] placeholder:text-[var(--ink-dim)] w-full'
const LABEL = 'text-[10px] tracking-[0.1em] uppercase text-[var(--ink-mid)]'

export default function InsumoModal({ modo, insumoInicial, categorias, simbolosDef, onGuardar, onCerrar }) {
  const [form, setForm] = useState(VACIO)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

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

  function set(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }))
  }

  function toggleSimbolo(cod) {
    setForm(f => ({
      ...f,
      simbolos: f.simbolos.includes(cod)
        ? f.simbolos.filter(s => s !== cod)
        : [...f.simbolos, cod],
    }))
  }

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

  const btnBase = 'font-mono text-[12px] px-3.5 py-1.5 border rounded-sm tracking-[0.06em] bg-transparent cursor-pointer transition-colors whitespace-nowrap'

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-100 p-5"
      onClick={e => e.target === e.currentTarget && onCerrar()}
    >
      <div className="bg-[var(--bg2)] border border-[var(--edge-hi)] rounded-sm w-full max-w-[560px] max-h-[90dvh] overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between px-[18px] py-3.5 border-b border-[var(--edge)] text-[11px] tracking-[0.12em] uppercase text-[var(--ink-mid)]">
          <span>{modo === 'crear' ? '+ nuevo insumo' : '✎ editar insumo'}</span>
          <button onClick={onCerrar} className="text-[var(--ink-dim)] hover:text-[var(--accent)] text-[14px] px-1.5 py-0.5 bg-transparent border-none cursor-pointer transition-colors">✕</button>
        </div>

        <form className="p-[18px] flex flex-col gap-3.5" onSubmit={handleSubmit}>

          {/* Nombre */}
          <div className="flex flex-col gap-1.5">
            <label className={LABEL}>Nombre *</label>
            <input className={INPUT} value={form.nombre} onChange={e => set('nombre', e.target.value)} autoFocus placeholder="Ej: Arroz blanco" />
          </div>

          {/* Cantidad + Unidad */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>Cantidad</label>
              <input className={INPUT} value={form.cantidad} onChange={e => set('cantidad', e.target.value)} placeholder="Ej: 2x 500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>Unidad</label>
              <input className={INPUT} value={form.unidad} onChange={e => set('unidad', e.target.value)} placeholder="g / ml / kg" />
            </div>
          </div>

          {/* Categoría + Vencimiento */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>Categoría</label>
              <select
                className={`${INPUT} cursor-pointer appearance-none`}
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23555550'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: '28px' }}
                value={form.categoria}
                onChange={e => set('categoria', e.target.value)}
              >
                {categorias.map(c => <option key={c} value={c} style={{ background: 'var(--bg3)' }}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>Vencimiento</label>
              <input className={INPUT} value={form.vencimiento} onChange={e => set('vencimiento', e.target.value)} placeholder="AAAA-MM o 'no vence'" />
            </div>
          </div>

          {/* Calorías + Proteína */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>Calorías (kcal/porción)</label>
              <input className={INPUT} type="number" min="0" value={form.calorias} onChange={e => set('calorias', e.target.value)} placeholder="—" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>Proteína (g/porción)</label>
              <input className={INPUT} type="number" min="0" step="0.1" value={form.proteina} onChange={e => set('proteina', e.target.value)} placeholder="—" />
            </div>
          </div>

          {/* Notas */}
          <div className="flex flex-col gap-1.5">
            <label className={LABEL}>Notas</label>
            <input className={INPUT} value={form.notas} onChange={e => set('notas', e.target.value)} placeholder="Observaciones..." />
          </div>

          {/* Símbolos */}
          <div className="flex flex-col gap-1.5">
            <label className={LABEL}>Estado / Símbolos</label>
            <div className="flex flex-wrap gap-1.5">
              {simbolosDef.map(s => (
                <button
                  key={s.codigo}
                  type="button"
                  onClick={() => toggleSimbolo(s.codigo)}
                  title={s.descripcion}
                  className={`font-mono text-[11px] font-semibold px-2.5 py-1 rounded-sm border cursor-pointer tracking-[0.05em] transition-all ${
                    form.simbolos.includes(s.codigo)
                      ? 'border-[var(--accent-d)] text-[var(--accent)] bg-[#1e1800]'
                      : 'border-[var(--edge)] bg-[var(--bg3)] text-[var(--ink-dim)] hover:border-[var(--edge-hi)] hover:text-[var(--ink)]'
                  }`}
                >
                  {s.codigo}
                </button>
              ))}
            </div>
          </div>

          {err && (
            <p className="text-[11px] text-[#e06060] px-2.5 py-1.5 border border-[#5c1f1f] rounded-sm">{err}</p>
          )}

          <div className="flex justify-end gap-2 pt-1 border-t border-[var(--edge)] mt-auto">
            <button type="button" onClick={onCerrar} className={`${btnBase} border-[var(--edge)] text-[var(--ink-mid)] hover:border-[var(--edge-hi)] hover:text-[var(--ink)]`}>cancelar</button>
            <button type="submit" disabled={saving} className={`${btnBase} border-[var(--accent-d)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)] hover:border-[var(--accent)] disabled:opacity-50`}>
              {saving ? '...' : modo === 'crear' ? 'crear' : 'guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
