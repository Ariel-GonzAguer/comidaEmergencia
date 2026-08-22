/**
 * @file CLI interactiva de Comida Emergencia Mini.
 * Permite consultar, crear, editar, eliminar y exportar el inventario
 * leyendo y escribiendo `db.json` directamente, sin levantar el servidor.
 * @module cli/index
 */

import { pathToFileURL } from 'node:url';
import {
  actualizarInsumo,
  agregarCategoria,
  agregarSimbolo,
  crearInsumo,
  eliminarCategoria,
  eliminarInsumo,
  eliminarSimbolo,
  escribirMD,
  filtrarInsumos,
  leerDB,
  normalizarFecha,
  validarCalorias,
  validarFecha,
  validarProteina,
} from './store.js';
import {
  colorEstado,
  estadoVencimiento,
  formatearFecha,
  lineaInsumo,
  negrita,
  tabla,
  cyan,
  gris,
} from './format.js';
import {
  confirmar,
  error,
  exito,
  limpiarPantalla,
  multiselect,
  pausa,
  prompt,
  select,
} from './ui.js';

/**
 * Muestra el encabezado de la aplicación.
 */
function encabezado() {
  console.log('');
  console.log(negrita(cyan('  ═════════════════════════════════════════')));
  console.log(negrita(cyan('   COMIDA EMERGENCIA MINI · CLI interactiva')));
  console.log(negrita(cyan('  ═════════════════════════════════════════')));
  console.log('');
}

/**
 * Muestra la lista de insumos filtrada y permite seleccionar uno.
 * Si `seleccionable` es true devuelve el insumo elegido o `null`.
 *
 * @async
 * @param {Object} db - Base de datos.
 * @param {boolean} [seleccionable=true] - Si permite elegir un insumo.
 * @param {string} [titulo] - Título del menú de selección.
 * @returns {Promise<Object|null>} Insumo elegido o `null`.
 */
async function listarInsumos(db, seleccionable = true, titulo = 'Seleccionar insumo') {
  const categorias = [
    { value: 'todas', label: 'Todas las categorías' },
    ...db.categorias.map(c => ({ value: c, label: c })),
  ];
  const categoria = await select('Filtrar por categoría', categorias, { cancelable: false });
  const texto = await prompt('Buscar por texto (Enter para todas)', { inicial: '' });

  const insumos = filtrarInsumos(db.insumos, { categoria: categoria ?? 'todas', texto });

  if (insumos.length === 0) {
    console.log(gris('  (sin resultados)'));
    await pausa();
    return null;
  }

  console.log('');
  const filas = insumos.map((i, n) => {
    const { clave, etiqueta } = estadoVencimiento(i.vencimiento);
    return [
      String(n + 1),
      i.nombre,
      i.cantidad ? `${i.cantidad} ${i.unidad}`.trim() : '—',
      i.categoria,
      colorEstado(clave)(etiqueta),
      i.simbolos?.join(', ') || '—',
    ];
  });
  console.log(tabla(['#', 'Nombre', 'Cantidad', 'Categoría', 'Vencimiento', 'Símbolos'], filas));
  console.log('');

  if (!seleccionable) {
    await pausa();
    return null;
  }

  const opciones = insumos.map((i, n) => ({
    value: i,
    label: lineaInsumo(i),
    _num: n,
  }));
  const elegido = await select(titulo, opciones);
  if (elegido) console.log('');
  return elegido;
}

/**
 * Muestra el detalle completo de un insumo.
 *
 * @param {Object} insumo - Insumo a mostrar.
 * @param {Object[]} simbolosDef - Definiciones de símbolos.
 */
