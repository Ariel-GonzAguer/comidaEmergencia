# ComidaEmergencia

Este proyecto es una aplicación de gestión de alimentos, medicamentos, notas, recetas y otros recursos para situaciones de emergencia. Está desarrollado en React con Zustand para el manejo de estado global y Firebase como backend para autenticación y almacenamiento de datos.

## Características principales

- Gestión de alimentos, medicamentos, lugares, notas, recetas y otros ítems.
- Persistencia local y sincronización en tiempo real con Firestore.
- Autenticación de usuarios con Firebase Auth.
- Edición y eliminación de elementos con confirmación y notificaciones (Sonner).
- Interfaz responsiva y accesible.
- Protección de rutas y manejo de sesiones.

## Estructura del proyecto

```
comidaEmergencia/
├── api/
│   └── openAI_RecipeService.js
├── documentacion/
│   ├── clases.md
│   └── ...
├── public/
│   └── OrangeCat_SVG.svg
├── src/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── clases/
│   │   ├── AlimentoClass.js
│   │   ├── Medicamento.js
│   │   └── ...
│   ├── componentes/
│   │   ├── AgregarButton.jsx
│   │   ├── AgregarModal.jsx
│   │   └── ...
│   ├── firebase/
│   │   └── firebaseConfig.js
│   ├── hooks/
│   ├── layouts/
│   │   └── BaseLayout.jsx
│   ├── paginas/
│   │   ├── Medicamentos.jsx
│   │   ├── Comida.jsx
│   │   ├── FAQs.jsx
│   │   └── ...
│   ├── scripts/
│   │   └── estrategias/
│   │       └── toastStrategy/
│   │           ├── index.js
│   │           ├── toastStrategiesObject.js
│   │           └── validacion.js
│   ├── servicios/
│   │   └── firebaseService.js
│   ├── stores/
│   │   ├── useAuthStore.js
│   │   └── useStore.js
│   └── tests/
│       ├──setupTests.js
│       └── ...
├── .gitignore
├── CODE_OF_CONDUCT.md
├── LICENCE.txt
├── README.md
├── eslint.config.js
├── package.json
├── vite.config.js
└── index.html
```

- `src/componentes/`: Componentes de React para la UI y navegación.
- `src/clases/`: Clases de dominio para alimentos, lugares, recetas, etc.
- `src/paginas/`: Vistas principales de la app.
- `src/stores/`: Stores de Zustand para el manejo de estado global y autenticación.
- `src/servicios/`: Servicios para interacción con Firebase.
- `src/scripts/estrategias/`: Estrategias..
- `src/layouts/`: Componentes de layout y estructura general.
- `src/firebase/`: Configuración de Firebase.
- `public/`: Archivos estáticos.
- `api/`: Servicios externos (por ejemplo, integración con OpenAI).
- `documentacion/`: Documentos de referencia y ayuda.

## Instalación y uso

1. Clone el repositorio y entre a la carpeta del proyecto.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configure sus credenciales de Firebase en `/src/firebase/firebaseConfig.js`. La API KEY es recomendable declararla en un archivo .env
4. Inicie la aplicación:
   ```bash
   npm run dev
   ```

## CONTRIBUYENTES

- Ariel GonzaAgüero
- Liany Var
- 


<div align="center">
  <p>Hecho libre para todo el mundo 🌍</p>
  <p>⭐ ¡Dele una estrella si le gusta el proyecto!</p>
  <p> Proyecto open source bajo licencia AGPL-3 </p>
</div>
