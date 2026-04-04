/**
 * @file Servidor Express para la API REST del inventario de emergencia.
 * Lee y escribe directamente en `db.json` (no usa base de datos).
 * Utiliza fs.promises para operaciones asincrónicas y mejor robustez offline.
 * Puerto por defecto: 3001.
 *
 * @module server/index
 */

import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/** @constant {number} Puerto en el que escucha el servidor */
const PORT = 3001;

/** @constant {string} Ruta absoluta al archivo de base de datos JSON */
const DB_PATH = path.join(__dirname, '..', 'db.json');

/** @constant {string} Ruta absoluta al markdown de inventario */
const MD_PATH = path.join(__dirname, '..', 'insumos-emergencia.md');

app.use(cors());
app.use(express.json());

// ---------- helpers ----------

/**
 * Lee y parsea el archivo `db.json` de forma asincrónica.
 *
 * @async
 * @returns {Promise<{ insumos: Array<Object>, categorias: string[], simbolos: Array<{codigo: string, descripcion: string}> }>}
 *   Objeto con las tres colecciones de la base de datos.
 * @throws {Error} Si el archivo no existe o JSON está malformado.
 */
async function readDB() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error('archivo db.json no encontrado');
    }
    throw new Error(`Error al leer db.json: ${err.message}`);
  }
}

/**
 * Serializa y escribe el objeto de la base de datos en `db.json` de forma segura.
 * Escribe en un archivo temporal antes de renombrar, garantizando atomicidad.
 *
 * @async
 * @param {{ insumos: Array<Object>, categorias: string[], simbolos: Array<Object> }} data
 *   Objeto completo de la base de datos a persistir.
 * @throws {Error} Si hay error durante la escritura.
 */
async function writeDB(data) {
  try {
    const tempPath = DB_PATH + '.tmp';
    const jsonString = JSON.stringify(data, null, 2);

    // Escribir en archivo temporal
    await fs.writeFile(tempPath, jsonString, 'utf-8');

    // Renombrar de forma atómica (reemplaza el original)
    await fs.rename(tempPath, DB_PATH);
  } catch (err) {
    throw new Error(`Error al escribir db.json: ${err.message}`);
  }
}

/**
 * Regenera `insumos-emergencia.md` a partir de la lista actual de insumos.
 * Mantiene la misma estructura del archivo original: tabla de Alimentos y
 * sección de Productos no alimenticios (categoría "higiene").
 *
 * @async
 * @param {Array<Object>} insumos - Lista completa de insumos del inventario.
 * @throws {Error} Si hay error durante la escritura del MD.
 */
async function writeMD(insumos) {
  try {
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
      `| ${formatoNombre(i)} | ${i.categoria} | ${formatoCantidad(i)} | ${formatoVencimiento(i.vencimiento)} | ${formatoNumero(i.calorias)} | ${formatoNumero(i.proteina)} | ${i.notas || '--'} |`;

    const tablaRef = `## Referencias

| Símbolo           | Significado                        |
| ----------------- | ---------------------------------- |
| \`V\`               | Ya vencido (fecha anterior a 2026) |
| \`*\`               | Vence este año (durante el 2026)   |
| \`R\`               | Reponer                            |
| \`PS\`              | Pronto a sacar (Reponer inferido)  |
| _(sin asterisco)_ | Vence en 2027 o posterior          |`;

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
    // No interrumpir la operación principal si falla la escritura del MD
    console.error(`Advertencia: No se pudo actualizar ${MD_PATH}: ${err.message}`);
  }
}

// ---------- INSUMOS ----------

/**
 * GET /api/insumos
 *
 * Devuelve la lista de insumos, opcionalmente filtrada.
 *
 * @queryParam {string} [categoria] - Filtra por categoría exacta. Usar "todas" o vacío para no filtrar.
 * @queryParam {string} [texto]     - Filtra por coincidencia parcial (case-insensitive) en nombre, notas, símbolos.
 * @returns {{ success: boolean, data: Array<Object> }} 200 – Objeto con éxito y array de insumos en `data`.
 * @returns {{ success: boolean, error: string }} 500 – Error interno.
 */