function verDetalle(insumo, simbolosDef) {
  const { clave, etiqueta } = estadoVencimiento(insumo.vencimiento);
  const mapaSimbolos = Object.fromEntries(simbolosDef.map(s => [s.codigo, s.descripcion]));

  console.log(negrita(insumo.nombre));
  console.log(`  Categoría:     ${insumo.categoria}`);
  console.log(`  Cantidad:      ${`${insumo.cantidad || '—'} ${insumo.unidad || ''}`.trim()}`);
  console.log(`  Vencimiento:   ${colorEstado(clave)(etiqueta)}`);
  console.log(`  Calorías:      ${insumo.calorias ?? '—'} kcal`);
  console.log(`  Proteína:      ${insumo.proteina ?? '—'} g`);
  console.log(`  Símbolos:      ${insumo.simbolos?.length ? insumo.simbolos.map(s => `${s} (${mapaSimbolos[s] ?? '?'})`).join(', ') : '—'}`);
  console.log(`  Notas:         ${insumo.notas || '—'}`);
  console.log(`  Creado:        ${formatearFecha(insumo.creadoEn)}`);
  console.log(`  Actualizado:   ${formatearFecha(insumo.actualizadoEn)}`);
  console.log(`  ID:            ${gris(insumo.id)}`);
  console.log('');
}

/**
 * Pide los datos de un insumo (crear o editar) mediante prompts.
 * En edición, pre-carga los valores actuales.
 *
 * @async
 * @param {Object} db - Base de datos (para categorías y símbolos).
 * @param {Object|null} existente - Insumo actual si se edita, `null` si se crea.
 * @returns {Promise<Object|null>} Datos del formulario o `null` si cancela.
 */
async function formularioInsumo(db, existente = null) {
  const inicial = (campo, def = '') => (existente ? String(existente[campo] ?? def) : def);

  const nombre = await prompt('Nombre', {
    inicial: inicial('nombre'),
    validar: v => (v.trim() ? null : 'El nombre es obligatorio'),
  });
  if (!nombre.trim()) return null;

  const cantidad = await prompt('Cantidad', { inicial: inicial('cantidad') });
  const unidad = await prompt('Unidad', { inicial: inicial('unidad') });

  const categorias = db.categorias.map(c => ({ value: c, label: c }));
  const categoria = await select('Categoría', categorias, {
    cancelable: true,
  });
  if (categoria === null) return null;

  const vencimiento = await prompt('Vencimiento (M/AAAA, "no vence" o vacío)', {
    inicial: inicial('vencimiento'),
    validar: v => {
      const r = validarFecha(v);
      return r.valido ? null : r.error;
    },
  });

  const calorias = await prompt('Calorías (kcal/porción, vacío = no aplica)', {
    inicial: inicial('calorias', ''),
    validar: v => {
      const r = validarCalorias(v);
      return r.valido ? null : r.error;
    },
  });

  const proteina = await prompt('Proteína (g/porción, vacío = no aplica)', {
    inicial: inicial('proteina', ''),
    validar: v => {
      const r = validarProteina(v);
      return r.valido ? null : r.error;
    },
  });

  const notas = await prompt('Notas', { inicial: inicial('notas') });

  const opcionesSimbolos = db.simbolos.map(s => ({ value: s.codigo, label: `${s.codigo} — ${s.descripcion}` }));
  const simbolos = await multiselect('Símbolos (espacio para alternar)', opcionesSimbolos, existente?.simbolos ?? []);

  return {
    nombre: nombre.trim(),
    cantidad,
    unidad,
    categoria,
    vencimiento: normalizarFecha(vencimiento),
    calorias: calorias === '' ? null : Number(calorias),
    proteina: proteina === '' ? null : Number(proteina),
    notas,
    simbolos,
  };
}

/**
 * Menú de gestión de categorías.
 *
 * @async
 * @param {Object} db - Base de datos.
 */
