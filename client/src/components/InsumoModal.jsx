/**
 * @file Modal/formulario para crear o editar un insumo.
 * @module components/InsumoModal
 */

import { useState, useEffect, useId, useRef, useCallback } from 'react';

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
};

/**
 * Normaliza la fecha ingresada al formato de almacenamiento "MM-AAAA".
 * Acepta separadores "-" o "/" y mes con 1 o 2 dígitos.
 * Ejemplos: "4/2027" → "04-2027", "04-2027" → "04-2027".
 * Valores como "no vence" o vacío se devuelven sin cambios.
 *
 * @param {string} fechaIngresada - Fecha libre del usuario.
 * @returns {string} Fecha en formato "MM-AAAA" o el valor original.
 */
function toStorageDate(fechaIngresada) {
  if (!fechaIngresada) return fechaIngresada;
  const trim = fechaIngresada.trim();
  if (!trim || trim === 'no vence') return trim;
  const m = trim.match(/^(\d{1,2})[\/-](\d{4})$/);
  if (m) return m[1].padStart(2, '0') + '-' + m[2];
  return trim;
}

/** @constant {string} Clases Tailwind reutilizables para inputs del formulario */
const INPUT =
  'font-mono text-base bg-bg3 border border-edge text-ink px-2.5 py-3 rounded-sm outline-none transition-colors focus:border-accent-d focus-visible:ring-1 focus-visible:ring-accent placeholder:text-ink-dim w-full';
