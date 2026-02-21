import { Router } from "express"
import { crearProducto, eliminarProducto, listarProductoIndividual, listarProductos, modificarProducto } from "../controllers/producto.controller.js"
import { validarSchema } from "../middlewares/validarSchema.js"
import { crearProductoSchema, modificarProductoSchema } from "../schemas/productoSchema.js"

// Falta crear todos los middlewares!!!!! 
// Esto es un testeo mínimo

const router = Router()

router.post("/productos", validarSchema(crearProductoSchema), crearProducto)
router.get("/productos", listarProductos)
router.get("/productos/:id", listarProductoIndividual)
router.put("/productos/:id", validarSchema(modificarProductoSchema), modificarProducto)
router.delete("/productos/:id", eliminarProducto)

export default router;