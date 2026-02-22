/**
 * Middleware simple de validación para que todas las peticiones
 * cumplan con los esquemas de ZOD que he establecido en las routes.
 */

export const validarSchema = (schema, property = "body") => {
    return (req, res, next) => {
        const resultado = schema.safeParse(req[property])
        if (!resultado.success) {
            return res.status(400).json({error: resultado.error.flatten()})
        }
        next()
    }
}