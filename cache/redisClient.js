import { createClient } from "redis";

/**
 * TLS: pongo TLS a true ya que esta API la he usado para montar una
 * arquitectura en producción con ElastiCache (el Redis de AWS).
 * Entonces es importante destacar que las conexiones deben ser rediss://<endpoint>.
 * 
 * En caso de querer lanzarla en local para probarla, quitar el parámetro socket con TLS
 * y establecer conexiones a una URL de tipo redis://<endpoint> (con una sola S)
 * 
 */
export const redis = createClient({
  url: process.env.REDIS_URL,
  // Este parámetro es opcional --> leer la explicación de arriba
  socket: {
    tls: true
  }
});

redis.on("error", (err) => console.error("Redis error", err));

export const initRedis = async () => {
  await redis.connect();
};