/**
 * @file Utilidades interactivas para la CLI: prompts de texto, confirmaciones,
 * menús de selección con flechas y multiselección de símbolos.
 * Usa únicamente `node:readline` (sin dependencias externas).
 *
 * En TTY usa modo raw con eventos de teclado (flechas, espacio, backspace).
 * En entradas no TTY (pipes, tests) lee líneas desde `stdin`.
 * @module cli/ui
 */

import readline from 'node:readline';
import { cyan, gris, negrita, rojo, verde } from './format.js';

/** @constant {boolean} Indica si la entrada es una terminal interactiva */
const ES_TTY = Boolean(process.stdin.isTTY);

// ---------- Entrada de líneas (no TTY) ----------

/** @type {string[]} Líneas leídas desde stdin en modo no TTY */
let colaLineas = [];

/** @type {boolean} Si stdin ya fue consumido por completo */
let stdinConsumido = false;

/**
 * Lee todas las líneas de stdin (una sola vez, en modo no TTY).
 * En TTY no se usa.
 *
 * @async
 * @returns {Promise<string[]>} Líneas disponibles.
 */
async function leerStdinCompleto() {
  if (stdinConsumido) return colaLineas;
  stdinConsumido = true;
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  colaLineas = Buffer.concat(chunks).toString('utf8').split(/\r?\n/);
  return colaLineas;
}

/**
 * Obtiene la siguiente línea de entrada. En modo no TTY lee de la cola de stdin.
 *
 * @async
 * @returns {Promise<string>} Línea (vacía si no hay más entrada).
 */
async function obtenerLinea() {
  if (!ES_TTY) {
    const lineas = await leerStdinCompleto();
    return lineas.length ? lineas.shift() : '';
  }
  throw new Error('obtenerLinea solo aplica a entradas no TTY');
}

// ---------- Prompts de texto ----------

/**
 * Lee una línea de texto del usuario.
 * En TTY usa modo raw con backspace; en no TTY usa la cola de stdin.
 *
 * @async
 * @param {string} texto - Pregunta a mostrar.
 * @returns {Promise<string>} Respuesta (sin salto de línea final).
 */
async function leerLinea(texto) {
  if (!ES_TTY) return obtenerLinea();

  process.stdout.write(texto);
  let buffer = '';

  return new Promise(resolve => {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    const terminar = valor => {
      process.stdin.setRawMode(false);
      process.stdin.removeListener('keypress', onKey);
      process.stdout.write('\n');
      resolve(valor);
    };

    const onKey = (str, key) => {
      if (key.name === 'return' || key.name === 'enter') {
        terminar(buffer);
      } else if (key.name === 'backspace') {
        buffer = buffer.slice(0, -1);
        process.stdout.write('\b \b');
      } else if (key.name === 'escape') {
        terminar('');
      } else if (key.ctrl && key.name === 'c') {
        process.exit(130);
      } else if (str && !key.ctrl && !key.meta) {
        buffer += str;
        process.stdout.write(str);
      }
    };

    process.stdin.on('keypress', onKey);
  });
}

/**
 * Pide al usuario un texto de una línea con valor inicial y validación opcionales.
 *
 * @async
 * @param {string} texto - Pregunta a mostrar.
 * @param {{ inicial?: string, validar?: Function }} [opciones] - Valor inicial y validador.
 * @returns {Promise<string>} Respuesta (vacía si solo se presionó Enter).
 *
 * @example
 * const nombre = await prompt('Nombre', { inicial: 'Arroz', validar: v => v.trim() || 'obligatorio' });
 */
export async function prompt(texto, { inicial = '', validar } = {}) {
  const sufijo = inicial ? ` (${gris(inicial)})` : '';
  const respuesta = await leerLinea(`${cyan(texto)}${sufijo}: `);
  const valor = respuesta.trim() === '' && inicial ? inicial : respuesta.trim();

  if (validar) {
    const error = validar(valor);
    if (error) {
      console.log(rojo(`  ✗ ${error}`));
      return prompt(texto, { inicial, validar });
    }
  }
  return valor;
}

/**
 * Pide confirmación sí/no.
 *
 * @async
 * @param {string} texto - Pregunta a mostrar.
 * @param {boolean} [porDefecto=true] - Valor por defecto.
 * @returns {Promise<boolean>}
 */
