/**
 * @file Capa de datos para la CLI interactiva.
 * Lee y escribe `db.json` directamente (sin levantar el servidor) y
 * regenera `insumos-emergencia.md` tras cada modificación.
 * @module cli/store
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @constant {string} Ruta absoluta al archivo de base de datos JSON */
const DB_PATH = path.join(__dirname, '..', 'db.json');

/** @constant {string} Ruta absoluta al markdown de inventario */
const MD_PATH = path.join(__dirname, '..', 'insumos-emergencia.md');

/** @constant {string[]} Campos editables de un insumo (espejo del servidor) */
const CAMPOS_INSUMO = [
  'nombre',
  'cantidad',
  'unidad',
  'categoria',
  'vencimiento',
  'calorias',
  'proteina',
  'notas',
  'simbolos',
];

/**
 * Lee y parsea `db.json`.
 *
 * @async
 * @returns {Promise<{ insumos: Object[], categorias: string[], simbolos: Object[] }>}
 * @throws {Error} Si el archivo no existe o el JSON está malformado.
 */
export async function leerDB() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') throw new Error('archivo db.json no encontrado');
    throw new Error(`Error al leer db.json: ${err.message}`);
  }
}

/**
 * Serializa y escribe `db.json` de forma atómica (temp + rename).
 *
 * @async
 * @param {Object} data - Base de datos completa a persistir.
 * @throws {Error} Si hay error durante la escritura.
 */
export async function escribirDB(data) {
  try {
    const tempPath = DB_PATH + '.tmp';
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    await fs.rename(tempPath, DB_PATH);
  } catch (err) {
    throw new Error(`Error al escribir db.json: ${err.message}`);
  }
}

/**
 * Regenera `insumos-emergencia.md` a partir de la lista de insumos y símbolos.
 * No interrumpe la operación principal si falla la escritura del MD.
 *
 * @async
 * @param {Object} db - Base de datos completa (usa `insumos` y `simbolos`).
 */
export async function escribirMD(db) {
  try {
    const { insumos, simbolos } = db;
    const formatoVencimiento = v => {
      if (!v) return '--';
      if (v === 'no vence') return 'no vence';
      const [m, y] = v.split('-');
      return m && y ? `${Number(m)}/${y}` : v;
    };
    const formatoNumero = n => (n != null ? String(n) : '--');
    const formatoCantidad = item => {
      const partes = [item.cantidad, item.unidad].filter(Boolean);
      return partes.length ? partes.join(' ') : '--';
    };
    const formatoNombre = item => {
      const sims = item.simbolos?.length ? ' ' + item.simbolos.map(s => `\`${s}\``).join(' ') : '';
      return item.nombre + sims;
    };

    const alimentos = insumos.filter(i => i.categoria !== 'higiene');
    const noAlimentos = insumos.filter(i => i.categoria === 'higiene');

    const filaAlimento = i =>
      `| ${formatoNombre(i)} | ${i.categoria} | ${formatoCantidad(i)} | ${formatoVencimiento(
        i.vencimiento
      )} | ${formatoNumero(i.calorias)} | ${formatoNumero(i.proteina)} | ${i.notas || '--'} |`;

    const filasReferencia = simbolos.map(s => `| \`${s.codigo}\` | ${s.descripcion} |`).join('\n');

    const tablaRef = `## Referencias

| Símbolo | Significado |
| ------- | ----------- |
${filasReferencia}`;

    const tablaAlim = `## Alimentos

| Producto | Categoría | Cantidad / Presentación | Vencimiento | Calorías (kcal) por porción | Proteína (g) por porción | Notas |
| -------- | --------- | ----------------------- | ----------- | --------------------------- | ------------------------ | ----- |
${alimentos.map(filaAlimento).join('\n')}`;

    const tablaHig = noAlimentos.length
      ? `## Productos no alimenticios

| Producto | Categoría | Cantidad |
| -------- | --------- | -------- |
${noAlimentos.map(i => `| ${i.nombre} | ${i.categoria} | ${formatoCantidad(i)} |`).join('\n')}\n`
      : '';

    const md = `# Inventario General de Alimentos y Productos\n\n${tablaRef}\n\n---\n\n${tablaAlim}\n\n---\n\n${tablaHig}`;
    await fs.writeFile(MD_PATH, md, 'utf-8');
  } catch (err) {
    console.error(`Advertencia: No se pudo actualizar ${MD_PATH}: ${err.message}`);
  }
}

/**
 * Persiste la base de datos: escribe `db.json` y regenera el markdown.
 *
 * @async
 * @param {Object} data - Base de datos completa.
 */
