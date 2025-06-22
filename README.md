# 🍱 Alimentos de Emergencia

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01?logo=astro&logoColor=white)](https://astro.build/)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

Una aplicación web **Open Source** para gestionar el inventario de alimentos de emergencia, construida con **Astro**, **Firebase** y **Tailwind CSS**. Diseñada para ser simple, intuitiva y funcional.

## ✨ Características

- 🔐 **Autenticación segura** con Firebase Auth (email/contraseña)
- 📦 **Gestión completa de inventario** con categorías (latas, paquetes, frescos, frascos, otros)
- 🏷️ **Filtrado por categorías** con interfaz intuitiva usando emojis
- 📅 **Seguimiento de fechas de vencimiento** con alertas automáticas
- ⚠️ **Notificaciones toast** para alimentos próximos a vencer (30 días)
- 📊 **Dashboard con estadísticas** (total alimentos, próximos a vencer, calorías totales)
- 🎨 **UI moderna y amigable** con emojis en lugar de SVG
- 🔄 **Actualizaciones en tiempo real** con Firestore
- 📱 **Diseño responsivo** optimizado para móviles y escritorio

## 🏗️ Stack Tecnológico

- **[Astro](https://astro.build/)** - Framework web moderno y rápido
- **[Firebase](https://firebase.google.com/)** - Backend as a Service
  - **Firebase Auth** - Autenticación de usuarios
  - **Cloud Firestore** - Base de datos NoSQL en tiempo real
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de CSS utilitario
- **JavaScript (ES6+)** - Sin TypeScript para simplicidad
- **Vite** - Herramientas de desarrollo

## 🗄️ Estructura de Datos

### Firestore Database
```
emergenciaDataTotal(collection)
└── comidaEmergenciaCasa (document)
    ├── latas: [ {id, name, quantity, unit, calories, expiryDate}, ... ]
    ├── paquetes: [ {id, name, quantity, unit, calories, expiryDate}, ... ]
    ├── frescos: [ {id, name, quantity, unit, calories, expiryDate}, ... ]
    ├── frascos: [ {id, name, quantity, unit, calories, expiryDate}, ... ]
    └── otros: [ {id, name, quantity, unit, calories, expiryDate}, ... ]
```

## 📁 Estructura del Proyecto

```text
comidaEmergencia/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── login.astro          # Componente de login
│   ├── firebase/
│   │   ├── firebaseConfig.js    # Configuración de Firebase
│   │   ├── authService.js       # Servicio de autenticación
│   │   └── foodService.js       # Servicio de gestión de alimentos
│   ├── layouts/
│   │   └── Layout.astro         # Layout principal
│   ├── pages/
│   │   ├── index.astro          # Página de login
│   │   └── dashboard.astro      # Dashboard principal
│   ├── store/
│   │   └── useStore.js          # Store de estado (sin Zustand)
│   └── styles/
│       └── global.css           # Estilos globales
├── .env                         # Variables de entorno
├── .gitignore                   # Archivos ignorados por Git
├── astro.config.mjs             # Configuración de Astro
├── package.json                 # Dependencias y scripts
├── README.md                    # Documentación
└── tailwind.config.mjs          # Configuración de Tailwind
```

## 🚀 Configuración e Instalación

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn
- Cuenta de Firebase

### 1. Clonar el repositorio
```bash
git clone https://github.com/Ariel-GonzAguer/comidaEmergencia.git
cd comidaEmergencia
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Firebase

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar **Authentication** con el proveedor "Email/Password"
3. Crear una base de datos **Cloud Firestore**
4. Obtener la configuración del proyecto

### 4. Variables de entorno
Crear archivo `.env` en la raíz del proyecto:
```env
PUBLIC_VITE_FIREBASE_API_KEY=tu_api_key_aqui
```

### 5. Configurar reglas de Firestore
Con esta configuración solo las personas autenticadas pueden leer y actualizar el documento.

Cada usuario se debe agregar manualmente en la sección de Firebase Auth.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /emergenciaDataTotal/comidaEmergenciaCasa {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 6. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:4321`

## 🧞 Comandos Disponibles

| Comando                   | Acción                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Instala las dependencias                         |
| `npm run dev`             | Inicia el servidor de desarrollo                |
| `npm run build`           | Construye la aplicación para producción         |
| `npm run preview`         | Previsualiza la construcción localmente         |

## 📱 Funcionalidades Principales

### 🔐 Autenticación
- Login con email y contraseña
- Redirección automática según estado de autenticación
- Logout seguro
- Persistencia de sesión

### 🍕 Gestión de Alimentos
**Agregar alimentos** con:
- Nombre del alimento
- Categoría (🥫 Latas, 📦 Paquetes, 🥬 Frescos, 🫙 Frascos, 📋 Otros)
- Cantidad y unidad
- Calorías por unidad
- Fecha de vencimiento

**Funciones adicionales**:
- ✏️ Editar alimentos existentes
- 🗑️ Eliminar alimentos
- 🔍 Filtrar por categorías
- 📊 Vista en tiempo real de cambios

### 📊 Dashboard
- **Estadísticas dinámicas**:
  - Total de alimentos
  - Alimentos próximos a vencer (≤30 días)
  - Total de calorías
- **Alertas visuales** por estado de vencimiento
- **Filtros interactivos** por categoría
- **Interface amigable** con emojis

### 🔔 Notificaciones
- Toast automático para alimentos próximos a vencer
- Alertas visuales en la lista de alimentos
- Estados de color según días restantes

## 🎨 Personalización

### Colores y Estilos
- Modificar los colores en sus respectivas clases.
- Estilos globales en `src/styles/global.css`

### Categorías de Alimentos
Editar en `src/pages/dashboard.astro`:
```javascript
const categoryEmojis = {
  latas: "🥫",
  paquetes: "📦", 
  frescos: "🥬",
  frascos: "🫙",
  otros: "📋"
};
```

## 🚀 Despliegue

### Netlify
1. Conectar repositorio a Netlify
2. Configurar variables de entorno
3. Deploy automático

### Vercel
1. Importar proyecto a Vercel
2. Configurar variables de entorno
3. Deploy automático

## 🔧 Desarrollo

### Estructura del Estado
El estado se maneja con una clase personalizada en `src/store/useStore.js`:
- Persistencia en localStorage
- Métodos para usuarios y alimentos
- Estado de carga

### Servicios Firebase
- `authService.js` - Autenticación
- `foodService.js` - CRUD de alimentos  
- `firebaseConfig.js` - Configuración

## 🐛 Issues y Soporte

¿Encontró un bug o tiene una sugerencia de mejora?

- 🐛 **[Reportar un Bug](https://github.com/Ariel-GonzAguer/comidaEmergencia/issues/new?labels=bug&template=bug_report.md)**
- 💡 **[Solicitar una Feature](https://github.com/Ariel-GonzAguer/comidaEmergencia/issues/new?labels=enhancement&template=feature_request.md)**
- 💬 **[Discusiones Generales](https://github.com/Ariel-GonzAguer/comidaEmergencia/discussions)**

Antes de crear un issue:
- Verifique que no exista uno similar
- Incluya información sobre su entorno (OS, navegador, versión de Node.js)
- Proporcione pasos claros para reproducir el problema

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Para contribuir:

1. **Haga Fork** del proyecto
2. **Cree** una rama para su feature (`git checkout -b feature/AmazingFeature`)
3. **Haga Commit** de sus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Haga Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abra** un Pull Request

📖 **Para guías detalladas de contribución, revisa [CONTRIBUTING.md](CONTRIBUTING.md)**

### Guías de Contribución
- Mantener el código simple y legible
- Usar emojis o íconos consistentes en la UI
- Seguir las convenciones de naming existentes
- Añadir comentarios para lógica compleja
- Respetar los términos de la licencia AGPL v3
- Asegurar que cualquier modificación mantenga la disponibilidad del código fuente

## 📄 Licencia

Este proyecto está licenciado bajo la **GNU Affero General Public License v3.0 (AGPL-3.0)** - vea el archivo [LICENCE.txt](LICENCE.txt) para más detalles.

### ⚖️ Implicaciones de la Licencia AGPL v3

La AGPL v3 es una licencia copyleft que garantiza que:

- ✅ **Libertad de uso**: Puede usar este software para cualquier propósito
- ✅ **Libertad de estudio**: Puede examinar el código fuente
- ✅ **Libertad de distribución**: Puede compartir copias del software
- ✅ **Libertad de modificación**: Puede modificar el software y distribuir sus cambios

**Requisitos importantes**:
- 🔄 **Copyleft fuerte**: Cualquier trabajo derivado debe usar la misma licencia
- 🌐 **Disponibilidad de código**: Si ofrece el software como servicio web, debe proporcionar el código fuente a los usuarios
- 📝 **Preservación de derechos**: Debe mantener los avisos de copyright y licencia

Para más información sobre la AGPL v3, visita: https://www.gnu.org/licenses/agpl-3.0.html

## 👨‍💻 Autor

**Ariel González Aguer**

- GitHub: [@Ariel-GonzAguer](https://github.com/Ariel-GonzAguer)

## 🙏 Agradecimientos

- [Astro](https://astro.build/) por el increíble framework
- [Firebase](https://firebase.google.com/) por el backend confiable
- [Tailwind CSS](https://tailwindcss.com/) por el styling eficiente
- La comunidad open source por la inspiración

---

<div align="center">
  <p>Hecho con ❤️ para la gestión de alimentos de emergencia</p>
  <p>⭐ ¡Dele una estrella si le gusta el proyecto!</p>
</div>