export async function confirmar(texto, porDefecto = true) {
  const sufijo = porDefecto ? ' (s/n) [s]' : ' (s/n) [n]';
  const respuesta = (await leerLinea(`${cyan(texto)}${gris(sufijo)}: `)).trim().toLowerCase();
  if (respuesta === '') return porDefecto;
  return ['s', 'si', 'sí', 'y'].includes(respuesta);
}

/**
 * Limpia la pantalla.
 */
export function limpiarPantalla() {
  process.stdout.write('\x1b[2J\x1b[H');
}

/**
 * Pausa hasta que el usuario presione Enter.
 *
 * @async
 * @param {string} [mensaje] - Texto opcional a mostrar.
 */
export async function pausa(mensaje = 'Presiona Enter para continuar...') {
  await leerLinea(gris(mensaje));
}

/**
 * Mueve el cursor hacia arriba y limpia desde esa línea hasta el final.
 *
 * @param {number} lineas - Cantidad de líneas a subir.
 */
function subirYLimpiar(lineas) {
  if (lineas > 0) {
    process.stdout.write(`\x1b[${lineas}A\x1b[J`);
  }
}

/**
 * Menu de selección con flechas (↑/↓ + Enter) y atajo numérico.
 * Si la entrada no es una TTY, cae a un menú numerado simple.
 *
 * @async
 * @param {string} titulo - Título del menú.
 * @param {Array<{ value: any, label: string }>} opciones - Opciones a elegir.
 * @param {{ cancelable?: boolean }} [opcionesExtra] - Si permite cancelar con q/Escape.
 * @returns {Promise<any|null>} Valor de la opción elegida o `null` si cancela.
 *
 * @example
 * const opcion = await select('Categoría', categorias.map(c => ({ value: c, label: c })));
 */
export async function select(titulo, opciones, { cancelable = true } = {}) {
  if (opciones.length === 0) return null;
  if (!ES_TTY) return selectNumerado(titulo, opciones, cancelable);

  let idx = 0;
  let lineasRenderizadas = 0;

  const render = () => {
    subirYLimpiar(lineasRenderizadas);
    const lineas = [negrita(cyan(titulo))];
    opciones.forEach((op, i) => {
      const marcador = i === idx ? '▶' : ' ';
      const label = i === idx ? cyan(op.label) : gris(op.label);
      lineas.push(`  ${marcador} ${label}`);
    });
    if (cancelable) lineas.push(gris('  (↑/↓ navegar · Enter elegir · q cancelar)'));
    process.stdout.write(lineas.join('\n') + '\n');
    lineasRenderizadas = lineas.length;
  };

  return new Promise(resolve => {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    const terminar = valor => {
      process.stdin.setRawMode(false);
      process.stdin.removeListener('keypress', onKey);
      subirYLimpiar(lineasRenderizadas);
      resolve(valor);
    };

    const onKey = (str, key) => {
      if (key.name === 'up') {
        idx = (idx - 1 + opciones.length) % opciones.length;
        render();
      } else if (key.name === 'down') {
        idx = (idx + 1) % opciones.length;
        render();
      } else if (key.name === 'return' || key.name === 'enter') {
        terminar(opciones[idx].value);
      } else if (cancelable && (key.name === 'escape' || key.name === 'q')) {
        terminar(null);
      } else if (str && /^[1-9]$/.test(str)) {
        const n = Number(str);
        if (n >= 1 && n <= opciones.length) terminar(opciones[n - 1].value);
      } else if (key.ctrl && key.name === 'c') {
        process.exit(130);
      }
    };

    process.stdin.on('keypress', onKey);
    render();
  });
}

/**
 * Menu numerado de respaldo cuando la entrada no es una TTY.
 *
 * @async
 * @param {string} titulo - Título del menú.
 * @param {Array<{ value: any, label: string }>} opciones - Opciones.
 * @param {boolean} cancelable - Si `0` cancela.
 * @returns {Promise<any|null>}
 */
async function selectNumerado(titulo, opciones, cancelable) {
  console.log(negrita(cyan(titulo)));
  opciones.forEach((op, i) => console.log(`  ${i + 1}) ${op.label}`));
  if (cancelable) console.log('  0) Cancelar');

  const respuesta = (await obtenerLinea()).trim();
  const n = Number(respuesta);
  if (n === 0 && cancelable) return null;
  if (n >= 1 && n <= opciones.length) return opciones[n - 1].value;
  console.log(rojo('  ✗ Opción inválida'));
  return selectNumerado(titulo, opciones, cancelable);
}

