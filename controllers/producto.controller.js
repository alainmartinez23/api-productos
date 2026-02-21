import { ProductoRepositoryPostgres } from "../repositories/ProductoRepositoryPostgres.js";
import { ProductoService } from "../services/producto.service.js";

const postgreRepo = new ProductoRepositoryPostgres();
const servicio = new ProductoService(postgreRepo);

// Falta añadir DTOs

export const crearProducto = async(req, res, next) => {
    try {
        const productoNuevo = await servicio.crearProducto(req.body);
        res.status(201).json({producto: productoNuevo})
    } catch (e) {
        console.log("Error creando producto nuevo")
        next(e)
    }
}

export const listarProductos = async(req, res, next) => {
    try {
        const productos = await servicio.listarProductos(req.query)
        res.status(200).json({productos})
    } catch (e) {
        console.log("Error listar productos")
        next(e)
    }
}

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