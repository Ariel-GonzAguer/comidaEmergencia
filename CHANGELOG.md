# Changelog

Revisar (Guía para el Changelog)[documentacion/guia-changelog.md]

## [4.0.5] - 27/08/2026

### Agregado

- **Resumen de inventario por correo en cada push**: Nueva GitHub Action (`email-db-push.yml`) que envía un correo electrónico con un archivo adjunto `db-resumen.md` cada vez que se hace push a cualquier branch. El archivo contiene todos los insumos de `db.json` agrupados por categoría en formato de tabla markdown.

## [4.0.3] - 01/08/2026

### Agregado

- **Ordenamiento por vencimiento**: Se agregó la funcionalidad de ordenar la tabla de insumos por la columna de vencimiento. Al hacer clic en el encabezado "Vencimiento", se alterna entre orden descendente (fechas más lejanas primero, por defecto) y ascendente (fechas más cercanas primero). Incluye indicador visual (flechas ↑↓) y soporte de accesibilidad (aria-label dinámico).

## [4.0.3] - 01/08/2026

### Agregado

- **Validación de formulario**: Se agregaron reglas estrictas para fecha según formatos aceptados, calorías (positivo entero) y proteínas (positivo decimal, máx 200g por porción) en `InsumoModal`.
- **Robustez offline**: El servidor ahora utiliza `fs/promises` para operaciones asincrónicas y escritura atómica (vía archivo temporal y rename) para prevenir corrupción de datos.

### Cambiado

- **Interfaz accesible**: Se reemplazaron los iconos emoji (👁, ✎, ✕) en la tabla principal por etiquetas de texto claras ("ver", "editar", "eliminar").
- **Licencia**: Se completó el archivo `LICENCE.txt` con el texto íntegro de la cláusula Commons Clause v1.0 para mayor claridad legal.
- **Test asíncronos**: Se actualizaron los tests para usar `async/await` y asegurar que las operaciones de lectura/escritura de archivos se manejen correctamente.

### Corregido

- **Bug de Toast**: Se corrigió el mapeo de propiedades (`msg` vs `mensaje`) para que las notificaciones se muestren correctamente en la interfaz.

## [4.0.0] - 14/3/2026

- Actualización de dependencias.
- Mejoras del README.
- Se reincorpora el comando `pnpm lint` para mantener la calidad del código.
- Se agrega documentación para entender mejor el backend del proyecto.
- Mejora en las respuestas del servidor Express, con objeto `{ success: boolean, data: any }` para estandarizar la comunicación entre frontend y backend.

## [3.0.0] - 8/3/2026

Esta nueva versión es una reescritura completa del proyecto, con un nuevo enfoque en el minimalismo y la facilidad de uso. Ahora es completamente offline, con un backend local que maneja los datos a través de archivos JSON y Markdown.

Ya no se necesita una base de datos externa ni una conexión a internet para usar la aplicación. El frontend se ejecuta en el navegador y el backend es un servidor Express local que lee y escribe los datos en archivos dentro del mismo repositorio.

El proyecto es más ligero, rápido y fácil de desplegar, ideal para situaciones de emergencia donde la conectividad puede ser limitada. Además, se han mejorado las funcionalidades y la UI para hacerla más intuitiva y eficiente.

Es totalmente extensible y personalizable, permitiendo a las personas usuaruas adaptar la aplicación a sus necesidades específicas. Esta versión marca un gran paso hacia una herramienta más accesible y práctica para gestionar recursos en emergencias.

## [0.3.0] - 15/9/2025

### cambiado

- @arielgonzaguer/michi-router de 2.0.1 a 2.1.1
  - mejoras en seguridad

## [0.3.0] - 13/9/2025

### agregado

- guía para el changelog
- changelog inicial

### eliminado

- rama Astro

### cambiado

- @arielgonzaguer/michi-router de 1.3.0 a 2.0.1

---

## [0.2.0] - 25/7/2025

### agregado

- rama React

---

## [0.1.0] - 21/6/2025

### agregado

- Versión inicial del proyecto con Astro
