/**
 * @file Utilidades de formato para la CLI: colores ANSI, tablas y estado de vencimiento.
 * Los colores se desactivan automáticamente si la salida no es una TTY
 * o si existe la variable de entorno `NO_COLOR`.
 * @module cli/format
 */

/** @constant {boolean} Indica si los colores ANSI están habilitados */
const COLORES = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR;

/**
 * Aplica un color ANSI a un texto si los colores están habilitados.
 *
 * @param {string} texto - Texto a colorear.
 * @param {string} codigo - Código ANSI de color (ej: "31" = rojo).
 * @returns {string} Texto con códigos ANSI (o sin color si deshabilitados).
 *
 * @example
 * pintar('Error', '31') // "\x1b[31mError\x1b[0m"
 */
export function pintar(texto, codigo) {
  if (!COLORES || !codigo) return texto;
  return `\x1b[${codigo}m${texto}\x1b[0m`;
}

/**
 * Colores ANSI disponibles para los helpers de texto.
 * @constant {Object<string,string>}
 */
const CODIGOS = {
  reset: '0',
  bold: '1',
  dim: '2',
  rojo: '31',
  verde: '32',
  amarillo: '33',
  azul: '34',
  magenta: '35',
  cyan: '36',
  gris: '90',
  naranja: '33;1',
};

/**
 * Texto en rojo.
 * @param {string} texto
 * @returns {string}
 */
export const rojo = texto => pintar(texto, CODIGOS.rojo);

/**
 * Texto en verde.
 * @param {string} texto
 * @returns {string}
 */
export const verde = texto => pintar(texto, CODIGOS.verde);

/**
 * Texto en amarillo.
 * @param {string} texto
 * @returns {string}
 */
export const amarillo = texto => pintar(texto, CODIGOS.amarillo);

/**
 * Texto en cian.
 * @param {string} texto
 * @returns {string}
 */
export const cyan = texto => pintar(texto, CODIGOS.cyan);

/**
 * Texto en gris (tenue).
 * @param {string} texto
 * @returns {string}
 */
export const gris = texto => pintar(texto, CODIGOS.gris);

/**
 * Texto en naranja (amarillo intenso).
 * @param {string} texto
 * @returns {string}
 */
export const naranja = texto => pintar(texto, CODIGOS.naranja);

/**
 * Texto en negrita.
 * @param {string} texto
 * @returns {string}
 */
export const negrita = texto => pintar(texto, CODIGOS.bold);

/**
 * Calcula el estado de vencimiento de una fecha "MM-AAAA".
 * Espejo de la lógica del frontend (InsumoTable).
 *
 * @param {string} valor - Fecha "MM-AAAA", "no vence" o vacío.
 * @param {Date} [hoy=new Date()] - Fecha de referencia.
 * @returns {{ clave: string, etiqueta: string }} Estado y etiqueta legible.
 *
 * @example
 * estadoVencimiento('06-2026', new Date('2026-01-01'))
 * // { clave: 'este-anio', etiqueta: '6/2026' }
 */
export function estadoVencimiento(valor, hoy = new Date()) {
  if (!valor) return { clave: 'sin-fecha', etiqueta: '—' };
  if (valor === 'no vence') return { clave: 'no-vence', etiqueta: 'no vence' };

  const [mes, anio] = valor.split('-').map(Number);
  if (anio && mes) {
    const vence = new Date(anio, mes - 1, 1);
    const meses =
      (vence.getFullYear() - hoy.getFullYear()) * 12 + (vence.getMonth() - hoy.getMonth());
    let clave = 'ok';
    if (meses < 0) clave = 'vencido';
    else if (meses <= 3) clave = 'pronto';
    else if (meses <= 12) clave = 'este-anio';
    return { clave, etiqueta: `${mes}/${anio}` };
  }
  return { clave: 'sin-fecha', etiqueta: valor };
}

/**
 * Devuelve la función de color según la clave de estado de vencimiento.
 *
 * @param {string} clave - Clave de `estadoVencimiento`.
 * @returns {Function} Función de color (rojo/amarillo/naranja/verde/gris).
 */
export function colorEstado(clave) {
  switch (clave) {
    case 'vencido':
      return rojo;
    case 'pronto':
      return naranja;
    case 'este-anio':
      return amarillo;
    case 'no-vence':
      return cyan;
    case 'ok':
      return verde;
    default:
      return gris;
  }
}

/**
 * Formatea una fecha ISO a un formato legible en español.
 *
 * @param {string} isoString - Fecha ISO 8601.
 * @returns {string} Fecha legible o "—" si es vacía.
 */
export function formatearFecha(isoString) {
  if (!isoString) return '—';
  try {
    return new Date(isoString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

/**
 * Pinta un insumo como línea de lista con su estado de vencimiento coloreado.
 *
 * @param {Object} insumo - Insumo de la base de datos.
 * @returns {string} Línea formateada.
 *
 * @example
 * lineaInsumo({ nombre: 'Ramen', vencimiento: '06-2026', categoria: 'alimentos' })
 */
export function lineaInsumo(insumo) {
  const { clave, etiqueta } = estadoVencimiento(insumo.vencimiento);
  const venc = colorEstado(clave)(etiqueta);
  const simbolos = insumo.simbolos?.length ? ` ${insumo.simbolos.join(' ')}` : '';
  return `${negrita(insumo.nombre)}${simbolos}  · ${gris(insumo.categoria)}  · vence ${venc}`;
}

/**
 * Genera una tabla ASCII simple a partir de encabezados y filas.
 *
 * @param {string[]} encabezados - Nombres de columnas.
 * @param {Array<Array<string|number>>} filas - Datos por columna.
 * @returns {string} Tabla lista para imprimir.
 *
 * @example
 * tabla(['Nombre', 'Cant'], [['Arroz', 5], ['Sal', 1]])
 */
export function tabla(encabezados, filas) {
  const datos = [encabezados.map(negrita), ...filas.map(fila => fila.map(String))];
  const anchos = encabezados.map((_, c) => Math.max(...datos.map(fila => (fila[c] || '').length)));
  const linea = fila =>
    fila
      .map((celda, c) => (celda || '').padEnd(anchos[c]))
      .join('  ')
      .trimEnd();
  return datos.map(linea).join('\n');
}
