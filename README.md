# Comida Emergencia Mini

[![StandWithPalestine](https://raw.githubusercontent.com/Safouene1/support-palestine-banner/master/StandWithPalestine.svg)](https://techforpalestine.org/learn-more)
![Static Badge](https://img.shields.io/badge/100%25_Offline-brightgreen)
![Static Badge](https://img.shields.io/badge/MI_T+_Commons_Clause-red)

Comida Emergencia Mini es la tercera versión (3.0.0) de este proyecto, y es una aplicación Web de Código Abierto / Open Source para gestionar recursos en emergencias.
(Ahora) Funciona **completamente offline**: el frontend corre en el navegador y el backend es un servidor Express local que lee y escribe un archivo `db.json` (y un archivo markdown) dentro del mismo repositorio.

## Stack tecnológico

| Capa     | Tecnología                 | Versión |
| -------- | -------------------------- | ------- |
| Frontend | React + JSX                | 18.2.0  |
| Estilos  | Tailwind CSS (plugin Vite) | 4.2.1   |
| Bundler  | Vite                       | 5.4.21  |
| Backend  | Express                    | 4.22.1  |
| Runtime  | Node.js                    | 22.17.1 |
| Gestor   | pnpm                       | 10.30.3 |

---

## Estructura del proyecto

```
.
├── db.json                     ← Base de datos (JSON plano, editable a mano)
├── server/
│   └── index.js                ← API REST (Express, puerto 3001)
├── client/
│   ├── vite.config.js          ← Configuración de Vite + proxy /api
│   ├── src/
│   │   ├── main.jsx            ← Punto de entrada (monta <App />)
│   │   ├── App.jsx             ← Componente raíz (orquesta UI + hook)
│   │   ├── index.css           ← Tailwind + variables CSS + badges
│   │   ├── components/
│   │   │   ├── Header.jsx      ← Encabezado fijo + botón "+ nuevo"
│   │   │   ├── FilterBar.jsx   ← Búsqueda por texto (atajo /) y categoría
│   │   │   ├── InsumoTable.jsx ← Tabla con badges, fechas coloreadas y acciones
│   │   │   ├── InsumoModal.jsx ← Formulario modal crear / editar
│   │   │   ├── DeleteConfirm.jsx ← Diálogo de confirmación de eliminación
│   │   │   └── Toast.jsx       ← Notificaciones efímeras
│   │   └── hooks/
│   │       └── useInsumos.js   ← Hook CRUD – toda la lógica de peticiones
│   └── public/
├── package.json                ← Scripts dev / server / client
├── documentación/                 ← Documentos extra para entender el proyecto
├── insumos-emergencia.md         ← Exportación markdown de insumos de emergencia
├── INSTRUCCIONES.md                 ← Instrucciones para que agente de IA cree la BBDD a partir del markdown `insumos-emergencia.md`
└── README.md
```

---

## Inicio rápido

Requiere **Node.js ≥ 18** y **pnpm**.

```bash
# 1. Instalar dependencias (sólo la primera vez)
pnpm install
cd client && pnpm install && cd ..

# 2. Levantar servidor + cliente simultáneamente
pnpm dev
```

| Servicio | URL                       |
| -------- | ------------------------- |
| Frontend | http://localhost:5173     |
| API REST | http://localhost:3001/api |

### Scripts disponibles

| Script    | Comando                     | Descripción                            |
| --------- | --------------------------- | -------------------------------------- |
| `dev`     | `pnpm dev`                  | Levanta Express + Vite concurrently    |
| `server`  | `pnpm server`               | Solo el servidor Express (port 3001)   |
| `client`  | `pnpm client`               | Solo el dev server de Vite (port 5173) |
| `build`   | `cd client && pnpm build`   | Build de producción del frontend       |
| `preview` | `cd client && pnpm preview` | Preview del build de producción        |

---

## La base de datos: `db.json`

Es un archivo JSON plano con tres colecciones:

```jsonc
{
  "insumos": [
    /* array de items */
  ],
  "categorias": ["alimentos", "especias", "bebidas", "higiene", "otros"],
  "simbolos": [
    { "codigo": "V", "descripcion": "Vencido" },
    { "codigo": "*", "descripcion": "Vence este año" },
    { "codigo": "R", "descripcion": "Reponer" },
    { "codigo": "PS", "descripcion": "Pronto  sacar" },
  ],
}
```

> **Nota:** El servidor lee el archivo en cada petición GET, así que cualquier edición manual surte efecto inmediatamente sin reiniciar.

### Estructura de un insumo

| Campo           | Tipo            | Descripción                                  |
| --------------- | --------------- | -------------------------------------------- |
| `id`            | string (UUID)   | Identificador único generado automáticamente |
| `nombre`        | string          | Nombre del producto (**obligatorio**)        |
| `cantidad`      | string          | Ej: `"2x 500"`, `"1"`                        |
| `unidad`        | string          | Ej: `"g"`, `"ml"`, `"kg"`                    |
| `categoria`     | string          | Una de las categorías definidas en `db.json` |
| `vencimiento`   | string          | Formato `"MM-AAAA"` o `"no vence"`           |
| `calorias`      | number \| null  | kcal por porción                             |
| `proteina`      | number \| null  | Gramos de proteína por porción               |
| `notas`         | string          | Observaciones libres                         |
| `simbolos`      | string[]        | Array de códigos: `["V", "*"]`               |
| `creadoEn`      | ISO 8601 string | Fecha de creación (auto)                     |
| `actualizadoEn` | ISO 8601 string | Última modificación (auto)                   |

---

## API REST

**Base URL:** `http://localhost:3001`

### Insumos

| Método | Ruta               | Descripción                      | Query params            |
| ------ | ------------------ | -------------------------------- | ----------------------- |
| GET    | `/api/insumos`     | Lista todos los insumos          | `?texto=` `?categoria=` |
| GET    | `/api/insumos/:id` | Obtiene un insumo por UUID       | —                       |
| POST   | `/api/insumos`     | Crea un nuevo insumo             | —                       |
| PUT    | `/api/insumos/:id` | Actualiza parcialmente un insumo | —                       |
| DELETE | `/api/insumos/:id` | Elimina un insumo                | —                       |

### Catálogos

| Método | Ruta              | Descripción                      |
| ------ | ----------------- | -------------------------------- |
| GET    | `/api/categorias` | Lista las categorías disponibles |
| GET    | `/api/simbolos`   | Lista los símbolos disponibles   |

### Ejemplos de uso con cURL

```bash
# Listar insumos filtrados por categoría
curl "http://localhost:3001/api/insumos?categoria=alimentos"

# Crear un nuevo insumo
curl -X POST http://localhost:3001/api/insumos \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Arroz blanco", "cantidad": "2x 500", "unidad": "g", "categoria": "alimentos"}'

# Actualizar un insumo
curl -X PUT http://localhost:3001/api/insumos/<UUID> \
  -H "Content-Type: application/json" \
  -d '{"cantidad": "3x 500"}'

# Eliminar un insumo
curl -X DELETE http://localhost:3001/api/insumos/<UUID>
```

---

## Arquitectura del frontend

```
App.jsx                          ← Estado UI (modal, toast, confirmDelete)
├── Header.jsx                   ← Encabezado fijo + contador + botón nuevo
├── FilterBar.jsx                ← Búsqueda texto (atajo /) + chips categoría
├── InsumoTable.jsx              ← Tabla de insumos
│   ├── SimboloBadge (interno)   ← Badge de símbolo con color
│   └── VencimientoCell (interno)← Fecha con color según proximidad
├── InsumoModal.jsx              ← Formulario modal (crear/editar)
├── DeleteConfirm.jsx            ← Diálogo de confirmación
└── Toast.jsx                    ← Notificación efímera

hooks/useInsumos.js              ← Hook CRUD centralizado
```

### Hook `useInsumos`

Centraliza _toda_ la comunicación con la API. Expone:

| Propiedad / Método            | Tipo                                | Descripción                           |
| ----------------------------- | ----------------------------------- | ------------------------------------- |
| `insumos`                     | `Insumo[]`                          | Lista de insumos (reactiva a filtros) |
| `categorias`                  | `string[]`                          | Categorías cargadas desde la API      |
| `simbolos`                    | `Simbolo[]`                         | Símbolos cargados desde la API        |
| `loading`                     | `boolean`                           | Indicador de carga                    |
| `error`                       | `string \| null`                    | Último mensaje de error               |
| `filtros` / `setFiltros`      | `Filtros`                           | Filtros activos (categoría + texto)   |
| `crearInsumo(datos)`          | `(Object) => Promise<void>`         | Crea un insumo y recarga la lista     |
| `actualizarInsumo(id, datos)` | `(string, Object) => Promise<void>` | Actualiza y recarga                   |
| `eliminarInsumo(id)`          | `(string) => Promise<void>`         | Elimina y recarga                     |

### Atajos de teclado

| Tecla    | Contexto      | Acción                      |
| -------- | ------------- | --------------------------- |
| `/`      | Global        | Enfoca el campo de búsqueda |
| `Escape` | Modal abierto | Cierra el modal activo      |

### Colores de vencimiento

| Color          | Clase CSS        | Condición                |
| -------------- | ---------------- | ------------------------ |
| Gris           | `fecha-ok`       | Vence en > 12 meses      |
| Amarillo       | `fecha-este-año` | Vence dentro de 12 meses |
| Naranja        | `fecha-pronto`   | Vence en ≤ 3 meses       |
| Rojo + tachado | `fecha-vencida`  | Ya venció                |

---

## Cómo hacer modificaciones

### Agregar una categoría

Editar `db.json` directamente y añadir el string al array `categorias`:

```json
"categorias": ["alimentos", "especias", "bebidas", "higiene", "otros", "nueva-categoria"]
```

### Agregar un símbolo

1. Editar `db.json` y añadir un objeto al array `simbolos`:

   ```json
   { "codigo": "AB", "descripcion": "Descripción del símbolo" }
   ```

2. Añadir la clase CSS correspondiente en `client/src/index.css`:

   ```css
   .sym-ab {
     background: #1a2a40;
     color: #60a0e0;
   }
   ```

3. Registrar la clase en el mapa `SIMBOLO_CLASS` de `InsumoTable.jsx`:

   ```js
   AB: 'sym sym-ab',
   ```

### Agregar campos al formulario

1. Agregar el campo al objeto `VACIO` en `InsumoModal.jsx`
2. Añadir el campo al `useEffect` que carga `insumoInicial`
3. Agregar el input en el JSX del formulario
4. Actualizar el array `campos` en el handler `PUT` de `server/index.js`
5. Agregar el valor por defecto en el handler `POST` de `server/index.js`

---

## Personas que han colaborado en el proyecto:

@Ariel-GonzAguer — Propietario / Mantenedor
@lianyvar — Colaboradora
@mvlsqz — Colaborador
@nadir-ammisaid — Colaborador
@astrobot-houston — Bot (automatización)

---

## Objetivos del proyecto

- Facilitar la gestión y organización de recursos esenciales en situaciones de emergencia.
- Permitir el acceso y la colaboración de cualquier persona, comunidad o institución, promoviendo el software libre y abierto.
- Ofrecer una interfaz totalmente funcional sin internet, garantizando su utilidad en contextos de crisis donde la conectividad puede ser limitada o inexistente.
- Fomentar la participación y mejora continua por parte de la comunidad.

---

## Proyecto Código Abierto / Open Source (AGPL-3)

Este proyecto es Código Abierto bajo licencia AGPL-3. Puede usarlo, modificarlo y compartirlo respetando los términos de la licencia. Aceptamos issues y pull requests.

- Lea: CONTRIBUTING.md y CODE_OF_CONDUCT.md
- Lea los archivos en /documentación.
- Licencia: LICENCE.txt
