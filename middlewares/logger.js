/**
 * Middleware en el que busco estandarizar un formato de respuesta
 * que permita ver al cliente el tiempo de respuesta. Además
 * loggeo absolutamente todo.
 * 
 * Hacer un console.log() de los logs me es suficiente para esta práctica,
 * ya que está diseñada para lanzarla en tareas de ECS (el Docker de AWS) y
 * ahí los puedo ver, pero también podría publicarlo en un bus de eventos por ejemplo
 * y de ahí transformarlos y añadirlos en S3, esa sería una de las tantas
 * opciones que tengo.
 */

export const loggerMiddleware = (req, res, next) => {
    const start = process.hrtime.bigint()

    const originalEnd = res.end

    res.end = function (...args) {
        const end = process.hrtime.bigint()
        const durationMs = Number(end - start) / 1_000_000
        const responseTime = `${durationMs.toFixed(2)}ms`

        res.setHeader("X-Response-Time", responseTime)

        console.log(
            `${req.method} ${req.originalUrl} - ${res.statusCode} - ${responseTime}`
        )

        originalEnd.apply(res, args)
    }

    next()
}