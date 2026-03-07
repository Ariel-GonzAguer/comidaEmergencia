# Inventario de Emergencia

Aplicación web local para gestionar insumos de emergencia (alimentos, agua, medicamentos, etc.). Funciona **completamente offline**: el frontend corre en el navegador y el backend es un servidor Express local que lee y escribe un archivo `db.json` dentro del mismo repositorio.

---

## Estructura del proyecto

```
.
├── db.json                     ← Base de datos (JSON plano, editable a mano)
├── server/
│   └── index.js                ← API REST (Express, puerto 3001)
├── client/
│   ├── src/
│   │   ├── App.jsx             ← Componente raíz
│   │   ├── index.css           ← Tailwind + variables CSS globales
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── FilterBar.jsx   ← Búsqueda por texto y categoría
│   │   │   ├── InsumoTable.jsx ← Tabla principal con badges y fechas
│   │   │   ├── InsumoModal.jsx ← Formulario crear / editar
│   │   │   ├── DeleteConfirm.jsx
│   │   │   └── Toast.jsx
│   │   └── hooks/
│   │       └── useInsumos.js   ← Toda la lógica de peticiones a la API
│   └── vite.config.js
├── scripts/
│   └── migrate-emergencia.mjs  ← Script de migración (ver más abajo)
└── package.json
```

---

## Cómo correr el proyecto

Requiere **Node.js ≥ 18** y **pnpm**.

```bash
# 1. Instalar dependencias (sólo la primera vez)
pnpm install
cd client && pnpm install && cd ..

# 2. Levantar servidor + cliente simultáneamente
pnpm dev
```

- Frontend: http://localhost:5173  
- API:       http://localhost:3001/api

Para correr sólo uno de los dos:

```bash
pnpm server   # sólo Express
pnpm client   # sólo Vite
```

---

## La base de datos: `db.json`

Es un archivo JSON plano con tres colecciones:

```jsonc
{
  "insumos": [ /* array de items */ ],
  "categorias": ["alimentos", "especias", "bebidas", "higiene", "otros"],
  "simbolos": [
    { "codigo": "V",  "descripcion": "Vegetariano" },
    { "codigo": "*",  "descripcion": "Esencial" },
    { "codigo": "R",  "descripcion": "Requiere cocción" },
    { "codigo": "PS", "descripcion": "Para sopa" },
    { "codigo": "GY", "descripcion": "Gluten-friendly" }
  ]
}
```

### Estructura de un insumo

| Campo          | Tipo               | Descripción |
|----------------|--------------------|-------------|
| `id`           | string (UUID)      | Identificador único |
| `nombre`       | string             | Nombre del producto |
| `cantidad`     | string             | Ej: `"2x 500"`, `"1"` |
| `unidad`       | string             | Ej: `"g"`, `"ml"`, `"kg"` |
| `categoria`    | string             | Una de las categorías definidas |
| `vencimiento`  | string             | Formato `"AAAA-MM"` o `"no vence"` |
| `calorias`     | number \| null     | kcal por porción |
| `proteina`     | number \| null     | gramos de proteína por porción |
| `notas`        | string             | Observaciones libres |
| `simbolos`     | string[]           | Array de códigos: `["V", "*"]` |
| `esEmergencia` | boolean            | `true` = insumo de emergencia, `false` = no-emergencia |
| `creadoEn`     | ISO 8601 string    | Fecha de creación |
| `actualizadoEn`| ISO 8601 string    | Última modificación |

Los items con `esEmergencia: false` muestran el badge **NO-EMG** en la tabla.

---

## API REST

Base URL: `http://localhost:3001`

| Método | Ruta                  | Descripción |
|--------|-----------------------|-------------|
| GET    | `/api/insumos`        | Lista todos los insumos (acepta `?texto=` y `?categoria=`) |
| GET    | `/api/insumos/:id`    | Obtiene un insumo por ID |
| POST   | `/api/insumos`        | Crea un nuevo insumo |
| PUT    | `/api/insumos/:id`    | Actualiza un insumo existente |
| DELETE | `/api/insumos/:id`    | Elimina un insumo |
| GET    | `/api/categorias`     | Lista las categorías disponibles |
| GET    | `/api/simbolos`       | Lista los símbolos disponibles |

---

## Cómo hacer modificaciones

### Agregar una categoría

Editar `db.json` directamente y añadir el string al array `categorias`:

```json
"categorias": ["alimentos", "especias", "bebidas", "higiene", "otros", "nueva-categoria"]
```

### Agregar un símbolo

Editar `db.json` y añadir un objeto al array `simbolos`:

```json
{ "codigo": "AB", "descripcion": "Descripción del símbolo" }
```

Luego añadir la clase CSS correspondiente en `client/src/index.css`:

```css
.sym-ab { background: #1a2a40; color: #60a0e0; }
```

Y registrar la clase en el mapa `SIMBOLO_CLASS` de `InsumoTable.jsx`:

```js
AB: 'sym sym-ab',
```

### Editar items directamente en `db.json`

El servidor lee el archivo en cada petición, así que cualquier edición manual surte efecto inmediatamente (sin necesidad de reiniciar).

### Agregar campos al formulario

1. Agregar el campo al objeto `VACIO` en `InsumoModal.jsx`
2. Añadir el campo al `useEffect` que carga `insumoInicial`
3. Agregar el input en el JSX del formulario
4. Actualizar el array `campos` en el handler `PUT` de `server/index.js`
5. Agregar el valor por defecto en el handler `POST` de `server/index.js`

---

## Migración: `scripts/migrate-emergencia.mjs`

Script que asigna `esEmergencia: true/false` a todos los items existentes según el prefijo de su ID:

```bash
node scripts/migrate-emergencia.mjs
```

Los items originados en `insumos-no-emergencia.md` tienen IDs con prefijo `11111111-0002` y quedan con `esEmergencia: false`. Los demás quedan en `true`. Es seguro correrlo múltiples veces.
