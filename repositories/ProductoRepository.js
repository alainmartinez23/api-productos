/**
 * Clase padre en la que defino los métodos que puede hacer mi API.
 * 
 * Si por ejemplo quiero que mi base de datos sea Mongo, pues crearé una clase
 * que extienda de esta e implementaré los métodos correspondientes del ORM adecuado, con
 * las llamadas específicas de Mongo.
 * 
 * En mi caso uso Postgre, con el ORM de Prisma, pues crearé una clase que extienda
 * de esta con las llamadas a Postgre correspondientes que me ofrece Prisma.
 */

export class ProductoRepository {
    async crearProducto() {
        throw new Error("'crearProducto' sin implementar")
    }

    async listarProductos() {
        throw new Error("'listarProductos' sin implementar")
    }

    async listarProductoIndividual() {
        throw new Error("'listarProductoIndividual' sin implementar")
    }

    async modificarProducto() {
        throw new Error("'modificarProducto' sin implementar")
    }

    async eliminarProducto() {
        throw new Error("'eliminarProducto' sin implementar")
    }
}