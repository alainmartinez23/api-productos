import { prisma } from "../db/prismaClient.js"
import { ProductoRepository } from "./ProductoRepository.js"

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