# Guía para Colaborar

¡Gracias por su interés en contribuir a ComidaEmergencia! Hay varias formas de colaborar: reportar bugs, proponer features, trabajar en features, crear/mejorar documentación y testear.

## Colaborar con código
 Siga estos pasos para colaborar de manera efectiva y ordenada.

### 1. Haga un fork del repositorio

- Vaya a la página principal del repositorio en GitHub.
- Haga clic en el botón **Fork** (arriba a la derecha) para crear una copia en su cuenta.

### 2. Clone su fork

- En su cuenta, haga clic en el botón **Code** y copie la URL.
- Abra su terminal y ejecute:
  ```bash
  git clone https://github.com/su-usuario/comidaEmergencia.git
  cd comidaEmergencia
  ```

### 3. Cree una rama para su cambio

- Es recomendable crear una rama específica para cada mejora o corrección:
  ```bash
  git checkout -b nombre-de-su-rama
  ```

### 4. Instale las dependencias

- Instale las dependencias del proyecto:
  ```bash
  npm install
  ```

### 5. Realice sus cambios

- Realice los cambios necesarios en el código.
- Asegúrese de seguir las buenas prácticas y el estilo del proyecto.
- Si agrega nuevas funcionalidades, incluya documentación y/o ejemplos.

### 6. Pruebe su código

- Ejecute la app localmente:
  ```bash
  npm run dev
  ```
- Verifique que su cambio funciona y no rompe nada existente.
- Si el proyecto está desplegado en Vercel(recomendado), ejecute:

```bash
vercel dev
```

### 7. Haga commit y push

- Añada sus cambios y escriba un mensaje de commit claro:
  ```bash
  git add .
  git commit -m "Descripción clara de su cambio"
  git push origin nombre-de-su-rama
  ```

### 8. Abra un Pull Request

- Vaya a su fork en GitHub.
- Haga clic en **Contribute** y seleccione la opción para realizar un Pull Request.
- Llene el template/plantilla para hacer su Pull Request.
- Si su cambio resuelve un issue, menciónelo (por ejemplo, `Closes #12`).

## 9. Espere revisión

- El equipo de mantenimiento revisará su Pull Request.
- Puede que le pidan cambios o sugerencias antes de aprobarlo.

## 10. ¡Listo!

- Cuando su Pull Request sea aceptado, su contribución formará parte del proyecto.

---

### Consejos

- Lea el `CODE_OF_CONDUCT.md` antes de contribuir.
- Lea los archivos en la carpeta `documentacion/`.
- Lea `STYLE_GUIDE.md` antes de hacer PR.
- Sea respetuoso y paciente en las discusiones.
- Si tiene dudas, abra un issue o pregunte en el Pull Request.

¡Gracias por ayudar a mejorar ComidaEmergencia!