/**
 * Multi-selección de opciones con flechas y espacio para alternar.
 * Cae a un prompt de números separados por coma si no es TTY.
 *
 * @async
 * @param {string} titulo - Título del menú.
 * @param {Array<{ value: any, label: string }>} opciones - Opciones.
 * @param {Array<any>} [iniciales] - Valores marcados inicialmente.
 * @returns {Promise<any[]>} Valores seleccionados.
 *
 * @example
 * const simbolos = await multiselect('Símbolos', simbolosDef.map(s => ({ value: s.codigo, label: s.codigo })), actual.simbolos);
 */
export async function multiselect(titulo, opciones, iniciales = []) {
  if (opciones.length === 0) return [];
  if (!ES_TTY) return multiselectNumerado(titulo, opciones, iniciales);

  const seleccionados = new Set(iniciales);
  let idx = 0;
  let lineasRenderizadas = 0;

  const render = () => {
    subirYLimpiar(lineasRenderizadas);
    const lineas = [negrita(cyan(titulo))];
    opciones.forEach((op, i) => {
      const marcador = i === idx ? '▶' : ' ';
      const check = seleccionados.has(op.value) ? '[x]' : '[ ]';
      const label = i === idx ? cyan(`${check} ${op.label}`) : gris(`${check} ${op.label}`);
      lineas.push(`  ${marcador} ${label}`);
    });
    lineas.push(gris('  (↑/↓ mover · espacio alternar · Enter confirmar · q cancelar)'));
    process.stdout.write(lineas.join('\n') + '\n');
    lineasRenderizadas = lineas.length;
  };

  return new Promise(resolve => {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    const terminar = () => {
      process.stdin.setRawMode(false);
      process.stdin.removeListener('keypress', onKey);
      subirYLimpiar(lineasRenderizadas);
      resolve([...seleccionados]);
    };

    const onKey = (str, key) => {
      if (key.name === 'up') {
        idx = (idx - 1 + opciones.length) % opciones.length;
        render();
      } else if (key.name === 'down') {
        idx = (idx + 1) % opciones.length;
        render();
      } else if (key.name === 'space') {
        const valor = opciones[idx].value;
        if (seleccionados.has(valor)) seleccionados.delete(valor);
        else seleccionados.add(valor);
        render();
      } else if (key.name === 'return' || key.name === 'enter') {
        terminar();
      } else if (key.name === 'escape' || key.name === 'q') {
        process.stdin.setRawMode(false);
        process.stdin.removeListener('keypress', onKey);
        subirYLimpiar(lineasRenderizadas);
        resolve([]);
      } else if (key.ctrl && key.name === 'c') {
        process.exit(130);
      }
    };

    process.stdin.on('keypress', onKey);
    render();
  });
}

/**
 * Multi-selección numerada de respaldo para entradas no TTY.
 *
 * @async
 * @param {string} titulo - Título del menú.
 * @param {Array<{ value: any, label: string }>} opciones - Opciones.
 * @param {Array<any>} iniciales - Valores marcados inicialmente.
 * @returns {Promise<any[]>}
 */
async function multiselectNumerado(titulo, opciones, iniciales) {
  const seleccionados = new Set(iniciales);
  console.log(negrita(cyan(titulo)));
  opciones.forEach((op, i) => {
    const check = seleccionados.has(op.value) ? '[x]' : '[ ]';
    console.log(`  ${i + 1}) ${check} ${op.label}`);
  });
  console.log(gris('  (números separados por coma · Enter confirma)'));
  const respuesta = (await obtenerLinea()).trim();
  if (respuesta === '' || respuesta === '0') return [...seleccionados];
  const nums = respuesta
    .split(',')
    .map(Number)
    .filter(n => n >= 1 && n <= opciones.length);
  for (const n of nums) seleccionados.add(opciones[n - 1].value);
  if (nums.length) return [...seleccionados];
  return multiselectNumerado(titulo, opciones, iniciales);
}

/**
 * Muestra un mensaje de éxito.
 *
 * @param {string} texto
 */
export function exito(texto) {
  console.log(verde(`  ✓ ${texto}`));
}

/**
 * Muestra un mensaje de error.
 *
 * @param {string} texto
 */
export function error(texto) {
  console.log(rojo(`  ✗ ${texto}`));
}