export async function guardar(data) {
  await escribirDB(data);
  await escribirMD(data);
}

/**
 * Valida una fecha de vencimiento en formato libre.
 * Acepta: "MM-AAAA", "M-AAAA", "MM/AAAA", "M/AAAA", "no vence" o vacío.
 *
 * @param {string} valor - Fecha ingresada por el usuario.
 * @returns {{ valido: boolean, error?: string }}
 *
 * @example
 * validarFecha('4/2027')  // { valido: true }
 * validarFecha('13-2027') // { valido: false, error: '...' }
 */
export function validarFecha(valor) {
  if (!valor || !valor.trim()) return { valido: true };
  const trim = valor.trim();
  if (trim === 'no vence') return { valido: true };

  const m = trim.match(/^(\d{1,2})[\/-](\d{4})$/);
  if (!m) {
    return {
      valido: false,
      error: 'Formato de fecha inválido. Use: M/AAAA o MM-AAAA (ej: 4/2027)',
    };
  }
  const mes = Number(m[1]);
  const anio = Number(m[2]);
  if (mes < 1 || mes > 12) return { valido: false, error: 'El mes debe estar entre 1 y 12' };
  if (anio < 2000 || anio > 2100)
    return { valido: false, error: 'El año debe estar entre 2000 y 2100' };
  return { valido: true };
}

/**
 * Normaliza una fecha libre al formato de almacenamiento "MM-AAAA".
 * Acepta separadores "-" o "/" y mes con 1 o 2 dígitos.
 *
 * @param {string} valor - Fecha ingresada por el usuario.
 * @returns {string} Fecha en formato "MM-AAAA" o el valor original.
 *
 * @example
 * normalizarFecha('4/2027')   // "04-2027"
 * normalizarFecha('no vence') // "no vence"
 */
export function normalizarFecha(valor) {
  if (!valor) return valor;
  const trim = valor.trim();
  if (!trim || trim === 'no vence') return trim;
  const m = trim.match(/^(\d{1,2})[\/-](\d{4})$/);
  if (m) return m[1].padStart(2, '0') + '-' + m[2];
  return trim;
}

/**
 * Valida calorías (entero positivo, vacío permitido).
 *
 * @param {string} valor - Valor ingresado.
 * @returns {{ valido: boolean, error?: string }}
 */
export function validarCalorias(valor) {
  if (!valor || !valor.trim()) return { valido: true };
  const num = Number(valor);
  if (Number.isNaN(num) || num < 0)
    return { valido: false, error: 'Calorías debe ser un número positivo' };
  if (!Number.isInteger(num)) return { valido: false, error: 'Calorías debe ser un número entero' };
  return { valido: true };
}

/**
 * Valida proteína (número positivo, vacío permitido).
 *
 * @param {string} valor - Valor ingresado.
 * @returns {{ valido: boolean, error?: string }}
 */
export function validarProteina(valor) {
  if (!valor || !valor.trim()) return { valido: true };
  const num = Number(valor);
  if (Number.isNaN(num) || num < 0)
    return { valido: false, error: 'Proteína debe ser un número positivo' };
  if (num > 200) return { valido: false, error: 'Proteína parece demasiado alta (máx: 200g)' };
  return { valido: true };
}

/**
 * Filtra insumos por categoría y/o texto (espejo de la API REST).
 *
 * @param {Object[]} insumos - Lista completa de insumos.
 * @param {{ categoria?: string, texto?: string }} [filtros] - Criterios.
 * @returns {Object[]} Insumos que coinciden con los filtros.
 */
export function filtrarInsumos(insumos, { categoria, texto } = {}) {
  let items = insumos;
  if (categoria && categoria !== 'todas') {
    items = items.filter(i => i.categoria === categoria);
  }
  if (texto) {
    const q = texto.toLowerCase();
    items = items.filter(i => {
      const coincideNombre = (i.nombre || '').toLowerCase().includes(q);
      const coincideNotas = (i.notas || '').toLowerCase().includes(q);
      const coincideSimbolo = (i.simbolos || []).some(s => s.toLowerCase().includes(q));
      return coincideNombre || coincideNotas || coincideSimbolo;
    });
  }
  return items;
}

/**
 * Crea un insumo nuevo, lo agrega a la base y persiste.
 *
 * @async
 * @param {Object} db - Base de datos (se muta en memoria).
 * @param {Object} datos - Campos del insumo (sin `id` ni timestamps).
 * @returns {Promise<Object>} El insumo creado.
 * @throws {Error} Si falta el nombre.
 */
