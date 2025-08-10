/**
 * Esquemas de validación para los modelos principales de la aplicación usando Zod.
 * Cada esquema define las reglas de validación para los datos que se reciben y almacenan.
 * Incluye función utilitaria para extraer mensajes de error de Zod.
 */
import { z } from "zod";

/**
 * Esquema para validar alimentos.
 * - nombre: string obligatorio
 * - tipo: string obligatorio
 * - calorias: número entero no negativo
 * - cantidad: número no negativo
 * - fechaVencimiento: string obligatorio
 * - ubicacion: objeto con id y nombre
 */
export const alimentoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  tipo: z.string().min(1, "El tipo es obligatorio"),
  calorias: z.preprocess(val => Number(val), z.number().int().nonnegative()),
  cantidad: z.preprocess(val => Number(val), z.number().nonnegative()),
  fechaVencimiento: z.string().min(1, "La fecha de vencimiento es obligatoria"),
  ubicacion: z.object({
    id: z.string().min(1),
    nombre: z.string().min(1)
  })
});

/**
 * Esquema para validar lugares.
 * - nombre: string obligatorio
 */
export const lugarSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio")
});

/**
 * Esquema para validar notas.
 * - nombre: string obligatorio
 * - contenido: string obligatorio
 */
export const notaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  contenido: z.string().min(1, "El contenido es obligatorio")
});

/**
 * Esquema para validar recetas.
 * - nombre: string obligatorio
 * - ingredientes: string o array de strings (al menos uno)
 * - calorias: número entero no negativo
 * - instrucciones: string o array de strings (al menos una)
 */
export const recetaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  ingredientes: z.union([
    z.string().min(1, "Los ingredientes son obligatorios"),
    z.array(z.string().min(1)).min(1, "Debe haber al menos un ingrediente")
  ]),
  calorias: z.preprocess(val => Number(val), z.number().int().nonnegative()),
  instrucciones: z.union([
    z.string().min(1, "Las instrucciones son obligatorias"),
    z.array(z.string().min(1)).min(1, "Debe haber al menos una instrucción")
  ])
});

/**
 * Esquema para validar medicamentos.
 * - nombre: string obligatorio
 * - uso: string obligatorio
 * - cantidad: número no negativo
 * - fechaVencimiento: string obligatorio
 */
export const medicamentoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  uso: z.string().min(1, "El uso es obligatorio"),
  cantidad: z.preprocess(val => Number(val), z.number().nonnegative()),
  fechaVencimiento: z.string().min(1, "La fecha de vencimiento es obligatoria")
});

/**
 * Esquema para validar ítems de tipo "otros".
 * - nombre: string obligatorio
 * - uso: string obligatorio
 */
export const otrosSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  uso: z.string().min(1, "El uso es obligatorio")
});

/**
 * Extrae los mensajes de error generados por Zod en la validación de un objeto.
 * @param {object} errorFormat - Formato de error generado por Zod.
 * @returns {string[]} Array de mensajes de error legibles para mostrar al usuario.
 */
export function obtenerMensajesErrorZod(errorFormat) {
  if (!errorFormat || typeof errorFormat !== "object") return ["Error de validación desconocido"];
  return Object.values(errorFormat)
    .flatMap((campo) =>
      typeof campo === "object" && campo?._errors
        ? campo._errors
        : []
    )
    .filter((msg) => msg);
}