export const validarSchema = (schema, property = "body") => {
    return (req, res, next) => {
        const resultado = schema.safeParse(req[property])
        if (!resultado.success) {
            return res.status(400).json({error: resultado.error.flatten()})
        }
        next()
    }
}