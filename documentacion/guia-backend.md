# Guía del Backend: Servidor Express

## Descripción General

El backend es un **servidor Express** que corre en el **puerto 3001** y proporciona una API REST para gestionar un inventario de insumos de emergencia.

### Características clave:

- **Sin base de datos**: Lee y escribe directamente en archivos JSON (`db.json`)
- **Síncrono**: Operaciones de lectura/escritura son síncronas para garantizar consistencia
- **Auto-exportación**: Mantiene un archivo markdown actualizado (`insumos-emergencia.md`)
- **CORS habilitado**: Permite solicitudes desde el frontend en `localhost:5173`

---

## Arquitectura del Servidor

### Stack

- **Express 5.2.1** — Framework web minimalista
- **CORS** — Middleware para permitir solicitudes cross-origin
- **Node.js 22.17.1** — Runtime

### Estructura de archivos

```
server/
├── index.js         ← Servidor API REST (production)
└── index.test.js    ← Tests unitarios e integración (Vitest + Supertest)
```

---

## Base de datos: db.json

La base de datos es un archivo JSON con **3 colecciones**:

```json
{
  "insumos": [
    {
      "id": "UUID",
      "nombre": "string",
      "cantidad": "string (ej: 2x 500)",
      "unidad": "string (ej: g, ml, kg)",
      "categoria": "string",
      "vencimiento": "string (MM-AAAA o no vence)",
      "calorias": "number | null",
      "proteina": "number | null",
      "notas": "string",
      "simbolos": "string[]",
      "creadoEn": "ISO 8601 string",
      "actualizadoEn": "ISO 8601 string"
    }
  ],
  "categorias": ["alimentos", "especias", "bebidas", "higiene", "otros", "medicamentos"],
  "simbolos": [
    {
      "codigo": "V",
      "descripcion": "Ya vencido (fecha anterior a 2026)"
    },
    {
      "codigo": "*",
      "descripcion": "Vence este año (durante el 2026)"
    },
    {
      "codigo": "R",
      "descripcion": "Reponer"
    },
    {
      "codigo": "PS",
      "descripcion": "Pronto a sacar (Reponer inferido)"
    }
  ]
}
```

### Campos de un insumo

| Campo           | Tipo           | Obligatorio | Descripción                            |
| --------------- | -------------- | ----------- | -------------------------------------- |
| `id`            | UUID           | ✓           | Generado automáticamente               |
| `nombre`        | string         | ✓           | Nombre del producto                    |
| `cantidad`      | string         | ✗           | Ej: "2x 500", "1"                      |
| `unidad`        | string         | ✗           | Ej: "g", "ml", "kg"                    |
| `categoria`     | string         | ✓           | Debe existir en `categorias`           |
| `vencimiento`   | string         | ✗           | Formato `MM-AAAA` o `"no vence"`       |
| `calorias`      | number \| null | ✗           | kcal por porción                       |
| `proteina`      | number \| null | ✗           | Gramos por porción                     |
| `notas`         | string         | ✗           | Observaciones libres                   |
| `simbolos`      | string[]       | ✗           | Códigos de símbolos (ej: `["V", "*"]`) |
| `creadoEn`      | ISO 8601       | ✓           | Auto-generado                          |
| `actualizadoEn` | ISO 8601       | ✓           | Auto-actualizado                       |

---

## API REST

### Base URL

```
http://localhost:3001
```

### Endpoints

#### ▸ GET /api/insumos

**Devuelve la lista de insumos** (opcionalmente filtrada).

**Query Parameters:**

- `categoria` (string) — Filtra por categoría. Usar `"todas"` para listar todas
- `texto` (string) — Búsqueda por coincidencia parcial en el nombre (case-insensitive)

**Ejemplo:**

```bash
# Todos los insumos
curl http://localhost:3001/api/insumos

# Filtrar por categoría
curl "http://localhost:3001/api/insumos?categoria=alimentos"

# Buscar por texto
curl "http://localhost:3001/api/insumos?texto=arroz"

# Combinado
curl "http://localhost:3001/api/insumos?categoria=higiene&texto=jabón"
```

**Respuesta:**

```json
{
  "success": true,
  "data": [
    {
      "id": "abc-123...",
      "nombre": "Arroz blanco",
      "cantidad": "2x 500",
      "unidad": "g",
      "categoria": "alimentos",
      "vencimiento": "12-2026",
      "calorias": 130,
      "proteina": 2.7,
      "notas": "Almacenar en lugar frío y seco",
      "simbolos": ["*"],
      "creadoEn": "2026-03-14T10:30:00.000Z",
      "actualizadoEn": "2026-03-14T10:30:00.000Z"
    }
  ]
}
```

