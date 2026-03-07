/**
 * @file Servidor Express para la API REST del inventario de emergencia.
 * Lee y escribe directamente en `db.json` (no usa base de datos).
 * Puerto por defecto: 3001.
 *
 * @module server/index
 */

import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

/** @constant {number} Puerto en el que escucha el servidor */
const PORT = 3001

/** @constant {string} Ruta absoluta al archivo de base de datos JSON */
const DB_PATH = path.join(__dirname, '..', 'db.json')

app.use(cors())
app.use(express.json())

// ---------- helpers ----------

/**
 * Lee y parsea el archivo `db.json` de forma síncrona.
 *
 * @returns {{ insumos: Array<Object>, categorias: string[], simbolos: Array<{codigo: string, descripcion: string}> }}
 *   Objeto con las tres colecciones de la base de datos.
 * @throws {SyntaxError} Si el JSON está malformado.
 */
function readDB() {
  const raw = fs.readFileSync(DB_PATH, 'utf-8')
  return JSON.parse(raw)
}

/**
 * Serializa y escribe el objeto de la base de datos en `db.json`.
 *
 * @param {{ insumos: Array<Object>, categorias: string[], simbolos: Array<Object> }} data
 *   Objeto completo de la base de datos a persistir.
 */
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

// ---------- INSUMOS ----------

/**
 * GET /api/insumos
 *
 * Devuelve la lista de insumos, opcionalmente filtrada.
 *
 * @queryParam {string} [categoria] - Filtra por categoría exacta. Usar "todas" o vacío para no filtrar.
 * @queryParam {string} [texto]     - Filtra por coincidencia parcial (case-insensitive) en el nombre.
 * @returns {Array<Object>} 200 – Array de insumos.
 * @returns {{ error: string }} 500 – Error interno.
 */
app.get('/api/insumos', (req, res) => {
  try {
    const db = readDB()
    let items = db.insumos

    const { categoria, texto } = req.query
    if (categoria && categoria !== 'todas') {
      items = items.filter(i => i.categoria === categoria)
    }
    if (texto) {
      const q = texto.toLowerCase()
      items = items.filter(i => i.nombre.toLowerCase().includes(q))
    }
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * GET /api/insumos/:id
 *
 * Obtiene un insumo único por su UUID.
 *
 * @param {string} req.params.id - UUID del insumo.
 * @returns {Object} 200 – El insumo encontrado.
 * @returns {{ error: string }} 404 – No encontrado.
 */
app.get('/api/insumos/:id', (req, res) => {
  try {
    const db = readDB()
    const item = db.insumos.find(i => i.id === req.params.id)
    if (!item) return res.status(404).json({ error: 'No encontrado' })
    res.json(item)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/insumos
 *
 * Crea un nuevo insumo. Genera automáticamente `id`, `creadoEn` y `actualizadoEn`.
 *
 * @body {string}   nombre       - (obligatorio) Nombre del producto.
 * @body {string}   [cantidad]   - Ej: "2x 500".
 * @body {string}   [unidad]     - Ej: "g", "ml", "kg".
 * @body {string}   [categoria]  - Categoría del insumo (default: "alimentos").
 * @body {string}   [vencimiento]- Formato "AAAA-MM" o "no vence".
 * @body {number|null} [calorias]  - kcal por porción.
 * @body {number|null} [proteina]  - Gramos de proteína.
 * @body {string}   [notas]      - Observaciones libres.
 * @body {string[]} [simbolos]   - Códigos de símbolos (ej: ["V", "*"]).
 * @returns {Object} 201 – Insumo creado.
 * @returns {{ error: string }} 400 – Falta el nombre.
 */
app.post('/api/insumos', (req, res) => {
  try {
    const db = readDB()
    const { nombre, cantidad, unidad, categoria, vencimiento, calorias, proteina, notas, simbolos } = req.body

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ error: 'El campo "nombre" es obligatorio' })
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
    }

    db.insumos.push(nuevo)
    writeDB(db)
    res.status(201).json(nuevo)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * PUT /api/insumos/:id
 *
 * Actualiza parcialmente un insumo existente. Solo se modifican los campos
 * enviados en el body; los demás se conservan. Actualiza `actualizadoEn` automáticamente.
 *
 * @param {string} req.params.id - UUID del insumo a actualizar.
 * @body  {Object} campos        - Cualquier subconjunto de los campos del insumo.
 * @returns {Object} 200 – Insumo actualizado.
 * @returns {{ error: string }} 404 – No encontrado.
 */
app.put('/api/insumos/:id', (req, res) => {
  try {
    const db = readDB()
    const idx = db.insumos.findIndex(i => i.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'No encontrado' })

    const campos = ['nombre', 'cantidad', 'unidad', 'categoria', 'vencimiento', 'calorias', 'proteina', 'notas', 'simbolos']
    const actualizado = { ...db.insumos[idx] }

    for (const campo of campos) {
      if (req.body[campo] !== undefined) {
        actualizado[campo] = req.body[campo]
      }
    }
    actualizado.actualizadoEn = new Date().toISOString()

    db.insumos[idx] = actualizado
    writeDB(db)
    res.json(actualizado)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * DELETE /api/insumos/:id
 *
 * Elimina un insumo por su UUID.
 *
 * @param {string} req.params.id - UUID del insumo a eliminar.
 * @returns {{ ok: boolean, eliminado: Object }} 200 – Confirmación con el item eliminado.
 * @returns {{ error: string }} 404 – No encontrado.
 */
app.delete('/api/insumos/:id', (req, res) => {
  try {
    const db = readDB()
    const idx = db.insumos.findIndex(i => i.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'No encontrado' })

    const eliminado = db.insumos.splice(idx, 1)[0]
    writeDB(db)
    res.json({ ok: true, eliminado })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ---------- CATEGORIAS ----------

/**
 * GET /api/categorias
 *
 * Devuelve el array de categorías disponibles definidas en `db.json`.
 *
 * @returns {string[]} 200 – Lista de categorías.
 */
app.get('/api/categorias', (req, res) => {
  try {
    const db = readDB()
    res.json(db.categorias)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ---------- SÍMBOLOS ----------

/**
 * GET /api/simbolos
 *
 * Devuelve los símbolos disponibles (código + descripción) definidos en `db.json`.
 *
 * @returns {Array<{codigo: string, descripcion: string}>} 200 – Lista de símbolos.
 */
app.get('/api/simbolos', (req, res) => {
  try {
    const db = readDB()
    res.json(db.simbolos)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`\n  Servidor de inventario corriendo en http://localhost:${PORT}\n`)
})
