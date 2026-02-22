import z from "zod";

/**
 * Aquí puedo añadir las validaciones que quiera, pero se debe ser coherente
 * con lo establecido en la definición del model en el ORM (en prisma/schema.prisma)
 */

export const crearProductoSchema = z.object({
    nombre: z.string().min(5).max(100),
    precio: z.number().positive(),
    stock: z.number().int().min(0),
})

export const modificarProductoSchema = z.object({
    nombre: z.string().min(5).max(100).optional(),
    precio: z.number().positive().optional(),
    stock: z.number().int().min(0).optional(),
})