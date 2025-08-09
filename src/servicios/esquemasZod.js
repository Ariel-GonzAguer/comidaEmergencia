import { z } from "zod";

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

export const lugarSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio")
});

export const notaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  contenido: z.string().min(1, "El contenido es obligatorio")
});

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

export const medicamentoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  uso: z.string().min(1, "El uso es obligatorio"),
  cantidad: z.preprocess(val => Number(val), z.number().nonnegative()),
  fechaVencimiento: z.string().min(1, "La fecha de vencimiento es obligatoria")
});

export const otrosSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  uso: z.string().min(1, "El uso es obligatorio")
});

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