/**
 * Cabecera fija de la aplicación. Muestra el título, el conteo total de
 * insumos y un botón para crear un nuevo insumo.
 *
 * @param {Object} props
 * @param {() => void} props.onNuevo       - Callback al pulsar "+ agregar".
 * @param {number}     props.total         - Cantidad total de insumos mostrados.
 * @returns {JSX.Element}
 */
export default function Header({ onNuevo, total }) {
  return (
    <header className="flex items-center justify-between px-6 py-4.5 pb-3.5 border-b border-edge sticky top-0 bg-bg z-10 gap-3">
      <div className="flex items-center gap-3">
        <span className="text-5xl text-accent leading-none" aria-hidden="true">
          ▣
        </span>
        <div>
          <h1 className="font-mono text-3xl font-semibold tracking-widest text-orange-400 uppercase mb-4">
            Comida Emergencia Mini
          </h1>
          <div className="flex flex-col mb-4">
            <p
              className="text-base text-ink-dim tracking-widest mt-px"
              aria-live="polite"
              aria-atomic="true"
            >
              Insumos totales: {total}
            </p>
          </div>
          <dl className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-ink-dim">
            <div className="flex items-center gap-1">
              <dt>
                <span className="simbolo-star p-1">*</span>
              </dt>
              <dd>Vence este año (2026)</dd>
            </div>
            <div className="flex items-center gap-1 pl-2 border-l border-edge">
              <dt>
                <span className="simbolo-v p-1">V</span>
              </dt>
              <dd>Ya vencido</dd>
            </div>
            <div className="flex items-center gap-1 pl-2 border-l border-edge">
              <dt>
                <span className="simbolo-r p-1">R</span>
              </dt>
              <dd>Reponer</dd>
            </div>
            <div className="flex items-center gap-1 pl-2 border-l border-edge">
              <dt>
                <span className="simbolo-ps p-1">PS</span>
              </dt>
              <dd>Pronto sacar (Reponer asumido)</dd>
            </div>
            <div className="flex items-center gap-1 pl-2 border-l border-edge">
              <dt>
                <span className="text-ink-mid font-extrabold">—</span>
              </dt>
              <dd>Vence en 2027 o posterior</dd>
            </div>
          </dl>
        </div>
      </div>
      <button
        type="button"
        onClick={onNuevo}
        aria-label="Agregar nuevo insumo"
        className="font-mono text-xl px-3.5 py-1.5 border border-accent-d text-accent rounded-sm tracking-[0.06em] bg-transparent cursor-pointer transition-colors hover:bg-accent hover:text-bg hover:border-accent whitespace-nowrap"
      >
        + agregar <span className="text-[12px] opacity-60">[+]</span>
      </button>
    </header>
  );
}
