export default function Header({ onNuevo, total }) {
  return (
    <header className="flex items-center justify-between px-6 py-[18px] pb-[14px] border-b border-[var(--edge)] sticky top-0 bg-[var(--bg)] z-10 gap-3">
      <div className="flex items-center gap-3">
        <span className="text-[22px] text-[var(--accent)] leading-none">▣</span>
        <div>
          <h1 className="font-mono text-[15px] font-semibold tracking-[0.2em] text-[var(--ink-hi)] uppercase">INVENTARIO</h1>
          <p className="text-[10px] text-[var(--ink-dim)] tracking-[0.12em] mt-px">emergencia · {total} insumos</p>
        </div>
      </div>
      <button
        onClick={onNuevo}
        className="font-mono text-[12px] px-3.5 py-1.5 border border-[var(--accent-d)] text-[var(--accent)] rounded-sm tracking-[0.06em] bg-transparent cursor-pointer transition-colors hover:bg-[var(--accent)] hover:text-[var(--bg)] hover:border-[var(--accent)] whitespace-nowrap"
      >
        + nuevo
      </button>
    </header>
  )
}
