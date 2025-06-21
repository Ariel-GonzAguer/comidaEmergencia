# Alimentos de Emergencia PWA

Una aplicación web progresiva para gestionar el inventario de alimentos de emergencia, construida con Astro, Firebase y Tailwind CSS.

## ✨ Características

- 🔐 **Autenticación segura** con Firebase Auth (email/contraseña)
- 📦 **Gestión de inventario** de alimentos de emergencia
- 📅 **Seguimiento de fechas de vencimiento** con alertas automáticas
- ⚠️ **Toast notifications** para alimentos próximos a vencer (30 días)
- 📊 **Estadísticas** de total de alimentos, próximos a vencer y calorías totales
- 🎨 **UI moderna** con Tailwind CSS
- 🔄 **Actualizaciones en tiempo real** con Firestore (colección: `emergenciaDataTotal`)
- 📱 **Diseño responsivo** para móviles y escritorio

## 🏗️ Tecnologías Utilizadas

- **Astro** - Framework web moderno
- **Firebase** - Autenticación y base de datos
- **Firestore** - Base de datos NoSQL en tiempo real
- **Tailwind CSS** - Framework de CSS utilitario
- **Zustand** - Gestión de estado ligera
- **JavaScript** - Lenguaje de programación

## 📁 Estructura del Proyecto

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   ├── firebase/
│   │   ├── firebaseConfig.js
│   │   ├── authService.js
│   │   └── foodService.js
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro (Login)
│   │   └── dashboard.astro
│   ├── store/
│   │   └── useStore.js
│   └── styles/
│       └── global.css
├── .env.example
├── astro.config.mjs
├── package.json
└── tailwind.config.mjs
```

## 🚀 Configuración

1. **Clonar el repositorio**
   ```bash
   git clone [tu-repositorio]
   cd comidaEmergenciaPWA
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Firebase**
   - Crear un proyecto en [Firebase Console](https://console.firebase.google.com)
   - Habilitar Authentication con email/contraseña
   - Crear una base de datos Firestore
   - Copiar la configuración de Firebase

4. **Variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env` y agregar tu API key de Firebase:
   ```
   VITE_FIREBASE_API_KEY=tu_api_key_aqui
   ```

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 🧞 Comandos Disponibles

| Comando                   | Acción                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Instala las dependencias                         |
| `npm run dev`             | Inicia el servidor de desarrollo en `localhost:4321` |
| `npm run build`           | Construye el sitio para producción en `./dist/` |
| `npm run preview`         | Previsualiza la construcción localmente         |

## 📱 Funcionalidades

### Autenticación
- Registro de nuevos usuarios
- Inicio de sesión con email y contraseña
- Cierre de sesión seguro
- Persistencia de sesión

### Gestión de Alimentos
- Agregar nuevos alimentos con:
  - Nombre del alimento
  - Cantidad y unidad
  - Calorías por unidad
  - Fecha de vencimiento
- Editar alimentos existentes
- Eliminar alimentos
- Vista en tiempo real de cambios

### Dashboard
- Estadísticas del inventario
- Lista de alimentos ordenada por fecha de vencimiento
- Alertas visuales para alimentos próximos a vencer
- Contador de calorías totales

## 🔧 Configuración de Firebase

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /foods/{foodId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### Authentication
- Habilitar el proveedor "Email/Password" en Firebase Console
- Configurar dominios autorizados si es necesario

## 🎨 Personalización

### Estilos
Los estilos están construidos con Tailwind CSS. Puedes personalizar:
- Colores en `tailwind.config.mjs`
- Estilos globales en `src/styles/global.css`

### Funcionalidades
- Estados de Zustand en `src/store/useStore.js`
- Servicios de Firebase en `src/firebase/`
- Componentes Astro en `src/pages/` y `src/layouts/`

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request
