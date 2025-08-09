# Guía de Estilo de ComidaEmergencia

Esta guía de estilo tiene como objetivo unificar convenciones de código, nombres de archivos, formato de commits y flujo de trabajo Git para facilitar la colaboración en el proyecto.

---

## 1. Estructura y nombres de archivos

- Carpeta `src/`:

  - Componentes de React en `src/componentes/` con extensión `.jsx` o `.tsx` y nombre en **PascalCase** (por ejemplo, `AgregarButton.jsx`).
  - Hooks en `src/hooks/` en **camelCase** (por ejemplo, `useAuthStore.js`).
  - Servicios en `src/servicios/` en **camelCase** (por ejemplo, `firebaseService.js`).
  - Clases de dominio en `src/clases/` en **PascalCase** (por ejemplo, `RecetaClass.js`).
  - Scripts auxiliares en `src/scripts/` en **camelCase** (por ejemplo, `dashboard.js`).
  - Patrones de diseño en `src/scripts` dentro de su respectiva carpeta (por ejemplo `scripts/factories` para patrón Factory Method) o si es una nueva estrategia dentro de `src/scripts/strategies/`.
  - Tests en `src/tests/` con extensión `.test.js`.

- Archivos de configuración y documentación en la raíz:
  - `README.md`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `STYLE_GUIDE.md`, `SECURITY.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `.eslintrc.js`, `vite.config.js`, etc.

---

## 2. Convenciones de JavaScript y React

- Usa **2 espacios** para indentación.
- Finaliza líneas con punto y coma (`;`).
- Siempre declara variables con `const` o `let` (no usar `var`).
- Usa **camelCase** para variables y funciones: `const calcularVencimiento = () => {}`.
- Usa **PascalCase** para componentes y clases: `function ComidaActual() {}` o `class LugarClass {}`.
- Componentes funcionales:
  ```jsx
  // Componente en PascalCase
  function MiComponente({ prop }) {
    return <div>{prop}</div>;
  }
  export default MiComponente;
  ```
- Hooks deben comenzar con `use`: `useEmergencyFoodStore`, `useAuthStore`.
- Organiza importaciones:
  1. Módulos externos (`react`, `firebase`).
  2. Contexto o librerías internas.
  3. Estilos o activos.

---

## 3. Formato de Markdown

- Para bloques de código use:

```js / jsx
// código
```

Ver ejemplo de `Componentes funcionales` arriba.

- Encabezados en **Mayúscula Inicial** y sin punto final.
- Líneas en blanco entre párrafos y secciones.
- Listas con guión (`-`) y espacio.
- Enlaces relativos: `[Texto](./RUTA)`.

---

## 4. Convenciones de commit

Usa el siguiente estilo para mensajes de commit:

```
<tipo>(<área>): descripción corta

Descripción más detallada (opcional).
```

- **tipos**:

  - `feat`: nueva funcionalidad
  - `fix`: corrección de bug
  - `docs`: cambios en documentación
  - `style`: formato, espacios, punto y coma, sin lógica
  - `refactor`: refactorización de código
  - `test`: agregar o actualizar pruebas
  - `chore`: tareas de mantenimiento (scripts, dependencias)

- **área** (opcional): componente o módulo afectado (por ejemplo, `Comida`, `store`, `firebaseService`).
- Mensaje de descripción en español breve y claro.

Ejemplo:

```
feat(Comida): agregar validación de fecha de vencimiento
```

> [!TIP]
> Si usa la interfaz de VS Code para hacer el commit en la rama main, escriba `ccm` y presione `ctrl` + `barra de espacio`, esto generará una plantilla con la convención de commit.

---

## 5. Flujo de trabajo de ramas

- `main`: versión estable en React, solo merges aprobados.
- `experimental`: rama para desarrollo de características experimentales en React.
- `versionAstro`: rama para desarrollo de nuevas características en Astro.

Al terminar, envíe un Pull Request contra `main` y siga la [plantilla de PR](.github/PULL_REQUEST_TEMPLATE.md).

---

## 6. PR y revisión de código

> [!IMPORTANT]  
> Antes de abrir un PR asegúrese de abrir un issue relacionado, si no existe uno. **No se aceptarán PRs sin un issue asociado**.

- Complete la plantilla de PR.
- Verifique que `npm run lint` pase sin errores.
- Asegúrese de que la documentación se actualice si es necesario.

---

## 7. Otras recomendaciones

- Mantenga pequeñas y atómicas sus PRs.
- Incluya capturas o GIFs para cambios de UI.
- Añada pruebas manuales o automáticas cuando sea posible.
- Consulte `SECURITY.md` antes de exponer secretos.

---

_Última actualización: 09/08/2025_