---

#### ▸ GET /api/insumos/:id

**Obtiene un insumo específico por su UUID**.

**Parámetros:**

- `:id` (UUID) — Identificador único del insumo

**Ejemplo:**

```bash
curl http://localhost:3001/api/insumos/abc-123...
```

**Respuesta (200):**

```json
{
  "success": true,
  "data": {/* insumo completo */}
}
```

**Respuesta si no existe (404):**

```json
{
  "success": false,
  "error": "No encontrado"
}
```

---

#### ✓ POST /api/insumos

**Crea un nuevo insumo**.

**Body:**

```json
{
  "nombre": "Leche en polvo",
  "cantidad": "3x 1",
  "unidad": "kg",
  "categoria": "alimentos",
  "vencimiento": "06-2027",
  "calorias": 496,
  "proteina": 26,
  "notas": "Marca: Nestle",
  "simbolos": []
}
```

**Campos requeridos:**

- `nombre` — ✓ Obligatorio

**Campos opcionales:**

- `cantidad`, `unidad`, `categoria`, `vencimiento`, `calorias`, `proteina`, `notas`, `simbolos`

**El servidor genera automáticamente:**

- `id` — UUID v4
- `creadoEn` — Fecha ISO actual
- `actualizadoEn` — Fecha ISO actual

**Respuesta (201):**

```json
{
  "success": true,
  "data": {/* insumo creado con id y timestamps */}
}
```

**Error (400):** Si falta el campo `nombre`

```json
{
  "success": false,
  "error": "El campo \"nombre\" es obligatorio"
}
```

---

#### ↻ PUT /api/insumos/:id

**Actualiza parcialmente un insumo existente**.

**Parámetros:**

- `:id` (UUID) — ID del insumo a actualizar

**Body:** Cualquier subconjunto de campos

```json
{
  "cantidad": "4x 1",
  "vencimiento": "08-2027"
}
```

**Comportamiento:**

- Solo modifica los campos enviados
- Preserva los demás campos
- Actualiza automáticamente `actualizadoEn`

**Respuesta (200):**

```json
{
  "success": true,
  "data": {/* insumo actualizado */}
}
```

**Error (404):** Si el insumo no existe

```json
{
  "success": false,
  "error": "No encontrado"
}
```

---

#### ✗ DELETE /api/insumos/:id

**Elimina un insumo por su UUID**.

**Parámetros:**

- `:id` (UUID) — ID del insumo a eliminar

**Ejemplo:**

```bash
curl -X DELETE http://localhost:3001/api/insumos/abc-123...
```

**Respuesta (200):**

```json
{
  "success": true,
  "data": {/* insumo eliminado */}
}
```

**Error (404):** Si no existe

```json
{
  "success": false,
  "error": "No encontrado"
}
```

---

#### ▸ GET /api/categorias

**Devuelve la lista de categorías disponibles**.

**Ejemplo:**

```bash
curl http://localhost:3001/api/categorias
```

**Respuesta:**

```json
{
  "success": true,
  "data": ["alimentos", "especias", "bebidas", "higiene", "otros"]
}
```

---

#### ▪ GET /api/simbolos

**Devuelve los símbolos disponibles** (con descripciones).

**Ejemplo:**

```bash
curl http://localhost:3001/api/simbolos
```

**Respuesta:**

```json
{
  "success": true,
  "data": [
    {
      "codigo": "V",
      "descripcion": "Vencido"
    },
    {
      "codigo": "*",
      "descripcion": "Vence este año"
    },
    {
      "codigo": "R",
      "descripcion": "Reponer"
    },
    {
      "codigo": "PS",
      "descripcion": "Pronto sacar"
    }
  ]
}
```

---

## Funciones auxiliares (Helpers)

### readDB()

Lee y parsea el archivo `db.json` de forma síncrona.

```javascript
const db = readDB();
// Returns: { insumos: Array, categorias: Array, simbolos: Array }
```

### writeDB(data)

Serializa y escribe el objeto `db` en `db.json` con format pretty (2 espacios).

```javascript
writeDB(db);
```

### writeMD(insumos)

Regenera automáticamente el archivo `insumos-emergencia.md` a partir de la lista actual de insumos.

**Estructura generada:**

- Encabezado con referencias de símbolos
- Tabla de alimentos (todas menos "higiene")
- Tabla de productos no alimenticios ("higiene")

