# Taller de Código Abierto

**Objetivo:** Comprender qué es el código abierto, cómo iniciar un proyecto, cómo contribuir de forma efectiva y cómo manejar aspectos legales, económicos y de comunidad.

---

## 1. Introducción

### 1.1. ¿Qué es el código abierto?

Según la OSI (Open Source Initiative) se refiere a un software cuyo código fuente está disponible públicamente para que otros puedan usarlo, modificarlo y distribuirlo.

**Características clave del código abierto según la OSI:**

- Libre distribución: La licencia no debe restringir la venta o redistribución del software.
- Acceso al código fuente: El código fuente debe estar disponible y se debe permitir la distribución tanto del código fuente como de su versión compilada.
- Trabajos derivados: Se permiten modificaciones y trabajos derivados, que pueden ser distribuidos bajo los mismos términos que la licencia original.
- Integridad del código fuente: Se puede permitir la distribución de modificaciones como parches, manteniendo la integridad del código original.
- No discriminación: La licencia no debe discriminar a personas o grupos, ni a campos de actividad.
- Distribución de la licencia: Los derechos otorgados por la licencia deben aplicarse a todos los que reciban el software.
- La licencia no debe ser específica de un producto: Los derechos del software no deben depender de que sea parte de un conjunto mayor.
- La licencia no debe restringir otro software: No debe restringir el uso de otros softwares con los que se distribuye.
- La licencia debe ser tecnológicamente neutral: No debe restringir el uso con ninguna tecnología específica.

> **Filosofía:** transparencia, colaboración y libertad de uso.

### 1.2 Diferencia entre "Código Libre" y "Código Abierto".

La diferencia principal entre "Código Libre" y "Código Abierto" radica en su enfoque filosófico. Código Libre (o Software Libre) enfatiza las libertades del usuario sobre el software, mientras que Código Abierto (Open Source) se centra en el modelo de desarrollo colaborativo y práctico. Aunque ambos se refieren a software con acceso al código fuente, sus motivaciones y prioridades son distintas.

→ Ejemplos de Software Libre: GNU/Linux, Firefox, LibreOffice.

→ Ejemplos de Código Abierto: Android, Linux Kernel, React.

> **Dato curioso:** GitHub aloja más de 400 millones de repositorios, pero no todos son realmente "open source".

> **Código Cerrado:** Software cuyo código fuente no está disponible públicamente. Ejemplos incluyen Microsoft Windows, Adobe Photoshop y la mayoría de las aplicaciones comerciales.

---

## 2. Beneficios y Desafíos

### 2.1. Beneficios

- Colaboración global: Puede participar gente de todo el mundo.
- Aprendizaje práctico: Literalmente es aprender participando en proyectos reales.
- Visibilidad y reputación profesional: Networking y oportunidades laborales, conocer personas de otras partes del mundo que comparten sus intereses.
- Reutilización y mejora continua del software: Se beneficia de las contribuciones de otros y puede incorporar mejoras de manera ágil.
- Impacto social: Puede abordar problemas sociales y contribuir a causas importantes.

### 2.2. Desafíos

- Mantenimiento a largo plazo: Asegurar que el proyecto siga siendo relevante y reciba actualizaciones.
- Manejo de contribuciones y calidad: Establecer un proceso claro para revisar y aceptar contribuciones, manteniendo la calidad del código.
- Sostenibilidad económica: Encontrar formas de financiar el proyecto a largo plazo, ya sea a través de donaciones, patrocinios o servicios premium.
- Posibles conflictos de licencia (personas que no respetan la licencia, por ejemplo): Asegurarse de que todos los colaboradores comprendan y acepten la licencia del proyecto.
- Burnout de mantenedores: Asegurarse de que los mantenedores no se agoten, estableciendo expectativas claras y fomentando un ambiente de trabajo saludable.

---

## 3. Licencias de Código Abierto

### 3.1. ¿Por qué es importante una licencia?

- Legalmente, **todo código sin licencia explícita es cerrado** por defecto.
- Define cómo otros pueden usar, modificar y redistribuir tu software.
- Protege sus derechos y los de las personas usuarias.

### 3.2. Tipos de licencias

#### **Permisivas**

- Ejemplos: MIT, Apache 2.0, BSD.
- Permiten uso comercial, modificación, redistribución, incluso en proyectos cerrados.
- Pros: máxima adopción.
- Contras: empresas pueden usar sin devolver contribuciones.

#### **Copyleft**

- Ejemplos: GPLv3, AGPLv3, LGPL.
- Obligan a mantener el código abierto en derivados.
- Pros: protege la libertad del software.
- Contras: menos atractivas para uso comercial.

#### **Específicas / Especializadas**

