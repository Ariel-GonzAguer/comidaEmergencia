/**
 * @file Script de migración que asigna el campo `esEmergencia` a todos los
 * insumos existentes en `db.json`.
 *
 * Lógica de asignación:
 * - IDs que comienzan con `"11111111-0002"` → `esEmergencia: false` (no-emergencia).
 * - Todos los demás → `esEmergencia: true`.
 *
 * Es idempotente: puede ejecutarse múltiples veces sin efectos secundarios.
 *
 * @example
 * // Ejecutar desde la raíz del proyecto:
 * node scripts/migrate-emergencia.mjs
 *
 * @module scripts/migrate-emergencia
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

/** @constant {string} Directorio del script actual */
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @constant {string} Ruta absoluta a la base de datos JSON */
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
