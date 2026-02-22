/**
 * Este middleware lo que hace es obtener un header de la request.
 * Esto está hecho para que solo personas autorizadas (personas con la apiKey),
 * puedan hacer peticiones.
 * Simplemente hay que mirar si el cliente envía el header x-api key,
 * y luego hay que mirar que la apiKey que envía sea correcta, es decir, que
 * coincida con la (o las) que tenemos almacenada. 
 */

export const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.header("x-api-key")

    if (!apiKey) {
        return res.status(401).json({ message: "API key missing" })
    }

    if (apiKey !== process.env.API_KEY) {
        return res.status(403).json({ message: "Invalid API key" })
    }

    next()
}