export async function crearInsumo(db, datos) {
  if (!datos.nombre || !String(datos.nombre).trim()) {
    throw new Error('El campo "nombre" es obligatorio');
  }
  const nuevo = {
    id: randomUUID(),
    nombre: String(datos.nombre).trim(),
    cantidad: datos.cantidad ?? '',
    unidad: datos.unidad ?? '',
    categoria: datos.categoria ?? 'alimentos',
    vencimiento: datos.vencimiento ?? '',
    calorias: datos.calorias ?? null,
    proteina: datos.proteina ?? null,
    notas: datos.notas ?? '',
    simbolos: Array.isArray(datos.simbolos) ? datos.simbolos : [],
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  };
  db.insumos.push(nuevo);
  await guardar(db);
  return nuevo;
}

/**
 * Actualiza parcialmente un insumo y persiste.
 *
 * @async
 * @param {Object} db - Base de datos (se muta en memoria).
 * @param {string} id - UUID del insumo.
 * @param {Object} cambios - Subconjunto de campos a modificar.
 * @returns {Promise<Object|null>} El insumo actualizado o `null` si no existe.
 */
export async function actualizarInsumo(db, id, cambios) {
  const idx = db.insumos.findIndex(i => i.id === id);
  if (idx === -1) return null;
  const actualizado = { ...db.insumos[idx] };
  for (const campo of CAMPOS_INSUMO) {
    if (cambios[campo] !== undefined) actualizado[campo] = cambios[campo];
  }
  actualizado.actualizadoEn = new Date().toISOString();
  db.insumos[idx] = actualizado;
  await guardar(db);
  return actualizado;
}

/**
 * Elimina un insumo por UUID y persiste.
 *
 * @async
 * @param {Object} db - Base de datos (se muta en memoria).
 * @param {string} id - UUID del insumo.
 * @returns {Promise<Object|null>} El insumo eliminado o `null` si no existe.
 */
export async function eliminarInsumo(db, id) {
  const idx = db.insumos.findIndex(i => i.id === id);
  if (idx === -1) return null;
  const [eliminado] = db.insumos.splice(idx, 1);
  await guardar(db);
  return eliminado;
}

/**
 * Agrega una categoría nueva si no existe.
 *
 * @async
 * @param {Object} db - Base de datos (se muta en memoria).
 * @param {string} nombre - Nombre de la categoría.
 * @returns {Promise<boolean>} `true` si se agregó, `false` si ya existía.
 */
export async function agregarCategoria(db, nombre) {
  const limpio = nombre.trim();
  if (!limpio || db.categorias.includes(limpio)) return false;
  db.categorias.push(limpio);
  await guardar(db);
  return true;
}

/**
 * Elimina una categoría de la lista de catálogo.
 * No modifica los insumos que ya la usan.
 *
 * @async
 * @param {Object} db - Base de datos (se muta en memoria).
 * @param {string} nombre - Nombre de la categoría.
 * @returns {Promise<boolean>} `true` si se eliminó, `false` si no existía.
 */
export async function eliminarCategoria(db, nombre) {
  const idx = db.categorias.indexOf(nombre);
  if (idx === -1) return false;
  db.categorias.splice(idx, 1);
  await guardar(db);
  return true;
}

/**
 * Agrega un símbolo nuevo si el código no existe.
 *
 * @async
 * @param {Object} db - Base de datos (se muta en memoria).
 * @param {string} codigo - Código corto (ej: "V").
 * @param {string} descripcion - Significado del símbolo.
 * @returns {Promise<boolean>} `true` si se agregó, `false` si ya existía.
 */
export async function agregarSimbolo(db, codigo, descripcion) {
  const limpio = codigo.trim();
  if (!limpio || db.simbolos.some(s => s.codigo === limpio)) return false;
  db.simbolos.push({ codigo: limpio, descripcion: descripcion.trim() });
  await guardar(db);
  return true;
}

/**
 * Elimina un símbolo por su código.
 * No modifica los insumos que ya lo referencian.
 *
 * @async
 * @param {Object} db - Base de datos (se muta en memoria).
 * @param {string} codigo - Código del símbolo.
 * @returns {Promise<boolean>} `true` si se eliminó, `false` si no existía.
 */
export async function eliminarSimbolo(db, codigo) {
  const idx = db.simbolos.findIndex(s => s.codigo === codigo);
  if (idx === -1) return false;
  db.simbolos.splice(idx, 1);
  await guardar(db);
  return true;
}
