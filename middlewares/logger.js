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