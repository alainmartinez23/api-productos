# 🛒 API de Productos - Demo con Arquitectura Enterprise

## 📌 Vista general
Este proyecto es una REST API lista para producción construida con Node.js y Express. Sigue una serie de
principios de arquitectura limpia, con buenas prácticas a nivel enterprise, y ha sido diseñada con el
objetivo de desplegarla en la infraestructura de AWS.

Es un CRUD de productos, simulando la gestión de productos desde el punto de vista de un administrador
de una tienda online, por ejemplo. Lo explico en profundidad más adelante, pero incluye cosas como:
- Arquitectura por capas para desacoplamiento
- PostgreSQL con Prisma como ORM
- Redis con patrón caché-aside
- Protección con Api Key 
- Logging estandarizado
- Validación de datos de entrada con Zod

## 🧱 Arquitectura
La API sigue un modelo por capas para conseguir que haya un bajo acoplamiento y que sea muy sencillo
cambiar de base de datos. Es decir, busco desacoplar el código de la base de datos, siguiendo un enfoque
modular, permitiendo cambiar componentes concretos sin tener que modificar todo el código.

Prisma Model --> Repositorios --> Servicios --> Controllers --> Routes

### Responsabilidades
- Prisma Model --> ORM mapping (define la estructura de mis tablas)
- Repositorios --> Se encarga de las llamadas a la base de datos, es la única capa que comunica directamente con la base de datos
- Servicios --> Lógica de negocio y lógica de caché
- Controllers --> Gestiona los inputs/outputs HTTP
- Routes --> Define los endpoints y los middlewares

Gracias a esto permito que la escalabilidad sea más simple, testear sea más fácil y hacer cambios también.

## 🔐 Seguridad

### 1. API Key middleware
Todas las rutas requieren el header 'x-api-key'.

### 2. Schema Validation
Todos los bodies son validados con Zod. Todo lo que llega a los controladores está limpio, es decir, Zod
se encarga de dejar pasar las peticiones correctas o desechar las peticiones con errores en los datos de entrada.

### 3. Helmet
Helmet introduce headers de seguridad tales como: X-Frame-Options, HSTS, Content Security Policy...

### 4. Error handler middleware
Middleware que estandariza todos los errores.


## ⚡ Estrategia de caché
Esta API sigue un patrón Cache-Aside usando Redis. El patrón consiste en:
1. En peticiones de tipo GET --> mirar en caché
2. Si hay HIT --> devolver datos cacheados
3. Si hay MISS --> hacer petición a la base de datos
4. Guardar resultados en caché
5. Devolverle al cliente el resultado

Con este sistema, logro bajar notablemente la latencia cada vez que hay un HIT. Además de conseguir
una latencia menor, protejo mi base de datos, reduciendo el número de lecturas que recibe.


## 🗄 Base de datos
Utilizo:
- PostgreSQL
- Prisma como ORM (model Producto)

Hago un CRUD, que permite: crear producto, listar todos los productos, listar un producto individual,
modificar un producto y eliminar un producto.

Para probar la API en local he usado PostgreSQL instalado en local. En producción he usado AWS RDS PostgreSQL.


## 🧠 Decisiones de diseño
- Utilizo PostgreSQL porque los productos son la base de la tienda online que simulo y me ofrece consistencia fuerte
- Se implementa Redis con patrón Cache-Aside para optimizar lecturas frecuentes y golpear menos veces a la base de datos
- Separo el código por capas para que sea muy simple migrar a otra base de datos sin necesidad de modificar todo el código
- Añado middlewares de validación para no tener que hacer validaciones en los controllers, ni repetir código y que falle la petición lo antes posible en caso de error
- Utilizo API Key y no JWT con login/register porque asumo que esta API es para comunicación interna entre VPCs, simulando que tengo a varios equipos de la empresa trabajando conjuntamente



## 🐳 Desarrollo en local
### 1. Lanzar Redis mediante Docker
Escribir por terminal: 
- docker run -d -p 6379:6379 redis

### 2. Configurar PostgreSQL en local
Se requiere tener instalado PostgreSQL en local (aunque se podría lanzar en Docker también), sin embargo, yo lo
he hecho con la aplicación instalada en local.

Se requiere añadir en la raíz del proyecto un fichero llamado '.env' con:
1. DATABASE_URL=postgresql://user:password@localhost:5432/db
2. REDIS_URL=redis://localhost:6379

### 3. Migraciones de prisma
Escribir por terminal: 
- npx prisma migrate dev

### 4. Iniciar servidor
Escribir por terminal:
- node index.js



## ☁ Arquitectura de despliegue en AWS
Disclaimer: para lanzar esta API en producción, utilizando los componentes que propongo, hay que hacer dos pequeñas modificaciones:
1. Entrar en cache/redisClient.js y descomentar el parámetro socket
2. Entrar en db/prismaClient.js y descomentar el parámetro SSL


Pese a que no se vea, esta API ha sido concebida con el objetivo de ser desplegada en AWS.
En una VPC llamada VPC Producer, se hace el siguiente despliegue:
- ECS Fargate con containers para la API (en una subred privada)
- ElastiCache como cluster de Redis (en la misma subred privada)
- RDS PostgreSQL (en una subred distinta a ECS+ElastiCache)
- Network Load Balancer
- VPC Endpoints

Esta API no se expone públicamente, sino que está diseñada para ser consumida a nivel interno por
otra VPC. 

- Consumer VPC --> VPC Endpoint --> PrivateLink --> NLB --> ECS --> API


## 📂 Estructura del proyecto
- cache/
- controllers/
- db/
- middlewares/
- prisma/
- repositories/
- routes/
- schemas/
- services/
- app.js
- index.js


## 📬 API Endpoints
* POST - /productos --> Crear producto
* GET - /productos --> Listar productos
* GET - /productos/:id --> Obtener un único producto
* PUT - /productos/:id --> Modificar producto
* DELETE - /productos/:id --> Eliminar producto

Añadir el header requerido: "x-api-key: your_api_key"

En el .env se puede añadir: API_KEY="<valor_deseado>", escribir el valor deseado y ese valor
será el que habrá que añadir en las requests en el header 'x-api-key' para que sean aceptadas


## 🧪 Requests de ejemplo

### Crear producto

curl -X POST http://localhost:3000/productos \
-H "Content-Type: application/json" \
-H "x-api-key: your_api_key" \
-d '{
  "nombre": "Camiseta Negra",
  "precio": 29.99,
  "stock": 50
}'


Respuesta esperada:


{
  "id": 1,
  "nombre": "Camiseta Negra",
  "precio": 29.99,
  "stock": 50,
  "createdAt": "2026-02-22T12:00:00.000Z"
}


### Listar productos

curl -X GET http://localhost:3000/productos \
-H "x-api-key: your_api_key_invalid"


## 🚀 Mejoras futuras
- Implementar autenticación con JWT
- Rate limiting
- Tests unitarios
- CI/CD con Github Actions
- Documentación OpenAPI
- Health checks y readiness
- Métricas con Prometheus y Grafana