- Creative Commons (documentación, arte, datos).
- MPL (Mozilla Public License): mezcla de permisos y copyleft.
- Licencias para datos: Open Data Commons.

### 3.3. Comparativa rápida

| Licencia   | Uso comercial | Código cerrado permitido | Obliga a abrir cambios |
| ---------- | ------------- | ------------------------ | ---------------------- |
| MIT        | ✔             | ✔                        | ✘                      |
| Apache 2.0 | ✔             | ✔                        | ✘                      |
| GPLv3      | ✔             | ✘                        | ✔                      |
| AGPLv3     | ✔             | ✘                        | ✔ (incluye uso en web) |
| MPL 2.0    | ✔             | Parcial                  | Parcial                |

---

## 4. Aspecto Económico

### 4.1. ¿Cómo se sostiene un proyecto de código abierto?

- Donaciones (Patreon, OpenCollective).
- Patrocinios (GitHub Sponsors, empresas).
- Servicios premium alrededor del software (soporte, consultoría).
- Licencias duales (open source + comercial).
- SaaS (Software as a Service) basado en el proyecto.

### 4.2. Ejemplos de modelos exitosos

- **Red Hat**: vende soporte para software libre.
- **MongoDB**: licencia SSPL para proteger uso en la nube.
- **Vercel**: framework Next.js gratis, hosting pago.

> El código puede ser libre pero el servicio no. Open source no significa gratis en todos los casos, y hay modelos de negocio rentables.

---

## 5. Buenas Prácticas para Crear un Proyecto Open Source

### 5.1. Preparación del repositorio

- **README claro**:
  - Descripción breve y objetivos.
  - Ejemplo de uso.
  - Instalación y requisitos.
- **Licencia visible** (`LICENSE` en raíz).
- **Código organizado** y documentado.
- **Guías de contribución** (`CONTRIBUTING.md`).
- **Código de conducta** (`CODE_OF_CONDUCT.md`).

### 5.2. Aspectos técnicos

- Usar un sistema de control de versiones (Git).
- Pruebas automatizadas (tests).
- Integración continua (CI/CD).
- Issues y PRs bien gestionados.

> Entre más documentación MEJOR.

---

## 6. Buenas Prácticas para Contribuir a un Proyecto Open Source

### 6.1. Antes de contribuir

- Leer la documentación y guías de contribución.
- Revisar issues abiertos.
- **IMPORTANTÍSIMO:** Comentar antes de empezar a trabajar en algo.

### 6.2. Cómo contribuir → ¡Hay varias formas!

- Reportar bugs de forma clara (pasos para reproducir, contexto).
- Mejorar documentación.
- Crear nuevas funciones siguiendo el estilo del proyecto.
- Revisar y probar el código de otras personas.

### 6.3. Etiqueta y comunidad

- Respeto y comunicación clara.
- Dar crédito.
- Ser paciente.

---

## 7. Herramientas Clave

- **Git y GitHub/GitLab**.
- **GitHub Issues y Discussions** para comunidad.
- **GitHub Actions** para CI/CD.
- **Dependabot** para mantener dependencias actualizadas.
- **Shields.io** para badges de estado en el README.

---

## 8. Ejercicio Práctico (Interactivo)

> Vamos a contribuir a un proyecto real.

### Pasos:

0. Leer la documentación.
1. Clonar el repositorio.
2. Crear una rama nueva.
3. Hacer un cambio pequeño (documentación o feature).
4. Crear un Pull Request.
5. Revisar y hacer merge.

---

## 9. Cierre y Recursos

### 9.1. Resumen de aprendizajes

- Qué es y qué no es open source.
- Tipos de licencias y cómo elegir.
- Sostenibilidad y economía.
- Buenas prácticas para crear y contribuir.
- Herramientas para mantener proyectos.

### 9.2. Recursos recomendados

- [Open Source Initiative](https://opensource.org/licenses) → Licencias de código abierto.
- [Choose a License](https://choosealicense.com/) → Herramienta para elegir licencia.
- [First Contributions](https://firstcontributions.github.io/) → Guía para hacer tu primera contribución.
- [Awesome for Beginners](https://github.com/MunGell/awesome-for-beginners) → Recursos para principiantes en open source.
- [Guías de código abierto](https://opensource.guide/) → Documentación sobre cómo contribuir.
- [Codecademy Docs](https://github.com/Codecademy/docs) → Documentación de Codecademy.

---

## 10. Preguntas y Discusión

- Espacio para resolver dudas.
- Conversar sobre experiencias previas.
- Inspirar a que comiencen su propio camino en el open source.

---

## EXTRAS:
- hablar sobre instrucciones para Copilot (.github/copilot-instructions.md)[https://copilot-instructions.md/]
- instalar mcp de GitHub y Context7 (https://code.visualstudio.com/mcp)