app.get('/api/insumos', async (req, res) => {
  try {
    const db = await readDB();
    let items = db.insumos;

    const { categoria, texto } = req.query;

    if (categoria && categoria !== 'todas') {
      items = items.filter(i => i.categoria === categoria);
    }

    if (texto) {
      const q = texto.toLowerCase();
      items = items.filter(i => {
        // Buscar en nombre, notas y símbolos
        const coincideNombre = i.nombre.toLowerCase().includes(q);
        const coincideNotas = (i.notas || '').toLowerCase().includes(q);
        const coincideSimbolo = (i.simbolos || []).some(s => s.toLowerCase().includes(q));
        return coincideNombre || coincideNotas || coincideSimbolo;
      });
    }

    res.json({
      success: true,
      data: items,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * GET /api/insumos/:id
 *
 * Obtiene un insumo único por su UUID.
 *
 * @param {string} req.params.id - UUID del insumo.
 * @returns {{ success: boolean, data: Object }} 200 – Objeto con el insumo encontrado en `data`.
 * @returns {{ success: boolean, error: string }} 404 – No encontrado.
 */
app.get('/api/insumos/:id', async (req, res) => {
  try {
    const db = await readDB();
    const item = db.insumos.find(i => i.id === req.params.id);
    if (!item)
      return res.status(404).json({
        success: false,
        error: 'No encontrado',
      });
    res.json({
      success: true,
      data: item,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * POST /api/insumos
 *
 * Crea un nuevo insumo. Genera automáticamente `id`, `creadoEn` y `actualizadoEn`.
 *
 * @body {string}   nombre       - (obligatorio) Nombre del producto.
 * @body {string}   [cantidad]   - Ej: "2x 500".
 * @body {string}   [unidad]     - Ej: "g", "ml", "kg".
 * @body {string}   [categoria]  - Categoría del insumo (default: "alimentos").
 * @body {string}   [vencimiento]- Formato "MM-AAAA" o "no vence".
 * @body {number|null} [calorias]  - kcal por porción.
 * @body {number|null} [proteina]  - Gramos de proteína.
 * @body {string}   [notas]      - Observaciones libres.
 * @body {string[]} [simbolos]   - Códigos de símbolos (ej: ["V", "*"]).
 * @returns {{ success: boolean, data: Object }} 201 – Insumo creado en `data`.
 * @returns {{ success: boolean, error: string }} 400 – Falta el nombre o datos inválidos.
 */
app.post('/api/insumos', async (req, res) => {
  try {
    const db = await readDB();
    const {
      nombre,
      cantidad,
      unidad,
      categoria,
      vencimiento,
      calorias,
      proteina,
      notas,
      simbolos,
    } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
    }

    const nuevo = {
      id: randomUUID(),
      nombre: nombre.trim(),
      cantidad: cantidad ?? '',
      unidad: unidad ?? '',
      categoria: categoria ?? 'alimentos',
      vencimiento: vencimiento ?? '',
      calorias: calorias ?? null,
      proteina: proteina ?? null,
      notas: notas ?? '',
      simbolos: Array.isArray(simbolos) ? simbolos : [],
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    };

    db.insumos.push(nuevo);
    await writeDB(db);
    await writeMD(db.insumos);

    res.status(201).json({
      success: true,
      data: nuevo,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * PUT /api/insumos/:id
 *
 * Actualiza parcialmente un insumo existente. Solo se modifican los campos
 * enviados en el body; los demás se conservan. Actualiza `actualizadoEn` automáticamente.
 *
 * @param {string} req.params.id - UUID del insumo a actualizar.
 * @body  {Object} campos        - Cualquier subconjunto de los campos del insumo.
 * @returns {{ success: boolean, data: Object }} 200 – Insumo actualizado en `data`.
 * @returns {{ success: boolean, error: string }} 404 – No encontrado.
 */
app.put('/api/insumos/:id', async (req, res) => {
  try {
    const db = await readDB();
    const idx = db.insumos.findIndex(i => i.id === req.params.id);
    if (idx === -1)
      return res.status(404).json({
        success: false,
        error: 'No encontrado',
      });

    const campos = [
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
    const actualizado = { ...db.insumos[idx] };

    for (const campo of campos) {
      if (req.body[campo] !== undefined) {
        actualizado[campo] = req.body[campo];
      }
    }
    actualizado.actualizadoEn = new Date().toISOString();

    db.insumos[idx] = actualizado;
    await writeDB(db);
    await writeMD(db.insumos);

    res.json({
      success: true,
      data: actualizado,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * DELETE /api/insumos/:id
 *
 * Elimina un insumo por su UUID.
 *
 * @param {string} req.params.id - UUID del insumo a eliminar.
 * @returns {{ success: boolean, data: Object }} 200 – Confirmación con el item eliminado en `data`.
 * @returns {{ success: boolean, error: string }} 404 – No encontrado.
 */
app.delete('/api/insumos/:id', async (req, res) => {
  try {
    const db = await readDB();
    const idx = db.insumos.findIndex(i => i.id === req.params.id);
    if (idx === -1)
      return res.status(404).json({
        success: false,
        error: 'No encontrado',
      });

    const eliminado = db.insumos.splice(idx, 1)[0];
    await writeDB(db);
    await writeMD(db.insumos);

    res.json({
      success: true,
      data: eliminado,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ---------- CATEGORIAS ----------

/**
 * GET /api/categorias
 *
 * Devuelve el array de categorías disponibles definidas en `db.json`.
 *
 * @returns {{ success: boolean, data: string[] }} 200 – Lista de categorías en `data`.
 */
app.get('/api/categorias', async (req, res) => {
  try {
    const db = await readDB();
    res.json({
      success: true,
      data: db.categorias,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ---------- SÍMBOLOS ----------

/**
 * GET /api/simbolos
 *
 * Devuelve los símbolos disponibles (código + descripción) definidos en `db.json`.
 *
 * @returns {{ success: boolean, data: Array<{codigo: string, descripcion: string}> }} 200 – Lista de símbolos en `data`.
 */
app.get('/api/simbolos', async (req, res) => {
  try {
    const db = await readDB();
    res.json({
      success: true,
      data: db.simbolos,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

export { app };

// Solo arranca el servidor si se ejecuta directamente (no en tests)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n  Servidor de Comida Emergencia Mini corriendo en http://localhost:${PORT}\n`);
  });
}
