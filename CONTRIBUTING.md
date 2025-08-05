# Guía para Colaborar

¡Gracias por su interés en contribuir a ComidaEmergencia! Siga estos pasos para colaborar de manera efectiva y ordenada.

## 1. Haga un fork del repositorio

- Vaya a la página principal del repositorio en GitHub.
- Haga clic en el botón **Fork** (arriba a la derecha) para crear una copia en su cuenta.

## 2. Clone su fork

- En su cuenta, haga clic en el botón **Code** y copie la URL.
- Abra su terminal y ejecute:
  ```bash
  git clone https://github.com/su-usuario/comidaEmergencia.git
  cd comidaEmergencia
  ```

## 3. Cree una rama para su cambio

- Es recomendable crear una rama específica para cada mejora o corrección:
  ```bash
  git checkout -b nombre-de-su-rama
  ```

## 4. Instale las dependencias

- Instale las dependencias del proyecto:
  ```bash
  npm install
  ```

## 5. Realice sus cambios

- Realice los cambios necesarios en el código.
- Asegúrese de seguir las buenas prácticas y el estilo del proyecto.
- Si agrega nuevas funcionalidades, incluya documentación y/o ejemplos.

## 6. Pruebe su código

- Ejecute la app localmente:
  ```bash
  npm run dev
  ```
- Verifique que su cambio funciona y no rompe nada existente.
- Si el proyecto está desplegado en Vercel(recomendado), ejecute:

```bash
vercel dev
```

## 7. Haga commit y push

- Añada sus cambios y escriba un mensaje de commit claro:
  ```bash
  git add .
  git commit -m "Descripción clara de su cambio"
  git push origin nombre-de-su-rama
  ```

## 8. Abra un Pull Request

- Vaya a su fork en GitHub.
- Haga clic en **Compare & pull request**.
- Describa claramente su cambio y por qué es útil.
- Si su cambio resuelve un issue, menciónelo (por ejemplo, `Closes #12`).

## 9. Espere revisión

- El equipo de mantenimiento revisará su Pull Request.
- Puede que le pidan cambios o sugerencias antes de aprobarlo.

## 10. ¡Listo!

- Cuando su Pull Request sea aceptado, su contribución formará parte del proyecto.

---

## Reporte de Bugs y Propuestas de Funcionalidades

### ¿Cómo reportar un bug?

- Diríjase a la sección de [Issues](https://github.com/Ariel-GonzAguer/comidaEmergencia/issues) del repositorio.
- Haga clic en **New Issue** y seleccione la plantilla **Bug report**.
- Describa el problema de forma clara, incluyendo:
  - Pasos para reproducir el error
  - Comportamiento esperado y observado
  - Capturas de pantalla o mensajes de error relevantes
  - Información sobre su entorno (navegador, sistema operativo, etc.)
- No incluya información sensible o privada.

### ¿Cómo proponer una nueva funcionalidad?

- Vaya a la sección de [Issues](https://github.com/Ariel-GonzAguer/comidaEmergencia/issues).
- Haga clic en **New Issue** y seleccione la plantilla **Feature request**.
- Explique claramente la funcionalidad propuesta, su utilidad y posibles casos de uso.
- Si es posible, sugiera cómo podría implementarse o ejemplos de otros proyectos.

El equipo de mantenimiento revisará su propuesta y podrá pedirle detalles adicionales si es necesario.
