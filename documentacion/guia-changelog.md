Un changelog (o registro de cambios) es un documento donde se anotan de forma clara y ordenada los cambios que se hacen en un proyecto, aplicación o producto a lo largo del tiempo.

Básicamente es el historial oficial de mejoras, correcciones y novedades.

## Contenido típico de un changelog

- Suele incluir, para cada versión:

- Número de versión o fecha

- Nuevas funciones (features)

- Mejoras (optimización, performance, accesibilidad)

- Correcciones de errores (bugs)

- Cambios importantes (breaking changes) que puedan afectar a quien use el software

## Qué sí debería poner en el changelog

- Nuevas funciones o mejoras visibles (botones, pantallas, flujos, APIs)

- Cambios importantes en la forma de usar el software (por ejemplo, parámetros de una función, endpoints que cambian, diseño que puede afectar a usuarios)

- Correcciones de errores que afectaban a las personas usuarias

- Optimizaciones notorias (por ejemplo, que la app ahora carga el doble de rápido)

- Cambios que rompen compatibilidad (breaking changes)

## Qué no es necesario poner

- Cambios internos que no afectan a nadie (por ejemplo, reorganizar carpetas, renombrar variables, cambiar dependencias menores que no alteran el comportamiento)

- Pequeños retoques de estilos que no impactan la experiencia

- Commits de pruebas, documentación interna, limpieza de código

## Ejemplo de formato

```markdown
## [1.2.0] - 2025-09-11

### Agregado

- Soporte para exportar datos en CSV
- Nueva interfaz de filtros avanzados

### Arreglado

- Error al guardar configuraciones en Safari
- Problema de accesibilidad en el botón principal

### Cambió

- Se optimizó el tiempo de carga de la página principal

### Eliminado

- Se eliminó la función de sincronización automática (ahora es manual)
```
