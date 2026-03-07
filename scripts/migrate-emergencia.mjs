/**
 * migrate-emergencia.mjs
 * Añade el campo `esEmergencia` a todos los items de db.json.
 * - IDs que empiezan con "11111111-0002" → esEmergencia: false
 * - Todos los demás                      → esEmergencia: true  (si no tienen el campo ya)
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, '..', 'db.json')

const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))

let updated = 0
db.insumos = db.insumos.map(item => {
  const esEmergencia = !item.id.startsWith('11111111-0002')
  if (item.esEmergencia === esEmergencia) return item   // ya correcto, nada que hacer
  updated++
  return { ...item, esEmergencia }
})

fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8')
console.log(`Migración completa. Items actualizados: ${updated} / ${db.insumos.length}`)
