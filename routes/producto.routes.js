import { Router } from "express"
import { crearProducto, eliminarProducto, listarProductoIndividual, listarProductos, modificarProducto } from "../controllers/producto.controller.js"
import { validarSchema } from "../middlewares/validarSchema.js"
import { crearProductoSchema, modificarProductoSchema } from "../schemas/productoSchema.js"

/**
 * Routes con todos los middlewares correspondientes
 * 
 * Como posibles mejoras, se podrían hacer lo siguiente:
 * - middleware de Rate Limiting
 * - middleware para comprobar que ID sea correcto
 * - ...
 */

const router = Router()

router.post("/productos", validarSchema(crearProductoSchema), crearProducto)
router.get("/productos", listarProductos)
router.get("/productos/:id", listarProductoIndividual)
router.put("/productos/:id", validarSchema(modificarProductoSchema), modificarProducto)
router.delete("/productos/:id", eliminarProducto)

export default router;