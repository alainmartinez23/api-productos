import { prisma } from "../db/prismaClient.js"
import { ProductoRepository } from "./ProductoRepository.js"

/**
 * Clase específica de repositorio para PostgreSQL usando Prisma como ORM
 * 
 * Este fichero (y el resto de repositorios en el caso de que tuviera más),
 * es el único en el que se permite interactuar directamente con la base de datos.
 * Es decir, en controllers, routes o services no llamo a la base de datos directamente,
 * si no que hago llamadas a los métodos de esta clase.
 */

export class ProductoRepositoryPostgres extends ProductoRepository {
    async crearProducto(nuevo) {
        return prisma.producto.create({
            data: {
                nombre: nuevo.nombre,
                precio: nuevo.precio,
                stock: nuevo.stock
            }
        })
    }

    async listarProductos({skip = 0, limit = 10, orderByPrecio} = {}) {

        /**
         * Seguir las convenciones de Prisma. Por ejemplo, acostumbrado a SQL puedo pensar que se
         * usa 'limit' y no 'take', pero en este caso es 'take'. 
         * 
         * Básicamente: mirar documentación de Prisma
         */
        return prisma.producto.findMany({
            skip: Number(skip),
            take: Number(limit),
            orderBy: orderByPrecio === "asc" || orderByPrecio === "desc" ? { precio: orderByPrecio } : { createdAt: "desc" }
        })
    }

    
    async listarProductoIndividual(id) {
        return prisma.producto.findUnique({
            where: {id}
        })
    }

    async modificarProducto(id, modificado) {
        return prisma.producto.update({
            where: {id},
            data: modificado
        })
    }

    async eliminarProducto(id) {
        const existe = await prisma.producto.findUnique({
            where: { id }
        })

        if (!existe) {
            return null
        }

        return prisma.producto.delete({
            where: { id }
        })
    }
}