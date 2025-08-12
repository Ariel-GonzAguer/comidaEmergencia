# ComidaEmergencia

Aplicación Web de Código Abierto / Open Source para gestionar alimentos, medicamentos, notas, recetas y recursos en emergencias.
**React + Vite + Zustand + Firebase + Tailwind + Vitest**

<p align="left">
   <a href="https://vercel.com/" target="_blank"><img alt="Vercel" src="https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel" /></a>
   <a href="https://firebase.google.com/" target="_blank"><img alt="Firebase" src="https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?logo=firebase&logoColor=black" /></a>
   <a href="https://tailwindcss.com/" target="_blank"><img alt="Tailwind CSS" src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwindcss&logoColor=white" /></a>
   <a href="https://zustand-demo.pmnd.rs/" target="_blank"><img alt="Zustand" src="https://img.shields.io/badge/Zustand-Estado-8A2BE2" /></a>
   <a href="https://vitejs.dev/" target="_blank"><img alt="Vite" src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" /></a>
   <a href="https://vitest.dev/" target="_blank"><img alt="Vitest" src="https://img.shields.io/badge/Vitest-Tests-6E9F18?logo=vitest&logoColor=white" /></a>
   <a href="https://zod.dev/" target="_blank"><img alt="Zod" src="https://img.shields.io/badge/Zod-Validaci%C3%B3n-3E67B1" /></a>
   <a href="https://react.dev/" target="_blank"><img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" /></a>
   <a href="https://opensource.org/licenses/AGPL-3.0" target="_blank"><img alt="Open Source" src="https://img.shields.io/badge/Open%20Source-AGPL--3-00B200?logo=opensourceinitiative&logoColor=white" /></a>
</p>

 <!-- DESCOMENTAR ESTO
 ## 🎯 Objetivos del proyecto

- Facilitar la gestión y organización de recursos esenciales en situaciones de emergencia (alimentos, medicamentos, notas, recetas y otros ítems).
- Permitir el acceso y la colaboración de cualquier persona, comunidad o institución, promoviendo el software libre y abierto.
- Ofrecer una interfaz intuitiva, accesible y multiplataforma (web, móvil, escritorio).
- Integrar tecnologías modernas para sincronización en tiempo real, autenticación segura y generación automática de recetas con IA.
- Fomentar la participación y mejora continua por parte de la comunidad. -->

## 🟢 Proyecto Código Abierto / Open Source (AGPL-3)

Este proyecto es Código Abierto bajo licencia AGPL-3. Puede usarlo, modificarlo y compartirlo respetando los términos de la licencia. Aceptamos issues y pull requests.

- Lea: [`CONTRIBUTING.md`](./CONTRIBUTING.md) y [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)
- Lea los archivos en la carpeta [`documentacion`](./documentacion).
- Licencia: [`LICENCE.txt`](./LICENCE.txt)

## ✨ Características

- Gestión de alimentos, medicamentos, lugares, notas y recetas.
- Sincronización con Firestore y persistencia local (Zustand persist).
- Autenticación con Firebase Auth (email/contraseña).
- Notificaciones (Sonner) y UI responsiva.
- PWA con Vite (instalable en escritorio/móvil).

## 🧰 Stack

- Frontend: React 19 + Vite 7 + Tailwind 4
- Estado: Zustand 5 (con Immer)
- Backend/DB: Firebase 12 (Auth + Firestore)
- API IA: Función serverless en `api/openAI_RecipeService.js` (OpenAI)
- Calidad: ESLint 9, Vitest 3 (jsdom)
- Deploy: Vercel (vercel.json)

## 🚀 Empezar en 3 pasos

1. Clonar e instalar

```bash
git clone https://github.com/Ariel-GonzAguer/comidaEmergencia.git
cd comidaEmergencia
npm install
```

2. Configurar variables de entorno

Crear un archivo `.env` en la raíz con tus credenciales de Firebase (todas deben empezar con `VITE_`):

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id

# Firestore: documento y colección usados por el servicio
VITE_FIREBASE_DOC=tu_documento
VITE_FIREBASE_COLECCION=tu_coleccion
```

Para la IA (servicio de recetas) añade la clave solo en el entorno del servidor (local con Vercel o en Vercel Cloud):

```env
OPENAI_API_KEY=tu_clave_openai
```

3. Ejecutar en desarrollo

```bash
npm run dev
```

Opcional/Recomendado (para probar la API serverless localmente):

```bash
vercel dev
```

## 🧪 Tests y calidad

- Ejecutar pruebas (Vitest):

```bash
npm run test
```

- Lint (ESLint):

```bash
npm run lint
```

## 🧭 Uso básico

1. Inicia sesión (Firebase Auth). Si no tienes usuario, configúralo en tu proyecto de Firebase.
2. Navega por las secciones: Comida, Medicamentos, Lugares, Notas y Recetas.
3. Generador de Receta IA: ingresa ingredientes y envía; se hace POST a `/api/openAI_RecipeService` y se muestra la receta.
4. Guarda y edita datos; se sincronizan con Firestore.

## 🏗️ Estructura (resumen)

```text
comidaEmergencia/
├── api/                      # Funciones serverless (OpenAI)
├── src/
│   ├── componentes/          # UI y navegación
│   ├── paginas/              # Vistas
│   ├── stores/               # Zustand (auth, estado)
│   ├── servicios/            # Firebase/Firestore, Zod
│   ├── firebase/             # Configuración Firebase
│   └── tests/                # Vitest setup
├── documentacion/            # Guías (OpenAI, Firebase, Vercel, etc.)
├── vercel.json
├── vite.config.js
└── eslint.config.js
```

## ☁️ Despliegue en Vercel

1. Importa el repo en Vercel y deploy automático, o usa CLI:

```bash
npm i -g vercel
vercel
```

2. En Vercel, define variables de entorno (Firebase y `OPENAI_API_KEY`).
3. Para desarrollo local con API: `vercel dev`.

Detalles en `documentacion/vercel.md`.

## 🤝 Cómo contribuir

**Primero:** Revise `CONTRIBUTING.md` para lineamientos y `STYLE_GUIDE.md` para estilo de código.

1. Fork ➜ rama (`feat/mi-mejora` o `fix/mi-bug`).
2. Cambios con commits claros según la convención del proyecto.
3. PR llenando la plantilla.
4. Respete el Código de Conducta.

## Licencia y assets

- Licencia principal: **AGPL-3** (`LICENCE.txt`).

## Créditos

- Ariel GonzaAgüero
- Liany Var

<div align="center">
   <p>Hecho libre para todo el mundo 🌍 — si le sirve, deje una ⭐</p>
</div>
