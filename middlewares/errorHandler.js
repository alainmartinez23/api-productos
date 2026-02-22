/**
 * Con este middleware quiero estandarizar todos los errores. 
 * Hago que el formato siempre sea el mismo, además de que me ahorra código.
 */

export const errorHandler = (err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        message: err.message || "Internal server error"
    });
};