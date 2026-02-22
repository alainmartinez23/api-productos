import { redis } from "../cache/redisClient.js";

export class ProductoService {
    constructor(repositorio) {
        this.repo = repositorio
    }

    /**
     * En esta parte del código aplico toda la lógica de caché
     * 
     * El patrón de caché que elijo es el caché-aside, que consiste en lo siguiente:
     * cuando recibo una petición de tipo GET, busco en caché, y si está en caché devuelvo
     * resultado. Si no está en caché, llamo a la base de datos, obtengo resultado, lo añado
     * a caché y devuelvo resultado al cliente.
     * 
     * En el resto de requests (POST, PUT, DELETE) tengo que hacer invalidaciones de caché
     */

    async crearProducto(nuevo) {
        if (!nuevo) {return}

        /**
         * Si creo producto, invalido caché. Así la siguiente petición tendrá que ir a DB
         * y recuperará todos los productos, incluido el nuevo
         */
        const key = "productos:list"
        await redis.del(key)

        return await this.repo.crearProducto(nuevo);
    }

    async listarProductos(params = {}) {
        const { skip = 0, take = 10, orderByPrecio } = params

        // Aquí tengo que tener en cuenta los filtros también.
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

        // Invalidar tanto el producto individual como la lista entera
        await redis.del(`productos:${id}`)
        await redis.del("productos:list")

        return actualizado
    }

    async eliminarProducto(id) {
        const eliminado = await this.repo.eliminarProducto(id)
        
        if (!eliminado) return null;

        // Invalidar tanto el producto individual como la lista entera
        await redis.del(`productos:${id}`)
        await redis.del("productos:list")

        return eliminado 
    }
}