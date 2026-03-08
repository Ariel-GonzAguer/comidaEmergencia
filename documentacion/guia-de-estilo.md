# Guía de estilo — Comida Emergencia Mini

Esta guía documenta las convenciones de código, diseño y accesibilidad del proyecto. Su objetivo es que nuevas personas contribuidoras puedan integrarse con rapidez y mantener la coherencia del código.

---

## Índice

1. [Principios generales](#1-principios-generales)
2. [Sistema de diseño — variables CSS](#2-sistema-de-diseño--variables-css)
3. [Tailwind CSS v4 — convenciones](#3-tailwind-css-v4--convenciones)
4. [Componentes React — estructura y patrones](#4-componentes-react--estructura-y-patrones)
5. [Accesibilidad (WCAG 2.1 AA)](#5-accesibilidad-wcag-21-aa)
6. [Documentación JSDoc](#6-documentación-jsdoc)
7. [Servidor Express — convenciones](#7-servidor-express--convenciones)
8. [Nombrado y lenguaje](#8-nombrado-y-lenguaje)
9. [Commits de Git](#9-commits-de-git)

---

## 1. Principios generales

- **Minimalismo**: no agregar código que no se necesite hoy. Sin features hipotéticas.
- **Legibilidad primero**: el código se lee más veces de las que se escribe.
- **Accesibilidad no es opcional**: toda UI debe cumplir WCAG 2.1 AA **como mínimo**.
- **Sin dependencias innecesarias**: el stack es intencionalmente pequeño. Evaluar bien antes de agregar paquetes.
- **Español en la UI, inglés en el código**: nombres de variables y funciones en inglés; textos visibles al usuario en español.

---

## 2. Sistema de diseño — variables CSS

Todas las variables de color están definidas en `client/src/index.css` dentro del bloque `@theme {}`. **No use colores hexadecimales fijos** si existe una variable para eso.

### Paleta de colores

| Variable      | Uso principal                              |
| ------------- | ------------------------------------------ |
| `--bg`        | Fondo base de la aplicación (`#0d0d0d`)    |
| `--bg1`       | Fondo secundario, filas hover (`#141414`)  |
| `--bg2`       | Fondo de modales y cards (`#1c1c1c`)       |
| `--bg3`       | Fondo de inputs y controles (`#242424`)    |
| `--edge`      | Bordes sutiles (`#2a2a2a`)                 |
| `--edge-hi`   | Bordes con más contraste (`#3a3a3a`)       |
| `--ink`       | Texto base (`#d4d0c8`)                     |
| `--ink-dim`   | Texto atenuado, placeholders (`#F1EEE8FF`) |
| `--ink-mid`   | Texto intermedio, metadatos (`#888880`)    |
| `--ink-hi`    | Texto destacado, nombres (`#e8e4d8`)       |
| `--accent`    | Color de acento dorado (`#c8a96e`)         |
| `--accent-d`  | Acento oscuro, bordes activos (`#7a6540`)  |
| `--danger`    | Fondos de error/eliminación (`#8b2020`)    |
| `--danger-hi` | Bordes de error (`#b83030`)                |
| `--ok`        | Fondos de éxito (`#2a5c3a`)                |

### Uso con Tailwind v4

```jsx
// ✓ Correcto — sintaxis v4
<div className="bg-bg2 text-ink border-edge">

// ✕ Incorrecto — sintaxis v3 antigua
<div className="bg-[var(--bg2)] text-[var(--ink)]">
```

### Badges de símbolo

Los colores de los badges se definen en CSS global, **no en Tailwind**:

| Clase CSS   | Código | Fondo     | Texto     |
| ----------- | ------ | --------- | --------- |
| `.sym-v`    | `V`    | `#5c1f1f` | `#e06060` |
| `.sym-star` | `*`    | `#4a3800` | `#c8a030` |
| `.sym-r`    | `R`    | `#1a3a5c` | `#60a0d8` |
| `.sym-ps`   | `PS`   | `#3a2a50` | `#9a70d0` |

Al agregar un símbolo nuevo: crear su clase `.sym-XX` en `index.css` y registrarla en el mapa `SIMBOLO_CLASS` de `InsumoTable.jsx`.

### Colores de vencimiento

| Clase CSS          | Condición  | Color                |
| ------------------ | ---------- | -------------------- |
| `.fecha-ok`        | > 12 meses | `--ink-mid`          |
| `.fecha-este-anio` | ≤ 12 meses | `yellow`             |
| `.fecha-pronto`    | ≤ 3 meses  | `orange`             |
| `.fecha-vencida`   | Ya vencido | `--danger` + tachado |

---

## 3. Tailwind CSS v4 — convenciones

El proyecto usa **Tailwind CSS v4** con el plugin de Vite. Las reglas de sintaxis son:

### Sintaxis de variables CSS

```jsx
// ✓ v4 — sin var(), con paréntesis
className = 'text-accent bg-bg3 border-edge';

// ✕ v3 — no usar
className = 'text-[var(--accent)]';
```

### Valores arbitrarios vs. escala de Tailwind

Preferir siempre la escala de Tailwind cuando el valor coincide exactamente:

```jsx
// ✓ Usar escala Tailwind
className = 'py-15'; // 60px
className = 'px-4.5'; // 18px
className = 'max-w-140'; // 560px
className = 'tracking-widest'; // letter-spacing: 0.1em

// ✕ Evitar valores arbitrarios cuando hay equivalente
className = 'py-[60px]';
className = 'px-[18px]';
className = 'tracking-[0.1em]';
```

Valores arbitrarios son aceptables **solo cuando no existe equivalente** en la escala (ej: `tracking-[0.12em]`, `text-[14px]`).

### Clases reutilizables con constantes

Cuando un mismo conjunto de clases se repite en múltiples elementos de un mismo componente, extraerlo a una constante en mayúsculas:

```jsx
// ✓ Patrón correcto
const INPUT = 'font-mono text-base bg-bg3 border border-edge text-ink px-2.5 py-3 rounded-sm ...'
const LABEL = 'text-base tracking-widest uppercase text-ink-mid'

<label className={LABEL}>Nombre</label>
<input className={INPUT} ... />

// ✕ Duplicar clases en cada elemento
<label className="text-base tracking-widest uppercase text-ink-mid">Nombre</label>
<label className="text-base tracking-widest uppercase text-ink-mid">Cantidad</label>
```

---

## 4. Componentes React — estructura y patrones

### Estructura de un componente

```jsx
/**
 * @file Descripción del módulo.
 * @module components/NombreComponente
 */

import { useState, useEffect } from 'react'

// 1. Constantes de módulo (UPPER_SNAKE_CASE)
const MI_CONSTANTE = 'clases tailwind...'

// 2. Funciones auxiliares puras (sin estado, locales al módulo)
function funcionAuxiliar(param) { ... }

// 3. Componente interno (si es solo usado aquí, no exportar)
function SubComponente({ prop }) { ... }

// 4. Componente principal — export default al final
/**
 * JSDoc del componente principal.
 */
export default function NombreComponente({ propA, propB }) {
  // hooks primero
  const [estado, setEstado] = useState(...)

  // handlers después
  function handleAccion() { ... }

  // render al final
  return ( ... )
}
```

### Constantes de componente

```jsx
// ✓ Constantes en UPPER_SNAKE_CASE para clases Tailwind compartidas
const TH = 'font-mono text-base font-medium tracking-[0.12em] uppercase ...';
const TD = 'px-3.5 py-2 align-middle text-base';

// ✓ Constantes en UPPER_CASE para objetos de configuración
const SIMBOLO_CLASS = {
  V: 'sym sym-v',
  '*': 'sym sym-star',
};

// ✓ Objeto de estado vacío inicial
const VACIO = {
  nombre: '',
  cantidad: '',
  categoria: 'alimentos',
  simbolos: [],
};
```

### Manejo de fechas

El **formato de almacenamiento** es `"MM-AAAA"` (ej: `"06-2027"`). La persona usuaria puede ingresar `M/AAAA`, `MM/AAAA`, `M-AAAA` o `MM-AAAA`; `toStorageDate` normaliza cualquiera de esos formatos antes de persistir:

```js
toStorageDate('4/2027'); // → '04-2027'
toStorageDate('04/2027'); // → '04-2027'
toStorageDate('04-2027'); // → '04-2027'
toStorageDate('no vence'); // → 'no vence'
```

Para mostrar la fecha en la tabla, `VencimientoCell` parsea directamente el valor `MM-AAAA` persistido.

Si se necesita procesar fechas en otro componente, reutilizar `toStorageDate` de `InsumoModal.jsx`.

### Props: callbacks con prefijo `on`

```jsx
// ✓ Callbacks con prefijo "on" y verbo descriptivo
<Componente onGuardar={fn} onCerrar={fn} onEliminar={fn} />

// ✕ Callbacks sin prefijo o con nombres genéricos
<Componente guardar={fn} cerrar={fn} />
```

### Modales — patrón llave en mano

Los modales siguen este patrón estándar:

```jsx
// - role="dialog" + aria-modal="true" + aria-labelledby
// - Focus trap con handleKeyDown
// - Cierre con Escape via useEffect
// - Cierre con clic fuera (onClick en overlay, stopPropagation en card)
// - useRef para dialogRef (trap) y closeBtnRef (foco inicial)
// - useEffect para mover foco al botón cerrar al montar
```

Ver `InsumoModal.jsx` y `DeleteConfirm.jsx` como referencia completa.

---

## 5. Accesibilidad (WCAG 2.1 AA)

La accesibilidad es **requisito**, no mejora opcional. Seguir estos patrones en toda la UI:

### Iconos y símbolos decorativos

```jsx
// ✓ Icono decorativo — ocultar del SR
<span aria-hidden="true">✎</span>
<span aria-hidden="true">✕</span>
<span aria-hidden="true">▣</span>

// ✓ Texto alternativo en el elemento accionable
<button aria-label="Editar Arroz blanco">
  <span aria-hidden="true">✎</span>
</button>
```

### Botones y roles

```jsx
// ✓ Siempre type="button" en botones que no son submit
<button type="button" onClick={...}>

// ✓ aria-pressed para toggles
<button type="button" aria-pressed={activo}>

// ✓ aria-label cuando el texto visible no es suficiente
<button aria-label={`Eliminar ${item.nombre}`}>
```

### Contenido dinámico

```jsx
// ✓ Contador y mensajes de estado
<p aria-live="polite" aria-atomic="true">Insumos totales: {total}</p>

// ✓ Errores críticos
<p role="alert" aria-live="assertive" aria-atomic="true">{error}</p>

// ✓ Estados de carga y vacío
<div role="status" aria-label="Cargando inventario">...cargando...</div>
<div role="status" aria-label="No hay insumos">Sin resultados</div>
```

### Formularios

```jsx
// ✓ Asociar label con input mediante htmlFor/id
<label htmlFor="nombre">Nombre</label>
<input id="nombre" ... />

// ✓ Campo requerido
<input aria-required="true" />

// ✓ Campo con error
<input
  aria-invalid={error ? 'true' : undefined}
  aria-errormessage={error ? errId : undefined}
/>
<p id={errId} role="alert">{error}</p>

// ✓ Grupos de controles relacionados
<fieldset>
  <legend>Estado / Símbolos</legend>
  ...botones toggle...
</fieldset>
```

### Semántica HTML5

```jsx
// ✓ Usar elementos semánticos apropiados
<header>        // encabezado de página
<search>        // zona de búsqueda
<table>         // datos tabulares (con caption, th scope, etc.)
<dl><dt><dd>    // listas de definición (leyendas, metadatos)
<fieldset>      // grupo de controles de formulario

// ✓ th scope="row" para encabezados de fila en tablas
<th scope="row">{item.nombre}</th>

// ✓ caption sr-only para describir tablas
<caption className="sr-only">Inventario de insumos de emergencia</caption>
```

### Focus trap en modales

Todo modal debe implementar un focus trap. Patrón estándar:

```jsx
const handleKeyDown = useCallback(e => {
  if (e.key !== 'Tab' || !dialogRef.current) return;
  const focusable = dialogRef.current.querySelectorAll(
    'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}, []);
```

---

## 6. Documentación JSDoc

Todo archivo, función exportada y constante no trivial debe tener JSDoc.

### Archivo / módulo

```js
/**
 * @file Descripción breve del propósito del archivo.
 * @module components/NombreComponente
 */
```

### Función

```js
/**
 * Descripción en una oración de qué hace la función.
 * Si hace algo no obvio, agregar más detalle.
 *
 * @param {string} nombre - Descripción del parámetro. Tipo siempre entre {}.
 * @param {number|null} [opcional] - Parámetros opcionales van entre [corchetes].
 * @returns {string} Qué devuelve y en qué formato.
 *
 * @example
 * toStorageDate('4/2027')  // → '04-2027'
 */
```

### Componente React

```js
/**
 * Descripción breve del componente y su rol en la UI.
 *
 * @param {Object} props
 * @param {string} props.modo            - 'crear' | 'editar'
 * @param {() => void} props.onCerrar   - Callback para cerrar el modal.
 * @returns {JSX.Element}
 */
```

### Constantes

```js
/** @constant {string} Clases Tailwind reutilizables para inputs del formulario */
const INPUT = '...'

/** @constant {Record<string, string>} Mapa de código de símbolo → clases CSS */
const SIMBOLO_CLASS = { ... }
```

### Typedef (para tipos compartidos)

```js
/**
 * @typedef {Object} Insumo
 * @property {string}      id          - UUID único.
 * @property {string}      nombre      - Nombre del producto.
 * @property {string[]}    simbolos    - Códigos de símbolos activos.
 * @property {string}      vencimiento - Formato "MM-AAAA" o "no vence".
 */
```

---

## 7. Servidor Express — convenciones

### Estructura de un handler

```js
app.get('/api/recurso', (req, res) => {
  try {
    const db = readDB();
    // lógica...
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

### Siempre usar `readDB()` / `writeDB()`

```js
// ✓ Helpers centralizados — nunca leer/escribir db.json directamente
const db = readDB();
db.insumos.push(nuevo);
writeDB(db);
```

### Validación de entrada

```js
// ✓ Validar en el servidor, no asumir que el cliente envía datos correctos
if (!nombre || !nombre.trim()) {
  return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
}
```

### Campos permitidos en PUT (whitelist explícita)

```js
// ✓ Lista blanca explícita — no usar spread directo de req.body
const campos = [
  'nombre',
  'cantidad',
  'unidad',
  'categoria',
  'vencimiento',
  'calorias',
  'proteina',
  'notas',
  'simbolos',
];
for (const campo of campos) {
  if (req.body[campo] !== undefined) actualizado[campo] = req.body[campo];
}
```

---

## 8. Nombrado y lenguaje

| Contexto                   | Convención                                      | Ejemplo                       |
| -------------------------- | ----------------------------------------------- | ----------------------------- |
| Variables y funciones JS   | `camelCase`                                     | `fetchInsumos`, `simbolosMap` |
| Componentes React          | `PascalCase`                                    | `InsumoModal`, `FilterBar`    |
| Constantes de módulo       | `UPPER_SNAKE_CASE`                              | `SIMBOLO_CLASS`, `VACIO`      |
| Clases CSS propias         | `kebab-case`                                    | `.sym-v`, `.fecha-pronto`     |
| Props de callbacks         | prefijo `on`                                    | `onGuardar`, `onCerrar`       |
| Archivos de componentes    | `PascalCase.jsx`                                | `InsumoTable.jsx`             |
| Archivos de hooks          | `use` + `camelCase`                             | `useInsumos.js`               |
| Texto visible al usuario   | **Español**                                     | "Guardar", "Sin resultados"   |
| Código, variables, commits | **Inglés** (o español si es dominio específico) | `loading`, `handleSubmit`     |

---

## 9. Commits de Git

Usar el formato **Conventional Commits**:

```
tipo: descripción breve en imperativo
```

### Tipos disponibles

| Tipo            | Cuándo usarlo                            |
| --------------- | ---------------------------------------- |
| `feat`          | Nueva funcionalidad                      |
| `arreglo`       | Corrección de bug                        |
| `estilo`        | Cambios de formato/Tailwind sin lógica   |
| `refactor`      | Reestructuración sin cambio funcional    |
| `accesibilidad` | Mejoras de accesibilidad                 |
| `docs`          | Cambios en documentación                 |
| `tarea`         | Mantenimiento (gitignore, deps, configs) |

### Ejemplos

```
feat: add focus trap to DeleteConfirm modal
arreglo: correct date format conversion on form submit
accesibilidad: add aria-label to symbol badges in InsumoTable
estilo: convert arbitrary values to Tailwind v4 scale
docs: update README to remove deleted migration script
tarea: add insumos-*.md to .gitignore
```

### Reglas básicas

- Descripción en **minúsculas** (excepto nombres propios)
- Sin punto al final
- Máximo ~72 caracteres en la primera línea
- Si el cambio es complejo, agregar cuerpo separado por línea en blanco
