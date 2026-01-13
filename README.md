# Backend Finanzas - Microservicio de Gestión Financiera

Microservicio de gestión de ventas y gastos desarrollado con Node.js, Express, TypeScript y Sequelize ORM.

Primer microservicio de un sistema de gestión financiera. Gestiona el registro de ventas, gastos y generación de métricas agregadas para dashboard, dejando asentado qué usuario registró cada transacción.

---

## 📋 Tabla de Contenidos

- [Stack Técnico](#-stack-técnico)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Variables de Entorno](#-variables-de-entorno)
- [Scripts Disponibles](#-scripts-disponibles)
- [Endpoints](#-endpoints)
- [Testing con Postman](#-testing-con-postman)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Notas Adicionales](#-notas-adicionales)

---

## 🛠️ Stack Técnico

| Tecnología       | Uso                                 |
| ---------------- | ----------------------------------- |
| **Node.js**      | Runtime JavaScript                  |
| **Express 5**    | Framework HTTP                      |
| **TypeScript**   | Tipado estático                     |
| **PostgreSQL**   | Base de datos relacional (Supabase) |
| **Sequelize**    | ORM con soporte para migraciones    |
| **Zod**          | Validación de datos                 |
| **date-fns**     | Manipulación de fechas              |
| **jsonwebtoken** | Verificación de JWT                 |
| **http-errors**  | Manejo de errores HTTP              |

---

## ✅ Requisitos Previos

- **Node.js** 18+
- **pnpm** 8+ (o npm)
- **PostgreSQL** (o cuenta en Supabase)
- **Token JWT** del microservicio de autenticación

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/JuanPabloRiglos/backend-finanzas-sequelize.git
cd backend-finanzas-sequelize
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Copiar el archivo `.env.example` y renombrarlo a `.env`:

Editar `.env` con tus credenciales (ver sección [Variables de Entorno](#-variables-de-entorno)).

### 4. Ejecutar migraciones

```bash
pnpm migration:run
```

Este comando crea:

- Tabla `ventas` con soft delete (paranoid)
- Tabla `gastos` con soft delete (paranoid)
- Campos `usuario_id` con FK a tabla `usuarios`
- Tabla `SequelizeMeta` para tracking de migraciones

⚠️ **Nota importante sobre migraciones:**
Las migraciones se generan con extensión `.js` pero deben renombrarse manualmente a `.cjs` para que Sequelize CLI pueda ejecutarlas correctamente.

### 5. Levantar el servidor

```bash
pnpm dev
```

El servidor estará disponible en `http://localhost:3000`

---

## 🔐 Variables de Entorno

Configura las siguientes variables en tu archivo `.env`:

### Base de Datos

```env
DATABASE_URL=postgresql://[user]:[password]@[host]:5432/postgres
```

- Obtén esta URL desde tu proyecto de Supabase (Settings → Database → Connection String - Session Pooler)
- O usa tu propia instancia de PostgreSQL
- **Importante:** Debe ser la misma base de datos que usa el microservicio de autenticación

### JWT

```env
JWT_SECRET=tu_secret_super_seguro_cambiar_en_produccion
```

- **JWT_SECRET**: Debe ser **exactamente el mismo** que el del microservicio de autenticación
- Este microservicio solo verifica tokens, no los genera

### Servidor

```env
NODE_ENV=development
PORT=3000
```

- **NODE_ENV**: `development` o `production` (afecta logging y stack traces)
- **PORT**: Puerto del servidor (por defecto 3000)

---

## 📜 Scripts Disponibles

| Script      | Comando               | Descripción                                    |
| ----------- | --------------------- | ---------------------------------------------- |
| Desarrollo  | `pnpm dev`            | Inicia servidor con hot reload (nodemon + tsx) |
| Build       | `pnpm build`          | Compila TypeScript a JavaScript (`dist/`)      |
| Producción  | `pnpm start`          | Ejecuta servidor compilado                     |
| Migraciones | `pnpm migration:run`  | Aplica migraciones de Sequelize a la DB        |

---

## 🌐 Endpoints

Base URL: `http://localhost:3000/api`

⚠️ **Todos los endpoints requieren autenticación con token JWT**

### POST /api/ventas

**Crear venta**

Registra una nueva venta en el sistema. El `usuarioId` se asigna automáticamente desde el token JWT del usuario autenticado.

#### Headers Requeridos

```
Authorization: Bearer <token>
```

⚠️ **Importante:** El token debe obtenerse previamente mediante login en el microservicio de autenticación.

#### Request Body

```json
{
  "fecha": "2026-01-09",
  "categoria": "Productos",
  "monto": 1500.5,
  "descripcion": "Venta de productos electrónicos"
}
```

#### Validaciones

- **fecha**: formato YYYY-MM-DD, requerido
- **categoria**: string entre 2-100 caracteres, requerido
- **monto**: número positivo, requerido
- **descripcion**: string, opcional (puede ser null)

#### Respuesta Exitosa (201 Created)

```json
{
  "success": true,
  "message": "Venta creada con exito",
  "data": {
    "id": 8,
    "fecha": "2026-01-09",
    "categoria": "Productos",
    "monto": "1500.50",
    "descripcion": "Venta de productos electrónicos",
    "usuarioId": 1,
    "createdAt": "2026-01-13T14:41:35.705Z",
    "updatedAt": "2026-01-13T14:41:35.705Z",
    "deletedAt": null
  }
}
```

✅ El campo `usuarioId` se asigna automáticamente desde el token JWT

✅ El campo `deletedAt` es null (soft delete no aplicado)

#### Errores Posibles

**400 Bad Request** - Validación fallida

```json
{
  "success": false,
  "status": 400,
  "error": "BadRequestError",
  "message": "Errores de validacion",
  "details": {
    "fecha": "Fecha debe ser formato YYYY-MM-DD"
  }
}
```

**401 Unauthorized** - Token no proporcionado

```json
{
  "success": false,
  "status": 401,
  "error": "UnauthorizedError",
  "message": "Token no proporcionado"
}
```

**401 Unauthorized** - Token inválido o expirado

```json
{
  "success": false,
  "status": 401,
  "error": "UnauthorizedError",
  "message": "Token inválido"
}
```

---

### GET /api/ventas

**Listar ventas**

Lista todas las ventas del sistema (excluye registros con soft delete). Soporta filtros por periodo o rango de fechas.

#### Headers Requeridos

```
Authorization: Bearer <token>
```

#### Query Parameters (Opcionales)

**Filtros por periodo relativo:**

- `?periodo=hoy` → Ventas de hoy
- `?periodo=semana` → Ventas de esta semana (domingo-sábado)
- `?periodo=mes` → Ventas de este mes
- `?periodo=anual` → Ventas de este año

**Filtro por rango personalizado:**

- `?fecha_desde=YYYY-MM-DD&fecha_hasta=YYYY-MM-DD` → Rango específico

**Sin filtros:** Retorna todas las ventas

⚠️ **Nota:** Los filtros `periodo` y `fecha_desde/fecha_hasta` son excluyentes. Si se envían ambos, se prioriza el rango personalizado.

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "message": "peticion realizada con exito",
  "data": [
    {
      "id": 1,
      "fecha": "2025-01-09",
      "categoria": "Productos",
      "monto": "1500.50",
      "descripcion": "Venta de productos electrónicos",
      "usuarioId": 1,
      "createdAt": "2026-01-10T11:58:41.156Z",
      "updatedAt": "2026-01-10T11:58:41.156Z",
      "deletedAt": null
    }
  ]
}
```

✅ Los registros con `deletedAt` no null son excluidos automáticamente (soft delete)

#### Ejemplos de Uso

```bash
# Todas las ventas
GET /api/ventas

# Ventas de hoy
GET /api/ventas?periodo=hoy

# Ventas del mes actual
GET /api/ventas?periodo=mes

# Ventas en rango específico
GET /api/ventas?fecha_desde=2026-01-01&fecha_hasta=2026-01-31
```

---

### GET /api/ventas/:id

**Obtener venta por ID**

Obtiene una venta específica por su ID.

#### Headers Requeridos

```
Authorization: Bearer <token>
```

#### Path Parameters

- **id**: número entero (ID de la venta)

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "message": "peticion realizada con exito",
  "data": {
    "id": 1,
    "fecha": "2025-01-09",
    "categoria": "Productos",
    "monto": "1500.50",
    "descripcion": "Venta de productos electrónicos",
    "usuarioId": 1,
    "createdAt": "2026-01-10T11:58:41.156Z",
    "updatedAt": "2026-01-10T11:58:41.156Z",
    "deletedAt": null
  }
}
```

#### Errores Posibles

**404 Not Found** - Venta no existe o fue eliminada

```json
{
  "success": false,
  "status": 404,
  "error": "NotFoundError",
  "message": "Venta con id 19 no fue encontrada"
}
```

---

### PATCH /api/ventas/:id

**Actualizar venta**

Actualiza parcialmente una venta existente. Todos los campos son opcionales.

#### Headers Requeridos

```
Authorization: Bearer <token>
```

#### Path Parameters

- **id**: número entero (ID de la venta)

#### Request Body (todos opcionales)

```json
{
  "fecha": "2025-01-09",
  "categoria": "Productos",
  "monto": 2000.75,
  "descripcion": "Venta ACTUALIZADA - monto modificado"
}
```

⚠️ **Nota:** Solo se actualizan los campos enviados en el body. Los campos omitidos mantienen su valor actual.

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "message": "Venta actualizada",
  "data": {
    "id": 1,
    "fecha": "2025-01-09",
    "categoria": "Productos",
    "monto": "2000.75",
    "descripcion": "Venta ACTUALIZADA - monto modificado",
    "usuarioId": 1,
    "createdAt": "2026-01-10T11:58:41.156Z",
    "updatedAt": "2026-01-10T13:00:22.822Z",
    "deletedAt": null
  }
}
```

✅ El campo `updatedAt` se actualiza automáticamente

---

### DELETE /api/ventas/:id

**Eliminar venta (soft delete)**

Elimina lógicamente una venta. El registro no se borra físicamente de la base de datos, sino que se marca con `deletedAt` (timestamp actual).

#### Headers Requeridos

```
Authorization: Bearer <token>
```

#### Path Parameters

- **id**: número entero (ID de la venta)

#### Comportamiento

- ✅ Marca el registro con `deletedAt` (timestamp actual)
- ✅ El registro **NO aparece** en `GET /ventas` ni `GET /ventas/:id`
- ✅ El registro permanece en la base de datos (puede recuperarse si se implementa restore)

#### Respuesta Exitosa (204 No Content)

Sin body. La ausencia de error indica éxito.

⚠️ **Nota:** HTTP 204 No Content no devuelve body en la respuesta.

---

### POST /api/gastos

**Crear gasto**

Registra un nuevo gasto en el sistema. El `usuarioId` se asigna automáticamente desde el token JWT del usuario autenticado.

#### Headers Requeridos

```
Authorization: Bearer <token>
```

#### Request Body

```json
{
  "fecha": "2026-01-09",
  "categoria": "Operativos",
  "monto": 1500.5,
  "descripcion": "Gasto en materiales"
}
```

#### Validaciones

- **fecha**: formato YYYY-MM-DD, requerido
- **categoria**: string entre 2-100 caracteres, requerido
- **monto**: número positivo, requerido
- **descripcion**: string, opcional (puede ser null)

#### Respuesta Exitosa (201 Created)

```json
{
  "success": true,
  "message": "Gasto creado con exito",
  "data": {
    "id": 1,
    "fecha": "2026-01-09",
    "categoria": "Operativos",
    "monto": "1500.50",
    "descripcion": "Gasto en materiales",
    "usuarioId": 1,
    "createdAt": "2026-01-10T18:42:34.464Z",
    "updatedAt": "2026-01-10T18:42:34.464Z",
    "deletedAt": null
  }
}
```

---

### GET /api/gastos

**Listar gastos**

Lista todos los gastos del sistema (excluye registros con soft delete). Soporta filtros por periodo o rango de fechas.

#### Headers Requeridos

```
Authorization: Bearer <token>
```

#### Query Parameters (Opcionales)

**Filtros por periodo relativo:**

- `?periodo=hoy` → Gastos de hoy
- `?periodo=semana` → Gastos de esta semana (domingo-sábado)
- `?periodo=mes` → Gastos de este mes
- `?periodo=anual` → Gastos de este año

**Filtro por rango personalizado:**

- `?fecha_desde=YYYY-MM-DD&fecha_hasta=YYYY-MM-DD` → Rango específico

**Sin filtros:** Retorna todos los gastos

#### Ejemplos de Uso

```bash
# Todos los gastos
GET /api/gastos

# Gastos de hoy
GET /api/gastos?periodo=hoy

# Gastos del mes actual
GET /api/gastos?periodo=mes

# Gastos en rango específico
GET /api/gastos?fecha_desde=2026-01-01&fecha_hasta=2026-01-31
```

---

### GET /api/gastos/:id

**Obtener gasto por ID**

Obtiene un gasto específico por su ID.

#### Headers Requeridos

```
Authorization: Bearer <token>
```

#### Path Parameters

- **id**: número entero (ID del gasto)

---

### PATCH /api/gastos/:id

**Actualizar gasto**

Actualiza parcialmente un gasto existente. Todos los campos son opcionales.

#### Headers Requeridos

```
Authorization: Bearer <token>
```

#### Path Parameters

- **id**: número entero (ID del gasto)

⚠️ **Nota:** Solo se actualizan los campos enviados en el body. Los campos omitidos mantienen su valor actual.

---

### DELETE /api/gastos/:id

**Eliminar gasto (soft delete)**

Elimina lógicamente un gasto. El registro no se borra físicamente de la base de datos, sino que se marca con `deletedAt` (timestamp actual).

#### Headers Requeridos

```
Authorization: Bearer <token>
```

#### Path Parameters

- **id**: número entero (ID del gasto)

#### Respuesta Exitosa (204 No Content)

Sin body. La ausencia de error indica éxito.

---

### GET /api/dashboard/line-chart

**Datos agregados para gráfico**

Obtiene datos agregados por mes para visualización en gráfico de líneas. Retorna totales de ventas, gastos y balance mensual.

#### Headers Requeridos

```
Authorization: Bearer <token>
```

#### Descripción de Datos

- **ventas_por_mes**: Suma total de ventas agrupadas por mes
- **gastos_por_mes**: Suma total de gastos agrupados por mes
- **balance_por_mes**: Balance mensual (ventas - gastos)

**Agrupación:** Por mes (usando `DATE_TRUNC`)

**Período:** Todos los registros en la base de datos

#### Respuesta Exitosa (200 OK)

```json
{
  "success": true,
  "message": "peticion realizada con exito",
  "data": {
    "ventas_por_mes": [
      {
        "mes": "2025-01-01",
        "total": "3501.25"
      },
      {
        "mes": "2026-01-01",
        "total": "1500.50"
      }
    ],
    "gastos_por_mes": [
      {
        "mes": "2026-01-01",
        "total": "2000.80"
      }
    ],
    "balance_por_mes": [
      {
        "mes": "2025-01-01",
        "balance": "3501.25"
      },
      {
        "mes": "2026-01-01",
        "balance": "-500.30"
      }
    ]
  }
}
```

✅ Balance positivo indica más ventas que gastos

✅ Balance negativo indica más gastos que ventas

⚠️ **Nota:** Si un mes no tiene ventas o gastos, no aparecerá en el array correspondiente

---

### POST /api/import-json

**Importación masiva**

Permite la carga masiva de ventas y gastos desde un archivo JSON. El `usuarioId` se asigna automáticamente a todos los registros desde el token JWT del usuario autenticado.

#### Headers Requeridos

```
Authorization: Bearer <token>
```

#### Request Body

```json
{
  "ventas": [
    {
      "fecha": "2026-01-10",
      "categoria": "Productos",
      "monto": 1500.5,
      "descripcion": "Venta importada 1"
    },
    {
      "fecha": "2026-01-11",
      "categoria": "Servicios",
      "monto": 2000.0,
      "descripcion": "Venta importada 2"
    }
  ],
  "gastos": [
    {
      "fecha": "2026-01-10",
      "categoria": "Operativos",
      "monto": 500.0,
      "descripcion": "Gasto importado 1"
    }
  ]
}
```

⚠️ **Nota:** Ambos arrays (`ventas` y `gastos`) son opcionales. Podés enviar solo ventas, solo gastos, o ambos.

#### Validaciones

Los objetos dentro de cada array deben cumplir las mismas validaciones que sus endpoints individuales (POST /ventas y POST /gastos).

#### Respuesta Exitosa (201 Created)

```json
{
  "success": true,
  "message": "Importación masiva exitosa",
  "data": {
    "ventas_creadas": 2,
    "gastos_creados": 1,
    "total": 3
  }
}
```

✅ Todos los registros se crean con el `usuarioId` del token JWT

✅ Si un array está vacío o no se envía, su contador será 0

---

## 🧪 Testing con Postman

### Importar la colección

1. Abrir Postman
2. Click en **Import**
3. Seleccionar el archivo: `Backend Finanzas - Sequelize.postman_collection.json`
4. La colección incluye todos los endpoints listos para probar

### Variables de entorno en Postman

Crear un environment con:

- `base_url_finanzas`: `http://localhost:3000`
- `base_url_auth`: `http://localhost:3001`
- `token`: (se setea automáticamente después del login)

### Flujo de prueba recomendado

1. **Login en Auth** (POST `{{base_url_auth}}/api/auth/login`) → El token se guarda automáticamente
2. **Crear venta** (POST /ventas) → Verifica que se asigne usuarioId
3. **Listar ventas** (GET /ventas) → Prueba los filtros
4. **Dashboard** (GET /dashboard/line-chart) → Visualiza métricas agregadas
5. **Import masivo** (POST /import-json) → Carga múltiples registros

---

## 📁 Estructura del Proyecto

```
backend-finanzas-sequelize/
├── src/
│   ├── config/
│   │   └── database.ts              # Conexión Sequelize + PostgreSQL
│   ├── models/
│   │   ├── venta.model.ts           # Modelo Venta (class-based)
│   │   └── gasto.model.ts           # Modelo Gasto (class-based)
│   ├── controllers/
│   │   ├── ventas.controller.ts     # Handlers de endpoints ventas
│   │   ├── gastos.controller.ts     # Handlers de endpoints gastos
│   │   ├── dashboard.controller.ts  # Handlers de dashboard
│   │   └── import.masive.controller.ts # Handler de importación
│   ├── services/
│   │   ├── ventas.service.ts        # Lógica de negocio ventas
│   │   ├── gastos.service.ts        # Lógica de negocio gastos
│   │   └── dashboard.service.ts     # Agregaciones para dashboard
│   ├── middlewares/
│   │   ├── authenticate.ts          # Verificación de JWT
│   │   ├── validateSchema.ts        # Validación con Zod
│   │   └── errorHandler.ts          # Manejo global de errores
│   ├── routes/
│   │   ├── index.ts                 # Router principal
│   │   ├── ventas.routes.ts         # Rutas de /ventas
│   │   ├── gastos.routes.ts         # Rutas de /gastos
│   │   ├── dashboard.routes.ts      # Rutas de /dashboard
│   │   └── import.masive.routes.ts  # Ruta de /import-json
│   ├── dtos/
│   │   ├── venta.dto.ts             # Schemas Zod para ventas
│   │   ├── gasto.dto.ts             # Schemas Zod para gastos
│   │   └── import.masive.dto.ts     # Schema Zod para import
│   ├── types/
│   │   ├── venta.types.ts           # Tipos TypeScript ventas
│   │   ├── gasto.types.ts           # Tipos TypeScript gastos
│   │   └── custom-request.ts        # AuthenticatedRequest interface
│   ├── utils/
│   │   ├── apiResponseHelpers.ts    # Response wrappers
│   │   └── dtoMappers.ts            # Transformación DTO → Input
│   ├── app.ts                       # Configuración Express
│   └── index.ts                     # Entry point
├── migrations/
│   ├── XXXXXX-create-ventas.cjs     # Migración tabla ventas
│   ├── XXXXXX-create-gastos.cjs     # Migración tabla gastos
│   └── XXXXXX-add-usuario-id.cjs    # Migración agregar usuario_id
├── .env                             # Variables de entorno (no versionado)
├── .env.example                     # Template de variables
├── .sequelizerc                     # Config de Sequelize CLI
├── config.cjs                       # Config DB para migraciones
├── tsconfig.json                    # Config TypeScript
├── nodemon.json                     # Config Nodemon
├── package.json
└── Backend Finanzas - Sequelize.postman_collection.json
```

---

## 📝 Notas Adicionales

### Características implementadas

✅ CRUD completo de Ventas y Gastos
✅ Soft delete (paranoid) en ambas tablas
✅ Filtros de fecha (hoy, semana, mes, año, rango personalizado)
✅ Dashboard con datos agregados por mes (ventas, gastos, balance)
✅ Importación masiva desde JSON
✅ Integración JWT con microservicio de autenticación
✅ Auditoría: cada registro tiene `usuario_id` (quién lo creó)
✅ Validación con Zod en todos los endpoints
✅ Manejo de errores consistente con response wrapper
✅ Arquitectura en capas (Routes → Middleware → Controller → Service → Model)
✅ Migraciones con Sequelize CLI

### Detalles técnicos importantes

**Sequelize con TypeScript:**

- Modelos class-based con dos generics: `Model<InstanceType, CreationAttributes>`
- Uso de `InferAttributes` y `InferCreationAttributes` para type safety
- Convention `underscored: true` (camelCase en código → snake_case en DB)
- Soft delete con `paranoid: true`

**Migraciones:**

- Las migraciones se generan como `.js` pero deben renombrarse a `.cjs`
- Sequelize CLI requiere CommonJS aunque el proyecto use ESM
- Tracking en tabla `SequelizeMeta`

**Filtros de fecha:**

- Uso de `date-fns` para manipulación de fechas
- Operadores Sequelize (`Op.gte`, `Op.lte`, `Op.between`) para queries
- Filtros relativos calculados desde `new Date()` (servidor)

**Dashboard:**

- Agregaciones SQL con `DATE_TRUNC` y `SUM`
- Queries paralelas con `Promise.all`
- Cálculo de balance en memoria (JavaScript)

### Integración con microservicio Auth

Este microservicio se integra con el microservicio de autenticación mediante:

1. **JWT compartido**: Mismo `JWT_SECRET` en ambos servicios
2. **Middleware authenticate**: Copiado de Auth, verifica tokens
3. **Base de datos compartida**: Ambos usan la misma instancia PostgreSQL
4. **Campo usuario_id**: FK a tabla `usuarios` (creada por Auth)

### Fuera de alcance (mejoras futuras)

- Filtrado por usuario (actualmente todos ven todos los registros)
- Validación de propiedad en UPDATE/DELETE (cualquier usuario puede modificar cualquier registro)
- Restore de registros soft-deleted
- Paginación en listados
- Tabla de métricas (KPIs agregados)
- Búsqueda por categoría
- Exportación a CSV/Excel
- Gráficos adicionales (pie chart, bar chart)

---

## 👨‍💻 Autor

**Juan Pablo Riglos**
Prueba técnica - Posición Backend
Enero 2026

---

## 📄 Licencia

MIT
