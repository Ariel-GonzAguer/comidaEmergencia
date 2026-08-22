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

---

## Action de Vencimientos (Opcional)

### Requisitos

- **Solo funciona en el repo privado** (`comida-emergencia-mini-privado`), ya que necesita leer `db.json` que no se sube al repo público.
- La action está en `.github/workflows/vencimientos.yml`.
- Usa `nodemailer` con Gmail para enviar correos.

### Secrets requeridos

Configurar en Settings > Secrets and variables > Actions del repo privado:

| Secret       | Valor                                                       |
| ------------ | ----------------------------------------------------------- |
| `EMAIL_USER` | Correo Gmail remitente                                      |
| `EMAIL_PASS` | Contraseña de aplicación de Gmail (no la contraseña normal) |

### Qué hace

1. Se ejecuta cada sábado a las 00:00 UTC (o manualmente).
2. Lee `db.json` y calcula tres rangos de vencimiento:
   - **Mes anterior**: insumos que vencieron el mes pasado.
   - **Mes actual**: insumos que vencen este mes.
   - **Próximo mes**: insumos que vencen el mes siguiente.
3. Si hay al menos un insumo en cualquiera de los tres rangos, envía un correo con la lista agrupada por sección.
4. Si no hay ninguno, no envía nada (no genera basura).

### Formato del correo

```
Aviso de vencimientos

Vencidos (Junio 2026):
- Producto X (500 g) — venció 06-2026

Vence este mes (Julio 2026):
- Producto Y (1 kg) — vence 07-2026

Próximo mes (Agosto 2026):
- Producto Z (200 ml) — vence 08-2026

Total: 3 insumo(s).
```

### Cómo disparar manualmente

Ir a la pestaña **Actions** del repo privado > **Aviso de vencimientos** > **Run workflow**.

### Cómo clonar el repo privado

```bash
git clone https://github.com/Ariel-GonzAguer/comida-emergencia-mini-privado.git
```

> **Nota:** Se requiere acceso al repo privado. Hablar con el maintainer.
