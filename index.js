import app from "./app.js";
import { initRedis } from "./cache/redisClient.js";

initRedis();

// Línea de DEBUG, ya que me fallaba la conexión a la database
// console.log("DATABASE_URL real:", process.env.DATABASE_URL);

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000...")
})