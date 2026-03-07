import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3001
const DB_PATH = path.join(__dirname, '..', 'db.json')

app.use(cors())
app.use(express.json())

// ---------- helpers ----------

function readDB() {
  const raw = fs.readFileSync(DB_PATH, 'utf-8')
  return JSON.parse(raw)
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

// ---------- INSUMOS ----------

// GET /api/insumos  — lista con filtros opcionales (?categoria=&texto=)
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

// GET /api/insumos/:id
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

// POST /api/insumos
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

// PUT /api/insumos/:id
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

// DELETE /api/insumos/:id
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

app.get('/api/categorias', (req, res) => {
  try {
    const db = readDB()
    res.json(db.categorias)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ---------- SÍMBOLOS ----------

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
