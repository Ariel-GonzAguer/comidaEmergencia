# Comida Emergencia Mini

[![StandWithPalestine](https://raw.githubusercontent.com/Safouene1/support-palestine-banner/master/StandWithPalestine.svg)](https://techforpalestine.org/learn-more)
![Static Badge](https://img.shields.io/badge/100%25_Offline-brightgreen)
![Static Badge](https://img.shields.io/badge/MIT+CommonsClause-red?label=Licencia)

Comida Emergencia Mini es la más reciente versión de este proyecto, y es una aplicación con licencia `MIT + CommonsClause` para gestionar recursos en emergencias.
(Ahora) Funciona **completamente offline**: el frontend corre en el navegador y el backend es un servidor Express local que lee y escribe un archivo `db.json` (y un archivo markdown) dentro del mismo repositorio.

## Stack tecnológico

| Capa     | Tecnología         | Versión       |
| -------- | ------------------ | ------------- |
| Frontend | React              | 19.2.4        |
| Estilos  | Tailwind CSS       | 4.2.1         |
| Bundler  | Vite               | 8.0.0         |
| Backend  | Express            | 5.2.1         |
| Runtime  | Node.js            | 22.17.1       |
| Gestor   | pnpm               | 10.30.3       |
| Pruebas  | Vitest + Supertest | 4.1.0 + 7.2.2 |

---

## Pruebas (Testing)

El proyecto cuenta con una suite completa de pruebas unitarias y de integración para garantizar la estabilidad de los datos y la interfaz.

- **Frontend:** Vitest + React Testing Library (Pruebas de componentes y hooks).
- **Backend:** Vitest + Supertest (Pruebas de la API REST con mocks de `fs`).

```bash
# Ejecutar pruebas del servidor
pnpm test

# Ejecutar pruebas del cliente
cd client && pnpm test
```

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

### Scripts disponibles en raíz

| Script          | Comando                                                | Descripción                                                      |
| --------------- | ------------------------------------------------------ | ---------------------------------------------------------------- |
| `server`        | `node server/index.js`                                 | Inicia solo el servidor Express (puerto 3001)                    |
| `client`        | `pnpm --filter comida-emergencia-mini-cliente run dev` | Inicia solo el dev server de Vite (puerto 5173)                  |
| `dev`           | `concurrently "pnpm run server" "pnpm run client"`     | Levanta servidor Express + dev server Vite simultáneamente       |
| `test`          | `vitest`                                               | Ejecuta pruebas en modo watch (cliente + servidor)               |
| `test:run`      | `vitest run`                                           | Ejecuta pruebas una sola vez (modo CI)                           |
| `prettierCheck` | `prettier --check .`                                   | Verifica formato de código sin modificar                         |
| `prettierFix`   | `prettier --write .`                                   | Corrige el formato de código automáticamente                     |
| `lint`          | `eslint . --ext .js,.jsx,.ts,.tsx`                     | Ejecuta linter para verificar reglas de código (client + server) |

---

## La base de datos: `db.json`

Es un archivo JSON plano con tres colecciones, todas extensibles:

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

| Color          | Clase CSS         | Condición                |
| -------------- | ----------------- | ------------------------ |
| Gris           | `fecha-ok`        | Vence en > 12 meses      |
| Amarillo       | `fecha-este-anio` | Vence dentro de 12 meses |
| Naranja        | `fecha-pronto`    | Vence en ≤ 3 meses       |
| Rojo + tachado | `fecha-vencida`   | Ya venció                |

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
   .simbolo-ab {
     background: #1a2a40;
     color: #60a0e0;
   }
   ```

3. Registrar la clase en el mapa `SIMBOLO_CLASS` de `InsumoTable.jsx`:

   ```js
   AB: 'simbolo simbolo-ab',
   ```

### Agregar campos al formulario

1. Agregar el campo al objeto `VACIO` en `InsumoModal.jsx`.
2. Añadir el campo al `useEffect` que carga `insumoInicial`.
3. Agregar el input en el JSX del formulario.
4. Actualizar el array `campos` en el handler `PUT` de `server/index.js`.
5. Agregar el valor por defecto en el handler `POST` de `server/index.js`.

---

### Automatización (Actions)

Se han configurado flujos de GitHub Actions para mantener la calidad del código en cada Pull Request a `main` y `mini`:

- **Test:** Ejecución obligatoria de la suite completa de pruebas.
- **Lint:** Validación de reglas de código con ESLint.
- **Audit:** Auditoría de seguridad de dependencias (`pnpm audit`).
- **Prettier:** Verificación de formato automático.

**Nota importante para desarrolladores del servidor:**
No elimine la condición `if (process.env.NODE_ENV !== 'test')` en `server/index.js`, ya que es necesaria para que la suite de pruebas pueda importar la aplicación sin bloquear el puerto real.

---

## Personas que han colaboradoen el proyecto:

- @Ariel-GonzAguer — Propietario / Mantenedor
- @lianyvar — Colaboradora
- @mvlsqz — Colaborador
- @nadir-ammisaid — Colaborador

---

## Objetivos del proyecto

- Facilitar la gestión y organización de recursos esenciales en situaciones de emergencia.
- Permitir el acceso y la colaboración de cualquier persona, comunidad o institución.
- Ofrecer una interfaz totalmente funcional sin internet, garantizando su utilidad en contextos de crisis donde la conectividad puede ser limitada o inexistente.
- Fomentar la participación y mejora continua por parte de la comunidad.
