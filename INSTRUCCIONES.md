# Instrucciones para Agentes de IA: Migración de Inventario a Base de Datos

## Propósito

Convertir el archivo `insumos-emergencia.md` (tabla markdown) a una base de datos JSON (`db.json`) que la aplicación React pueda consumir.

---

## Estructura del Archivo Fuente

El archivo `insumos-emergencia.md` contiene:

### 1. **Tabla de Símbolos** (Referencias)

| Símbolo   | Significado               |
| --------- | ------------------------- |
| `V`       | Ya vencido                |
| `*`       | Vence este año (2026)     |
| `R`       | Reponer                   |
| `PS`      | Pronto a sacar (inferido) |
| _(vacío)_ | Vence en 2027 o posterior |

### 2. **Tabla de Alimentos** (Inventario)

Columnas:

- **Producto**: Nombre del insumo (puede contener símbolos entre backticks: `R`, `*`, `V`, `PS`)
- **Cantidad / Presentación**: Formato (ej: "850g", "4x 500ml", "--" si vacío)
- **Vencimiento**: Fecha en formato "M/AAAA" (ej: "6/2026"), "no vence", o "--" si vacío
- **Calorías**: Número o "--"
- **Proteína**: Número con unidad (ej: "7", "29g") o "--"
- **Notas**: Observaciones adicionales
- **Categoría**: "Alimento", "Especia", etc.

---

## Mapeo de Datos a Estructura JSON

### Formato de Salida: `db.json`

```json
{
  "insumos": [
    {
      "id": 1,
      "nombre": "Ramen Roland",
      "cantidad": "850g",
      "unidad": "g",
      "categoria": "alimentos",
      "vencimiento": "2026-06",
      "calorias": 400,
      "proteina": 7,
      "notas": "-----",
      "simbolos": []
    }
  ],
  "simbolos": [
    {
      "codigo": "V",
      "descripcion": "Ya vencido"
    }
  ]
}
```

---

## Reglas de Mapeo

### **(A) Símbolo de Producto → Array `simbolos`**

Si el nombre contiene backticks con símbolo(s):

- `Producto nombre \`R\``→`simbolos: ["R"]`
- `Producto \`PS\``→`simbolos: ["PS"]`
- `Producto \`_\``→`simbolos: ["_"]`
- `Producto \`V\``→`simbolos: ["V"]`

**Nota**: Un producto puede tener múltiples símbolos (aunque raro).

### **(B) Vencimiento → Formato "MM-AAAA"**

Entrada formatos posibles:

- **"M/AAAA"** (ej: "6/2026") → "06-2026"
- **"MM/AAAA"** (ej: "04/2026") → "04-2026"
- **"no vence"** → Mantener como **"no vence"**
- **"--"** o vacío → Dejar como **string vacío ""**
- **"pendiente"** → Convertir a **""** (vacío)

**Algoritmo**:

```
si valor === "no vence" → "no vence"
si valor === "--" o vacío → ""
si contiene "/" → split por "/" → [mes, año] → año + "-" + mes.padStart(2, "0")
```

### **(C) Cantidad y Unidad**

Separar cantidad de unidad:

- **"850g"** → cantidad: "850", unidad: "g"
- **"4x 500ml"** → cantidad: "4x 500", unidad: "ml"
- **"1 kg"** → cantidad: "1", unidad: "kg"
- **"--"** → cantidad: "", unidad: ""

### **(D) Calorías y Proteína**

- Convertir a número si es número puro
- Si contiene "kcal" → extraer número
- Si es "100kcal" → 100
- Si contiene unidad (ej: "7g", "8") → extraer número
- Si es "--" o vacío → `null`

### **(E) Categoría**

- Si está en tabla "Alimentos" → **"alimentos"**

### **(F) ID**

- Auto-incrementar: 1, 2, 3, ... (en orden de aparición en MD)

---

## Estructura Completa de `db.json`

```json
{
  "insumos": [
    {
      "id": 1,
      "nombre": "Ramen Roland",
      "cantidad": "850",
      "unidad": "g",
      "categoria": "alimentos",
      "vencimiento": "2026-06",
      "calorias": 400,
      "proteina": 7,
      "notas": "-----",
      "simbolos": []
    },
    {
      "id": 2,
      "nombre": "Ramen MAMA",
      "cantidad": "",
      "unidad": "",
      "categoria": "alimentos",
      "vencimiento": "",
      "calorias": null,
      "proteina": null,
      "notas": "-----",
      "simbolos": ["R"]
    },
    {
      "id": 3,
      "nombre": "Aplicadores de madera",
      "cantidad": "100",
      "unidad": "piezas",
      "categoria": "higiene",
      "vencimiento": "",
      "calorias": null,
      "proteina": null,
      "notas": "",
      "simbolos": []
    }
  ],
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

---

## Validaciones

✓ **Validar**:

1. Todos los ID son únicos y secuenciales
2. Vencimientos en formato "MM-AAAA" o "no vence" o vacío
3. Calorías y proteína son números o `null`
4. Símbolos solo contienen códigos válidos: "V", "\*", "R", "PS"
5. Categoría es "alimentos", "bebidas", "higiene", etc. (según tabla)
6. Campo "nombre" NO contiene backticks (fueron extraídos a "simbolos")

⚠ **Notas adicionales**:

- Si un vencimiento es inválido o no parseable → dejar vacío ""
- Si un valor numérico no se puede convertir → usar `null`
- Limpiar espacios en blanco al inicio/final de strings

---

## Ejemplo de Transformación Paso a Paso

### Fila original:

```
| Ramen MAMA `R` | -- | -- | -- | -- | ----- |
```

### Procesamiento:

1. **Nombre**: "Ramen MAMA `R`"
   - Extraer símbolo: "R"
   - Nombre limpio: "Ramen MAMA"

2. **Símbolos**: ["R"]

3. **Cantidad/Unidad**: "--" → cantidad: "", unidad: ""

4. **Vencimiento**: "--" → ""

5. **Calorías/Proteína**: "--" → `null`

### JSON resultado:

```json
{
  "id": 2,
  "nombre": "Ramen MAMA",
  "cantidad": "",
  "unidad": "",
  "categoria": "alimentos",
  "vencimiento": "",
  "calorias": null,
  "proteina": null,
  "notas": "-----",
  "simbolos": ["R"]
}
```

---

## Checklist de Ejecución

- [ ] Parsear tabla "Alimentos" del MD
- [ ] Parsear tabla "Productos no alimenticios" del MD
- [ ] Para cada fila:
  - [ ] Extraer nombre y símbolos (remover backticks)
  - [ ] Convertir vencimiento al formato "MM-AAAA"
  - [ ] Separar cantidad y unidad
  - [ ] Convertir calorías/proteína a números o `null`
  - [ ] Asignar categoría
  - [ ] Generar ID incremental
- [ ] Validar toda la estructura
- [ ] Guardar en `db.json` con formato indentado
- [ ] Verificar que la app pueda cargar y renderizar sin errores

---

## Notas Finales

- Este proceso es **determinista**: mismo MD → mismo JSON
- Se puede ejecutar múltiples veces sin efectos secundarios
- El archivo `db.json` resultante debe ser válido JSON (sin comentarios)
- La aplicación React consume directamente este JSON vía API o import
