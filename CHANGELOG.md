# Changelog

Revisar (Guía para el Changelog)[documentacion/guia-changelog.md]

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