Se ejecuta automáticamente al:

- ✓ Crear un insumo (POST)
- ✓ Actualizar un insumo (PUT)
- ✓ Eliminar un insumo (DELETE)

---

## Flujo de una solicitud CRUD

### 1. GET /api/insumos (lectura)

```
Cliente → Route Handler → readDB() → JSON.parse → Respuesta JSON
```

### 2. POST /api/insumos (creación)

```
Cliente → Validación (nombre) → Generate UUID → readDB() →
Agregar a db.insumos → writeDB() → writeMD() → Respuesta
```

### 3. PUT /api/insumos/:id (actualización)

```
Cliente → readDB() → Buscar por ID → Merge campos →
Update timestamp → writeDB() → writeMD() → Respuesta
```

### 4. DELETE /api/insumos/:id (eliminación)

```
Cliente → readDB() → Buscar por ID → Remove →
writeDB() → writeMD() → Respuesta
```

---

## Manejo de errores

### Niveles de error

| Código  | Situación                            | Ejemplo                       |
| ------- | ------------------------------------ | ----------------------------- |
| **200** | Operación exitosa (GET, PUT, DELETE) | Insumo encontrado/actualizado |
| **201** | Recurso creado exitosamente          | POST exitoso                  |
| **400** | Error en validación de entrada       | Falta campo obligatorio       |
| **404** | Recurso no encontrado                | GET/PUT/DELETE de ID inválido |
| **500** | Error interno del servidor           | Archivo JSON corrupto         |

### Formato de error

Todos los errores devuelven:

```json
{
  "success": false,
  "error": "Descripción del error"
}
```

---

## Variables de entorno

No se requieren variables de entorno. El servidor usa valores por defecto:

| Variable   | Default | Descripción                            |
| ---------- | ------- | -------------------------------------- |
| `PORT`     | 3001    | Puerto de escucha                      |
| `NODE_ENV` | -       | Si es `"test"`, no arranca el servidor |

---

## Ejecución

### Desarrollo

```bash
# Desde la raíz
pnpm server

# O simultáneamente con el cliente
pnpm dev
```

### Tests

```bash
# Ejecutar suite completa
pnpm test:run

# Watch mode
pnpm test
```

---

## Notas técnicas

### Por qué lectura/escritura síncrona

1. **Simplicidad**: No hay necesidad de manejar Promises/async
2. **Consistencia**: Una sola fuente de verdad (db.json)
3. **Escalabilidad**: Proyecto pequeño sin millones de operaciones

⚠ Para producción con miles de registros, considerar una DB real (PostgreSQL, MongoDB).

### Sincronización con markdown

El archivo `insumos-emergencia.md` se regenera en **CADA operación CRUD**. Esto permite:

- ✓ Exportar inventario a Markdown
- ✓ Mantener referencias siempre actualizadas
- ✓ Uso offline del documento

---

## Integración con frontend

El frontend (`client/`) se conecta con el servidor a través del hook `useInsumos`.

**Proxy en Vite:**

```javascript
// client/vite.config.js
proxy: {
  '/api': 'http://localhost:3001'
}
```

Esto permite que el frontend en `localhost:5173` haga requests a `/api/*` y se redirijan automáticamente a `localhost:3001/api/*`.

---

## Ejemplo completo: Agregar un insumo

### 1. Frontend envía solicitud

```javascript
const response = await fetch('/api/insumos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nombre: 'Agua embotellada',
    cantidad: '24',
    unidad: 'botellas',
    categoria: 'bebidas',
    vencimiento: 'no vence',
  }),
});
```

### 2. Backend procesa

- Valida que `nombre` no esté vacío
- Genera UUID: `"f47ac10b-58cc-4372-a567-0e02b2c3d479"`
- Crea timestamps: `"2026-03-14T15:30:45.123Z"`
- Agrega a `db.insumos`
- Guarda en `db.json`
- Regenera `insumos-emergencia.md`

### 3. Frontend recibe

```json
{
  "success": true,
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "nombre": "Agua embotellada",
    "cantidad": "24",
    "unidad": "botellas",
    "categoria": "bebidas",
    "vencimiento": "no vence",
    "calorias": null,
    "proteina": null,
    "notas": "",
    "simbolos": [],
    "creadoEn": "2026-03-14T15:30:45.123Z",
    "actualizadoEn": "2026-03-14T15:30:45.123Z"
  }
}
```

### 4. Frontend muestra en tabla

El hook `useInsumos` actualiza el estado local y la tabla se re-renderiza automáticamente.
