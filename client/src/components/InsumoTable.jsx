const SIMBOLO_CLASS = {
  V:   'sym sym-v',
  '*': 'sym sym-star',
  R:   'sym sym-r',
  PS:  'sym sym-ps',
  GY:  'sym sym-gy',
}

function SimboloBadge({ codigo }) {
  return <span className={SIMBOLO_CLASS[codigo] ?? 'sym'}>{codigo}</span>
}

function VencimientoCell({ valor }) {
  if (!valor) return <span className="text-[var(--ink-dim)]">—</span>
  if (valor === 'no vence') return <span className="text-[var(--ink-mid)]">∞</span>

  const [anio, mes] = valor.split('-').map(Number)
  if (anio && mes) {
    const hoy = new Date()
    const vence = new Date(anio, mes - 1, 1)
    const mesesRestantes = (vence.getFullYear() - hoy.getFullYear()) * 12 + (vence.getMonth() - hoy.getMonth())
    let cls = 'fecha-ok'
    if (mesesRestantes < 0) cls = 'fecha-vencida'
    else if (mesesRestantes <= 3) cls = 'fecha-pronto'
    else if (mesesRestantes <= 12) cls = 'fecha-este-anio'
    return <span className={cls}>{mes}/{anio}</span>
  }

  return <span className="text-[var(--ink-mid)]">{valor}</span>
}

const TH = 'font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-[var(--ink-mid)] px-3.5 py-[9px] text-left whitespace-nowrap'
const TD = 'px-3.5 py-2 align-middle text-[12px]'

export default function InsumoTable({ insumos, loading, simbolosDef, onEditar, onEliminar }) {
  if (loading) {
    return (
      <div className="flex items-center gap-2.5 px-6 py-[60px] text-[var(--ink-dim)] text-[12px] tracking-[0.1em]">
        <span style={{ animation: 'spin 1.4s linear infinite', display: 'inline-block' }}>◌</span>
        <span>cargando...</span>
      </div>
    )
  }

  if (!insumos.length) {
    return <div className="px-6 py-[60px] text-[var(--ink-dim)] text-[12px] tracking-[0.1em]">Sin resultados</div>
  }

  return (
    <div className="overflow-x-auto flex-1">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[var(--bg1)] border-b border-[var(--edge-hi)]">
            <th className={TH}>Producto</th>
            <th className={TH}>Cantidad</th>
            <th className={TH}>Categoría</th>
            <th className={TH}>Vencimiento</th>
            <th className={TH}>kcal</th>
            <th className={TH}>Prot.</th>
            <th className={TH}>Estado</th>
            <th className={TH}>Notas</th>
            <th className={TH}></th>
          </tr>
        </thead>
        <tbody>
          {insumos.map(item => (
            <tr key={item.id} className="border-b border-[var(--edge)] hover:bg-[var(--bg1)] transition-colors">
              <td className={`${TD} max-w-[220px]`}>
                <div className="text-[var(--ink-hi)]">{item.nombre}</div>
              </td>
              <td className={`${TD} font-mono`}>
                {item.cantidad
                  ? <>{item.cantidad}{item.unidad ? <span className="text-[var(--ink-dim)] text-[10px]"> {item.unidad}</span> : null}</>
                  : <span className="text-[var(--ink-dim)]">—</span>}
              </td>
              <td className={TD}>
                <span className="text-[9px] tracking-[0.1em] uppercase text-[var(--ink-dim)] border border-[var(--edge)] px-1.5 py-[1px] rounded-sm">
                  {item.categoria}
                </span>
              </td>
              <td className={TD}><VencimientoCell valor={item.vencimiento} /></td>
              <td className={`${TD} font-mono text-right text-[var(--ink-mid)]`}>
                {item.calorias != null ? item.calorias : <span className="text-[var(--ink-dim)]">—</span>}
              </td>
              <td className={`${TD} font-mono text-right text-[var(--ink-mid)]`}>
                {item.proteina != null ? `${item.proteina}g` : <span className="text-[var(--ink-dim)]">—</span>}
              </td>
              <td className={`${TD} whitespace-nowrap`}>
                {item.simbolos?.length
                  ? item.simbolos.map(s => <SimboloBadge key={s} codigo={s} />)
                  : <span className="text-[var(--ink-dim)]">—</span>}
              </td>
              <td className={`${TD} max-w-[180px] text-[var(--ink-mid)] text-[11px] italic whitespace-nowrap overflow-hidden text-ellipsis`}>
                {item.notas || <span className="text-[var(--ink-dim)]">—</span>}
              </td>
              <td className={`${TD} whitespace-nowrap text-right`}>
                <button
                  onClick={() => onEditar(item)}
                  title="Editar"
                  className="text-[var(--ink-dim)] hover:text-[var(--accent)] text-[14px] px-1.5 py-0.5 rounded-sm cursor-pointer bg-transparent border-none transition-colors"
                >✎</button>
                <button
                  onClick={() => onEliminar(item)}
                  title="Eliminar"
                  className="text-[var(--ink-dim)] hover:text-[#e06060] text-[14px] px-1.5 py-0.5 rounded-sm cursor-pointer bg-transparent border-none transition-colors"
                >✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
