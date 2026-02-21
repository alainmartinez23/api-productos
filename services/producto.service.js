import { redis } from "../cache/redisClient.js";

export class ProductoService {
    constructor(repositorio) {
        this.repo = repositorio
    }

    // Aquí meteré toda la lógica de caché

    async crearProducto(nuevo) {
        if (!nuevo) {return}

        const key = "productos:list"
        await redis.del(key)

        return await this.repo.crearProducto(nuevo);
    }

    async listarProductos(params = {}) {
        const { skip = 0, take = 10, orderByPrecio } = params

        const key = `productos:list:skip=${skip}:limit=${take}:order=${orderByPrecio || "default"}`

        const productos = await redis.get(key)

        if (productos) {
            console.log("HIT")
            return JSON.parse(productos)
        }

        console.log("MISS")

        const productosDB = await this.repo.listarProductos({skip, take, orderByPrecio});

        await redis.set(key, JSON.stringify(productosDB), {EX: 60})

        return productosDB
    }

    async listarProductoIndividual(id) {
        const key = `productos:${id}`
        const producto = await redis.get(key)

        if (producto) {
            console.log("HIT")
            return JSON.parse(producto);
        }

        console.log("MISS")
        const productoDB = await this.repo.listarProductoIndividual(id)
        await redis.set(key, JSON.stringify(productoDB), {EX: 300})

        return productoDB
    }

    async modificarProducto(id, modificado) {
        const actualizado =  await this.repo.modificarProducto(id, modificado)
        if (!actualizado) return null 

        await redis.del(`productos:${id}`)
        await redis.del("productos:list")

        return actualizado
    }

    async eliminarProducto(id) {
        const eliminado = await this.repo.eliminarProducto(id)
        
        if (!eliminado) return null;

        await redis.del(`productos:${id}`)
        await redis.del("productos:list")

        return eliminado 
    }
}