async function menuCategorias(db) {
  for (;;) {
    const opcion = await select('Categorías', [
      { value: 'listar', label: 'Listar categorías' },
      { value: 'agregar', label: 'Agregar categoría' },
      { value: 'eliminar', label: 'Eliminar categoría' },
      { value: 'volver', label: 'Volver al menú principal' },
    ]);
    if (opcion === 'volver' || opcion === null) return;

    if (opcion === 'listar') {
      console.log('');
      const filas = db.categorias.map(c => [c, db.insumos.filter(i => i.categoria === c).length]);
      console.log(tabla(['Categoría', 'Insumos'], filas));
      console.log('');
      await pausa();
    } else if (opcion === 'agregar') {
      const nombre = await prompt('Nombre de la nueva categoría');
      if (!nombre.trim()) continue;
      const ok = await agregarCategoria(db, nombre);
      ok ? exito(`Categoría "${nombre.trim()}" agregada`) : error('La categoría ya existe');
      await pausa();
    } else if (opcion === 'eliminar') {
      const opciones = db.categorias.map(c => ({ value: c, label: c }));
      const elegida = await select('Categoría a eliminar', opciones);
      if (elegida === null) continue;
      const enUso = db.insumos.filter(i => i.categoria === elegida).length;
      if (enUso > 0) {
        error(`La categoría está en uso por ${enUso} insumo(s)`);
        await pausa();
        continue;
      }
      const ok = await confirmar(`¿Eliminar categoría "${elegida}"?`, false);
      if (!ok) continue;
      await eliminarCategoria(db, elegida) ? exito('Categoría eliminada') : error('No existe');
      await pausa();
    }
  }
}

/**
 * Menú de gestión de símbolos.
 *
 * @async
 * @param {Object} db - Base de datos.
 */
async function menuSimbolos(db) {
  for (;;) {
    const opcion = await select('Símbolos', [
      { value: 'listar', label: 'Listar símbolos' },
      { value: 'agregar', label: 'Agregar símbolo' },
      { value: 'eliminar', label: 'Eliminar símbolo' },
      { value: 'volver', label: 'Volver al menú principal' },
    ]);
    if (opcion === 'volver' || opcion === null) return;

    if (opcion === 'listar') {
      console.log('');
      const filas = db.simbolos.map(s => [s.codigo, s.descripcion, db.insumos.filter(i => i.simbolos?.includes(s.codigo)).length]);
      console.log(tabla(['Código', 'Descripción', 'Insumos'], filas));
      console.log('');
      await pausa();
    } else if (opcion === 'agregar') {
      const codigo = await prompt('Código (ej: AB)');
      if (!codigo.trim()) continue;
      const descripcion = await prompt('Descripción');
      if (!descripcion.trim()) continue;
      const ok = await agregarSimbolo(db, codigo, descripcion);
      ok ? exito(`Símbolo "${codigo.trim()}" agregado`) : error('El código ya existe');
      await pausa();
    } else if (opcion === 'eliminar') {
      const opciones = db.simbolos.map(s => ({ value: s.codigo, label: `${s.codigo} — ${s.descripcion}` }));
      const elegido = await select('Símbolo a eliminar', opciones);
      if (elegido === null) continue;
      const enUso = db.insumos.filter(i => i.simbolos?.includes(elegido)).length;
      if (enUso > 0) {
        error(`El símbolo está en uso por ${enUso} insumo(s)`);
        await pausa();
        continue;
      }
      const ok = await confirmar(`¿Eliminar símbolo "${elegido}"?`, false);
      if (!ok) continue;
      await eliminarSimbolo(db, elegido) ? exito('Símbolo eliminado') : error('No existe');
      await pausa();
    }
  }
}

/**
 * Muestra estadísticas del inventario.
 *
 * @param {Object} db - Base de datos.
 */
