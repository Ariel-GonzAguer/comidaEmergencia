# Despliegue y uso en Vercel

Esta guía explica cómo desplegar y usar el proyecto ComidaEmergencia en Vercel.

## 1. Requisitos previos

- Tener una cuenta en [Vercel](https://vercel.com/).
- Tener instalado [Vercel CLI](https://vercel.com/docs/cli) (opcional, para despliegue local y desde terminal).
- El proyecto debe tener el archivo `vercel.json` y estar listo para producción (ejecuta `npm run build` para verificar). Es decir, debe compilarse sin errores y generar los archivos estáticos necesarios.

## 2. Despliegue automático (recomendado)

1. Haz un fork o clona el repositorio en tu cuenta de GitHub.
2. Ingresa a [Vercel](https://vercel.com/) y haz clic en "Add New... > Project".
3. Selecciona el repositorio `comidaEmergencia`.
4. Vercel detectará automáticamente el framework (Vite + React) y configurará el build.
5. Haz clic en "Deploy" y espera a que finalice el proceso.
6. El proyecto estará disponible en una URL pública similar a `https://comidaemergencia.vercel.app`.

## 3. Despliegue manual con Vercel CLI

1. Instala Vercel CLI si no lo tienes:
	```bash
	npm install -g vercel
	```
2. Inicia sesión en Vercel:
	```bash
	vercel login
	```
3. Desde la raíz del proyecto, ejecuta:
	```bash
	vercel
	```
4. Sigue las instrucciones para vincular el proyecto y desplegar.

## 4. Desarrollo local con Vercel

Puedes usar Vercel CLI para simular el entorno de producción localmente:

```bash
vercel dev
```

> [!TIP]
> Usando esta opción se podrá usar la API de Generación de Recetas sin más necesidad de configuración.

Esto ejecuta el proyecto en modo desarrollo y simula el entorno de Vercel.

## 5. Variables de entorno

Las variables de entorno (por ejemplo, para Firebase y OpenAI) se deben agregar en el dashboard de Vercel en la sección "Environment Variables".

## 6. Archivos importantes

- `vercel.json`: Configuración personalizada para Vercel (rutas, builds, etc).
- `package.json`: Scripts de build y dependencias.
- `vite.config.js`: Configuración de Vite para producción.

## 7. Solución de problemas

- Si ves errores de permisos (EPERM) en Windows al ejecutar por primera vez `vercel dev` cierre la terminal, abra otra y vuelva a intentarlo. Esto puede solucionar problemas de permisos la mayoría de las veces.
- Revisa los logs de Vercel en el dashboard para detalles de errores de build o despliegue. Puede pasarle estos logs a alguna IA (ChatGPT, por ejemplo) para obtener ayuda.

## 8. Recursos útiles

- [Documentación oficial de Vercel](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Guía de despliegue con Vite](https://vitejs.dev/guide/static-deploy.html)

---
_Última actualización: 09/08/2025_
