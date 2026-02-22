import pkg from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

const { PrismaClient } = pkg
const { Pool } = pg

/**
 * El parámetro ssl con rejectUnauthorized es fundamental para que no
 * haya problemas en un entorno productivo. Esta API la he usado con
 * RDS PostgreSQL (PostgreSQL gestionado por AWS).
 * 
 * En caso de querer probar la API en local con PostgreSQL en local,
 * se puede quitar el parámetro SSL sin ningún problema
 */
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // OPCIONAL --> leer explicación de arriba
    ssl: {
        rejectUnauthorized: false
    }
})

const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({
    adapter
})