/** @constant {string} Clases Tailwind reutilizables para labels del formulario */
const LABEL = 'text-base tracking-widest uppercase text-ink-mid';

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
export default function InsumoModal({
  modo,
  insumoInicial,
  categorias,
  simbolosDef,
  onGuardar,
  onCerrar,
}) {
  const [form, setForm] = useState(VACIO);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const titleId = useId();
  const errId = useId();
  const closeBtnRef = useRef(null);
  const dialogRef = useRef(null);

  // Mover foco al primer campo al abrir (WCAG 2.4.3)
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  // Focus trap: mantener foco dentro del diálogo (WCAG 2.4.3)
  const handleKeyDown = useCallback(e => {
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const focusable = dialogRef.current.querySelectorAll(
      'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (modo === 'editar' && insumoInicial) {
      setForm({
        nombre: insumoInicial.nombre ?? '',
        cantidad: insumoInicial.cantidad ?? '',
        unidad: insumoInicial.unidad ?? '',
        categoria: insumoInicial.categoria ?? 'alimentos',
        vencimiento: insumoInicial.vencimiento ?? '',
        calorias: insumoInicial.calorias != null ? String(insumoInicial.calorias) : '',
        proteina: insumoInicial.proteina != null ? String(insumoInicial.proteina) : '',
        notas: insumoInicial.notas ?? '',
        simbolos: insumoInicial.simbolos ?? [],
      });
    } else {
      setForm(VACIO);
    }
  }, [modo, insumoInicial]);

  /**
   * Actualiza un campo individual del formulario.
   *
   * @param {string} campo - Nombre del campo a actualizar.
   * @param {*}      valor - Nuevo valor.
   */
  function set(campo, valor) {
    setForm(formulario => ({ ...formulario, [campo]: valor }));
  }

  /**
   * Alterna la selección de un símbolo en el formulario.
   *
   * @param {string} codigo - Código del símbolo a activar/desactivar.
   */
  function toggleSimbolo(codigo) {
    setForm(formulario => ({
      ...formulario,
      simbolos: formulario.simbolos.includes(codigo)
        ? formulario.simbolos.filter(simbolo => simbolo !== codigo)
        : [...formulario.simbolos, codigo],
    }));
  }

  /**
   * Handler del formulario. Valida el nombre, convierte campos numéricos
   * y delega en `onGuardar`.
   *
   * @async
   * @param {Event} e - Evento submit del formulario.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    if (!form.nombre.trim()) {
      setErr('El nombre es obligatorio');
      return;
    }
    setSaving(true);
    try {
      await onGuardar({
        ...form,
        vencimiento: toStorageDate(form.vencimiento),
        calorias: form.calorias !== '' ? Number(form.calorias) : null,
        proteina: form.proteina !== '' ? Number(form.proteina) : null,
      });
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  // Cerrar con Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onCerrar();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCerrar]);

  const btnBase =
    'font-mono text-lg nowrap outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-bg';

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-100 p-5"
      onClick={e => e.target === e.currentTarget && onCerrar()}
    >
      {/* Dialog: role + aria-modal + aria-labelledby (WCAG 4.1.2 / 2.4.3) */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-bg2 border border-edge-hi rounded-sm w-full max-w-140 max-h-[95dvh] overflow-y-auto flex flex-col"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between px-4.5 py-3.5 border-b border-edge">
          <h2
            id={titleId}
            className="text-base tracking-[0.12em] uppercase text-ink-mid m-0 font-normal"
          >
            {modo === 'crear' ? (
              <>
                <span aria-hidden="true">+ </span>nuevo insumo
              </>
            ) : (
              <>
                <span aria-hidden="true">✎ </span>editar insumo
              </>
            )}
          </h2>
          {/* Botón cerrar: ref para foco inicial + aria-label para SR (WCAG 2.4.6 / 4.1.2) */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar diálogo"
            className="text-ink-dim hover:text-accent text-base min-w-8 min-h-8 flex items-center justify-center bg-transparent border-none cursor-pointer transition-colors rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-bg"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {/* noValidate: validación accesible manual (WCAG 3.3.1) */}
        <form className="p-4.5 flex flex-col gap-3.5" onSubmit={handleSubmit} noValidate>
          {/* Nombre — campo requerido (WCAG 1.3.1 / 3.3.2) */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="f-nombre" className={LABEL}>
              Nombre
              <span aria-hidden="true" className="ml-1 text-orange-400" title="Requerido">
                *
              </span>
              <span className="sr-only">(requerido)</span>
            </label>
            <input
              id="f-nombre"
              className={INPUT}
              value={form.nombre}
              onChange={e => set('nombre', e.target.value)}
              placeholder="Ej: Arroz blanco"
              aria-required="true"
              aria-invalid={err ? 'true' : undefined}
              aria-errormessage={err ? errId : undefined}
            />
          </div>

          {/* Cantidad + Unidad */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="f-cantidad" className={LABEL}>
                Cantidad
              </label>
              <input
                id="f-cantidad"
                className={INPUT}
                value={form.cantidad}
                onChange={e => set('cantidad', e.target.value)}
                placeholder="Ej: 2x 500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="f-unidad" className={LABEL}>
                Unidad
              </label>
              <input
                id="f-unidad"
                className={INPUT}
                value={form.unidad}
                onChange={e => set('unidad', e.target.value)}
                placeholder="g / ml / kg"
              />
            </div>
          </div>

          {/* Categoría + Vencimiento */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="categoria" className={LABEL}>
                Categoría
              </label>
              <div className="relative">
                <select
                  id="categoria"
                  className={`${INPUT} cursor-pointer appearance-none pr-8`}
                  value={form.categoria}
                  onChange={e => set('categoria', e.target.value)}
                >
                  {categorias.map(c => (
                    <option key={c} value={c} className="bg-bg3 cursor-pointer">
                      {c}
                    </option>
                  ))}
                </select>
                <span
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink-dim"
                  aria-hidden="true"
                >
                  ▼
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fecha-vencimiento" className={LABEL}>
                Vencimiento
              </label>
              <input
                id="fecha-vencimiento"
                className={INPUT}
                value={form.vencimiento}
                onChange={e => set('vencimiento', e.target.value)}
                placeholder="4/2027, 04-2027 o 'no vence'"
              />
            </div>
          </div>

          {/* Calorías + Proteína */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="calorias" className={LABEL}>
                Calorías (kcal/porción)
              </label>
              <input
                id="calorias"
                className={INPUT}
                type="number"
                min="0"
                value={form.calorias}
                onChange={e => set('calorias', e.target.value)}
                placeholder="—"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="proteina" className={LABEL}>
                Proteína (g/porción)
              </label>
              <input
                id="proteina"
                className={INPUT}
                type="number"
                min="0"
                step="0.1"
                value={form.proteina}
                onChange={e => set('proteina', e.target.value)}
                placeholder="—"
              />
            </div>
          </div>

          {/* Notas */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="notas" className={LABEL}>
              Notas
            </label>
            <input
              id="notas"
              className={INPUT}
              value={form.notas}
              onChange={e => set('notas', e.target.value)}
              placeholder="Observaciones..."
            />
          </div>

          {/* Símbolos — fieldset semántico (WCAG 1.3.1) + aria-pressed (WCAG 4.1.2) */}
          <fieldset>
            <div className="flex items-center gap-1 mb-1.5">
              <legend className={LABEL}>Símbolo</legend>
              <div className="flex flex-wrap gap-1.5">
                {simbolosDef.map(simbolo => (
                  <button
                    key={simbolo.codigo}
                    type="button"
                    onClick={() => toggleSimbolo(simbolo.codigo)}
                    aria-pressed={form.simbolos.includes(simbolo.codigo)}
                    aria-label={simbolo.descripcion}
                    className={`font-mono text-base font-semibold px-2.5 py-1 rounded-sm border cursor-pointer tracking-[0.05em] transition-all outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-bg ${
                      form.simbolos.includes(simbolo.codigo)
                        ? 'border-accent-d text-accent bg-[#1e1800] hover:bg-orange-500/60 hover:text-ink'
                        : 'border-edge bg-bg3 text-ink-dim hover:bg-ink hover:text-edge'
                    }`}
                  >
                    <span aria-hidden="true">{simbolo.codigo}</span>
                  </button>
                ))}
              </div>
            </div>
          </fieldset>

          {/* Error — role=alert para anuncio inmediato (WCAG 4.1.3) */}
          {err && (
            <p
              id={errId}
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              className="text-base text-[#e06060] px-2.5 py-1.5 border border-[#5c1f1f] rounded-sm"
            >
              {err}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1 border-t border-edge mt-auto">
            <button
              type="button"
              onClick={onCerrar}
              className={`${btnBase} p-1 border-2 border-edge-hi text-ink hover:bg-red-600/30 cursor-pointer`}
            >
              cancelar
            </button>
            {/* aria-busy + aria-disabled comunican estado de carga (WCAG 4.1.2) */}
            <button
              type="submit"
              disabled={saving}
              aria-busy={saving}
              aria-disabled={saving}
              aria-label={
                saving
                  ? 'Guardando, por favor espere'
                  : modo === 'crear'
                    ? 'Crear insumo'
                    : 'Guardar cambios'
              }
              className={`${btnBase} p-1 border-2 border-accent-d text-accent hover:bg-accent hover:text-bg hover:border-accent disabled:opacity-50 cursor-pointer`}
            >
              {saving ? '...' : modo === 'crear' ? 'crear' : 'guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
