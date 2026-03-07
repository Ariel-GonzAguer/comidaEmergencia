export default function Toast({ msg, tipo }) {
  const isErr = tipo === 'error'
  return (
    <div
      className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 rounded-sm font-mono text-[12px] tracking-[0.06em] z-[200] border ${
        isErr
          ? 'bg-[var(--danger)] border-[var(--danger-hi)] text-[#e06060]'
          : 'bg-[var(--ok)] border-[#3a7a50] text-[#80d89a]'
      }`}
      style={{ animation: 'slideIn 0.2s ease' }}
    >
      <span>{isErr ? '✕' : '✓'}</span>
      <span>{msg}</span>
    </div>
  )
}
