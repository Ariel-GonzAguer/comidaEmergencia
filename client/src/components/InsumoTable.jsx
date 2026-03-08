/**
 * @file Tabla principal de insumos con badges de símbolo, colores de vencimiento
 * y acciones de editar/eliminar por fila.
 * @module components/InsumoTable
 */

/**
 * Mapa de código de símbolo → clases CSS para el badge.
 * @constant {Record<string, string>}
 */
const SIMBOLO_CLASS = {
  V:   'sym sym-v',
  '*': 'sym sym-star',
  R:   'sym sym-r',
  PS:  'sym sym-ps',
}

/**
 * Badge visual pequeño que muestra el código de un símbolo con su color asociado.
 *
 * @param {Object} props
 * @param {string} props.codigo - Código del símbolo (ej: "V", "*", "R").
 * @param {string} [props.descripcion] - Descripción del símbolo para aria-label.
 * @returns {JSX.Element}
 */
function SimboloBadge({ codigo, descripcion }) {
  return <span className={SIMBOLO_CLASS[codigo] ?? 'sym'} aria-label={descripcion}>{codigo}</span>
}

/**
 * Celda que muestra la fecha de vencimiento con codificación por colores:
 * - verde/gris: vence en más de 12 meses.
 * - amarillo:   vence dentro del año.
 * - naranja:    vence en 3 meses o menos.
 * - rojo + tachado: ya vencido.
 *
 * @param {Object} props
 * @param {string} props.valor - Fecha "AAAA-MM", "no vence", o vacío.
 * @returns {JSX.Element}
 */
function VencimientoCell({ valor }) {
  if (!valor) return <span className="text-ink-dim" aria-label="No especificado">—</span>
  if (valor === 'no vence') return <span className="text-ink-mid" aria-label="No vence">∞</span>

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

  return <span className="text-ink-mid">{valor}</span>
}

/** @constant {string} Clases Tailwind para celdas de encabezado */
const TH = 'font-mono text-base font-medium tracking-[0.12em] uppercase text-ink-mid px-3.5 py-[9px] text-left whitespace-nowrap'
/** @constant {string} Clases Tailwind para celdas de datos */
const TD = 'px-3.5 py-2 align-middle text-base'

/**
 * Tabla principal que lista todos los insumos del inventario.
 *
 * Muestra un spinner durante la carga, un mensaje vacío cuando no hay resultados,
 * o la tabla completa con columnas de producto, cantidad, categoría, vencimiento,
 * calorías, proteína, símbolos, notas y acciones.
 *
 * @param {Object}   props
 * @param {import('../hooks/useInsumos').Insumo[]} props.insumos     - Lista de insumos a renderizar.
 * @param {boolean}  props.loading      - Si está cargando datos.
 * @param {import('../hooks/useInsumos').Simbolo[]} props.simbolosDef - Definiciones de símbolos disponibles.
 * @param {(insumo: Object) => void} props.onEditar   - Callback al pulsar editar.
 * @param {(insumo: Object) => void} props.onEliminar - Callback al pulsar eliminar.
 * @returns {JSX.Element}
 */
export default function InsumoTable({ insumos, loading, simbolosDef, onEditar, onEliminar }) {
  // Mapeo de símbolo → descripción para aria-label en badges
  const simbolosMap = simbolosDef.reduce((acc, s) => ({ ...acc, [s.codigo]: s.descripcion }), {})

  if (loading) {
    return (
      <div role="status" aria-label="Cargando inventario" className="flex items-center gap-2.5 px-6 py-15 text-ink-dim text-base tracking-widest">
        <span aria-hidden="true" style={{ animation: 'spin 1.4s linear infinite', display: 'inline-block' }}>◌</span>
        <span>cargando...</span>
      </div>
    )
  }

  if (!insumos.length) {
    return <div role="status" aria-label="No hay insumos" className="px-6 py-15 text-ink-dim text-base tracking-widest">Sin resultados</div>
  }

  return (
    <div className="overflow-x-auto flex-1">
      <table className="w-full border-collapse">
        {/* caption .sr-only lo enuncia el SR pero no cambia la apariencia (WCAG 1.3.1) */}
        <caption className="sr-only">Inventario de insumos de emergencia</caption>
        <thead>
          <tr className="bg-bg1 border-b border-edge-hi">
            <th scope="col" className={TH}>Producto</th>
            <th scope="col" className={TH}>Cantidad</th>
            <th scope="col" className={TH}>Categoría</th>
            <th scope="col" className={TH}>Vencimiento</th>
            <th scope="col" className={TH}>kcal</th>
            <th scope="col" className={TH}>Prot.</th>
            <th scope="col" className={TH}>Estado</th>
            <th scope="col" className={TH}>Notas</th>
            <th scope="col" className={TH}><span className="sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {insumos.map(item => (
            <tr key={item.id} className="border-b border-edge hover:bg-bg1 transition-colors">
              <th scope="row" className={`${TD} max-w-55 text-left font-normal`}>
                <div className="text-ink-hi">{item.nombre}</div>
              </th>
              <td className={`${TD} font-mono`}>
                {item.cantidad
                  ? <>{item.cantidad}{item.unidad ? <span className="text-ink-dim text-base"> {item.unidad}</span> : null}</>
                  : <span className="text-ink-dim">—</span>}
              </td>
              <td className={TD}>
                <span className="text-base tracking-widest uppercase text-ink-dim border border-edge px-1.5 py-px rounded-sm" aria-label={`Categoría: ${item.categoria}`}>
                  {item.categoria}
                </span>
              </td>
              <td className={TD}><VencimientoCell valor={item.vencimiento} /></td>
              <td className={`${TD} font-mono text-right text-ink-mid`}>
                {item.calorias != null ? item.calorias : <span className="text-ink-dim">—</span>}
              </td>
              <td className={`${TD} font-mono text-right text-ink-mid`}>
                {item.proteina != null ? `${item.proteina}g` : <span className="text-ink-dim">—</span>}
              </td>
              <td className={`${TD} whitespace-nowrap`}>
                {item.simbolos?.length
                  ? item.simbolos.map(s => <SimboloBadge key={s} codigo={s} descripcion={simbolosMap[s]} />)
                  : <span className="text-ink-dim" aria-label="Sin estado o símbolos">—</span>}
              </td>
              <td className={`${TD} max-w-45 text-ink-mid text-base italic whitespace-nowrap overflow-hidden text-ellipsis`}>
                {item.notas || <span className="text-ink-dim">—</span>}
              </td>
              <td className={`${TD} whitespace-nowrap text-right`}>
                {/* aria-label con nombre del insumo: imprescindible para SR (WCAG 2.1.1 / 4.1.2) */}
                <button
                  type="button"
                  onClick={() => onEditar(item)}
                  aria-label={`Editar ${item.nombre}`}
                  className="text-ink-dim hover:text-accent text-base px-1.5 py-0.5 rounded-sm cursor-pointer bg-transparent border-none transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-bg"
                ><span aria-hidden="true">✎</span></button>
                <button
                  type="button"
                  onClick={() => onEliminar(item)}
                  aria-label={`Eliminar ${item.nombre}`}
                  className="text-ink-dim hover:text-[#e06060] text-base px-1.5 py-0.5 rounded-sm cursor-pointer bg-transparent border-none transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#e06060] focus-visible:ring-offset-1 focus-visible:ring-offset-bg"
                ><span aria-hidden="true">✕</span></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