function mostrarEstadisticas(db) {
  const hoy = new Date();
  const porCategoria = Object.fromEntries(
    db.categorias.map(c => [c, db.insumos.filter(i => i.categoria === c).length])
  );
  const estados = ['vencido', 'pronto', 'este-anio', 'ok', 'no-vence', 'sin-fecha'];
  const porEstado = estados.map(e => [
    e,
    db.insumos.filter(i => estadoVencimiento(i.vencimiento, hoy).clave === e).length,
  ]);

  console.log('');
  console.log(negrita(`Total de insumos: ${db.insumos.length}`));
  console.log('');
  console.log(negrita('Por categoría:'));
  console.log(tabla(['Categoría', 'Cantidad'], Object.entries(porCategoria)));
  console.log('');
  console.log(negrita('Por estado de vencimiento:'));
  console.log(tabla(['Estado', 'Cantidad'], porEstado));
  console.log('');

  const vencidos = db.insumos.filter(i => estadoVencimiento(i.vencimiento, hoy).clave === 'vencido');
  if (vencidos.length) {
    console.log(negrita('Vencidos:'));
    vencidos.forEach(i => console.log(`  ${lineaInsumo(i)}`));
    console.log('');
  }
}

/**
 * Bucle principal de la aplicación.
 *
 * @async
 */
export async function main() {
  for (;;) {
    limpiarPantalla();
    encabezado();

    let db;
    try {
      db = await leerDB();
    } catch (err) {
      error(err.message);
      process.exit(1);
    }

    console.log(gris(`  ${db.insumos.length} insumos · ${db.categorias.length} categorías · ${db.simbolos.length} símbolos`));
    console.log('');

    const opcion = await select('Menú principal', [
      { value: 'listar', label: 'Listar insumos' },
      { value: 'detalle', label: 'Ver detalle de un insumo' },
      { value: 'crear', label: 'Crear insumo' },
      { value: 'editar', label: 'Editar insumo' },
      { value: 'eliminar', label: 'Eliminar insumo' },
      { value: 'categorias', label: 'Gestionar categorías' },
      { value: 'simbolos', label: 'Gestionar símbolos' },
      { value: 'stats', label: 'Estadísticas' },
      { value: 'exportar', label: 'Exportar a markdown' },
      { value: 'salir', label: 'Salir' },
    ]);

    if (opcion === 'salir' || opcion === null) {
      console.log(gris('\n  ¡Hasta luego!'));
      process.exit(0);
    }

    if (opcion === 'listar') {
      await listarInsumos(db, false, '');
    } else if (opcion === 'detalle') {
      const elegido = await listarInsumos(db, true, 'Insumo a consultar');
      if (elegido) {
        verDetalle(elegido, db.simbolos);
        await pausa();
      }
    } else if (opcion === 'crear') {
      const datos = await formularioInsumo(db, null);
      if (datos) {
        const nuevo = await crearInsumo(db, datos);
        exito(`Insumo "${nuevo.nombre}" creado`);
        await pausa();
      }
    } else if (opcion === 'editar') {
      const elegido = await listarInsumos(db, true, 'Insumo a editar');
      if (elegido) {
        const datos = await formularioInsumo(db, elegido);
        if (datos) {
          const actualizado = await actualizarInsumo(db, elegido.id, datos);
          exito(`Insumo "${actualizado.nombre}" actualizado`);
          await pausa();
        }
      }
    } else if (opcion === 'eliminar') {
      const elegido = await listarInsumos(db, true, 'Insumo a eliminar');
      if (elegido) {
        const ok = await confirmar(`¿Eliminar "${elegido.nombre}"?`, false);
        if (ok) {
          await eliminarInsumo(db, elegido.id);
          exito('Insumo eliminado');
        }
        await pausa();
      }
    } else if (opcion === 'categorias') {
      await menuCategorias(db);
    } else if (opcion === 'simbolos') {
      await menuSimbolos(db);
    } else if (opcion === 'stats') {
      mostrarEstadisticas(db);
      await pausa();
    } else if (opcion === 'exportar') {
      await escribirMD(db);
      exito('insumos-emergencia.md regenerado');
      await pausa();
    }
  }
}

// Solo arranca la CLI si se ejecuta directamente (no en tests)
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}