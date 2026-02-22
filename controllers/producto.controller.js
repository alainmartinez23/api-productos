import { ProductoRepositoryPostgres } from "../repositories/ProductoRepositoryPostgres.js";
import { ProductoService } from "../services/producto.service.js";

/**
 * Mi API está pensada para lanzarla en AWS con PostgreSQL, por tanto
 * elijo el repositorio de PostgreSQL. 
 * 
 * En el caso de querer usar otro tipo de base de datos, ej: MySQL, SQL Server
 * o incluso Dynamo o Mongo, simplemente tendría que instancias otro repositorio
 * y pasárselo al service.
 * 
 * Este enfoque permite que cambiar de base de datos sea muy sencillo, sin necesidad
 * de cambiar todo el código. Es decir, independientemente de cual sea la base de datos
 * que se quiera utilizar, este fichero 'producto.controller.js' es compatible
 * con todas, sin tener que cambiar nada
 */
const postgreRepo = new ProductoRepositoryPostgres();
const servicio = new ProductoService(postgreRepo);

/**
 * Tengo middlewares de validación en las routes, así que asumo que todas las peticiones
 * que llegan a este punto son correctas, por ende, aquí no hago comprobaciones del
 * body, params, query.
 */


/**
 * Esta parte es una de las partes más simple del código, ya que aquí simplemente obtengo
 * lo que llega en la petición y coordino todas las llamadas. La lógica está tanto en los 
 * middlewares como en los services.
 */

// Añadir un producto nuevo: si todo OK --> 201, si no, fallará previamente en la validación
export const crearProducto = async(req, res, next) => {
    try {
        const productoNuevo = await servicio.crearProducto(req.body);
        res.status(201).json({producto: productoNuevo})
    } catch (e) {
        console.log("Error creando producto nuevo")
        next(e)
    }
}

// Puede devolver un array vacío si no hay productos añadidos, si no devuelve todos los productos
export const listarProductos = async(req, res, next) => {
    try {
        const productos = await servicio.listarProductos(req.query)
        res.status(200).json({productos})
    } catch (e) {
        console.log("Error listar productos")
        next(e)
    }
}

// Puede devolver un 404 en caso de que se le pase un ID erróneo o 200 si encuentra el producto
export const listarProductoIndividual = async(req, res, next) => {
    try {
        const producto = await servicio.listarProductoIndividual(req.params.id)
        if (!producto) {
            res.status(404).json({message: "Producto no encontrado"})
        }
        res.status(200).json({producto})
    } catch (e) {
        console.log("Error listando producto individual")
        next(e)
    }
}

// Puede devolver un 404 en caso de que se le pase un ID erróneo o 200 si modifica el producto
export const modificarProducto = async(req, res, next) => {
    try {
        const modificado = await servicio.modificarProducto(req.params.id, req.body);
        if (!modificado) {
            res.status(404).json({message: "Producto no encontrado"})
        }
        res.status(200).json({modificado})
    } catch (e) {
        console.log("Error modificando producto")
        next(e)
    }
}

// Puede devolver un 404 en caso de que se le pase un ID erróneo o 200 si elimina el producto correctamente
export const eliminarProducto = async(req, res, next) => {
    try {
        const eliminado = await servicio.eliminarProducto(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ message: "Producto no encontrado" })
        }
        res.status(200).json({eliminado}) 
    } catch (e) {
        console.log("Error eliminando producto")
        next(e)
    }
}