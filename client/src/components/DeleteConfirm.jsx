export default function DeleteConfirm({ nombre, onConfirmar, onCancelar }) {
  const btnBase = 'font-mono text-[12px] px-3.5 py-1.5 border rounded-sm tracking-[0.06em] bg-transparent cursor-pointer transition-colors'
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-5"
      onClick={e => e.target === e.currentTarget && onCancelar()}
    >
      <div className="bg-[var(--bg2)] border border-[var(--edge-hi)] rounded-sm w-full max-w-[380px] flex flex-col">
        <div className="px-[18px] py-3.5 border-b border-[var(--edge)] text-[11px] tracking-[0.12em] uppercase text-[var(--ink-mid)]">
          ⚠ eliminar insumo
        </div>
        <div className="px-[18px] py-5 flex flex-col gap-2 text-[13px]">
          <p>¿Eliminar <strong className="text-[var(--ink-hi)]">{nombre}</strong>?</p>
          <p className="text-[var(--ink-dim)]">Esta acción no se puede deshacer.</p>
        </div>
        <div className="flex justify-end gap-2 px-[18px] py-3.5 border-t border-[var(--edge)]">
          <button onClick={onCancelar} className={`${btnBase} border-[var(--edge)] text-[var(--ink-mid)] hover:border-[var(--edge-hi)] hover:text-[var(--ink)]`}>cancelar</button>
          <button onClick={onConfirmar} className={`${btnBase} border-[var(--danger)] text-[#e06060] hover:bg-[var(--danger-hi)] hover:text-white hover:border-[var(--danger-hi)]`}>eliminar</button>
        </div>
      </div>
    </div>
  )
}
