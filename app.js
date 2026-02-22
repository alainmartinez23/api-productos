import { configDotenv } from "dotenv";
configDotenv()
import express from "express"
import routerProductos from "./routes/producto.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { loggerMiddleware } from "./middlewares/logger.js";
import helmet from "helmet";
import { apiKeyMiddleware } from "./middlewares/apiKey.js";

const app = express()


app.use(loggerMiddleware)

// Helmet introduce una serie de headers para mayor seguridad
app.use(helmet())
app.use(express.json())

// Request de prueba. También le puedo llamar /health, que suele ser lo normal
app.use("/prueba", (req, res) => {
    res.status(200).json("OK")
})

app.use(apiKeyMiddleware)
app.use("/", routerProductos)
app.use(errorHandler)

export default app;