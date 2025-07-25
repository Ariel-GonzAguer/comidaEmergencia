# 🍱 comidaEmergencia - Rama Astro

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01?logo=astro&logoColor=white)](https://astro.build/)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/11b85a54-57de-4cc2-968f-5809d09fc3f6/deploy-status)](https://app.netlify.com/projects/comidaemergencia/deploys/deploy-status?branch=main)

Una aplicación web **Open Source/Código Abierto** para gestionar el inventario de alimentos de emergencia **y recetas**, construida con **Astro**, **Firebase** y **Tailwind CSS**. Diseñada para ser simple, intuitiva y funcional.

## ✨ Características Principales

### 🔐 Autenticación y Seguridad
- **Autenticación segura** con Firebase Auth (email/contraseña)
- **Gestión de sesiones** con persistencia automática
- **Redirección inteligente** según estado de autenticación

### 📦 Gestión Avanzada de Inventario
- **9 categorías de alimentos** (latas, paquetes, frescos, frascos, bebidas, congelados, granos, condimentos, otros)
- **Búsqueda en tiempo real** por nombre de alimento
- **Filtrado interactivo** por categorías con botones visuales
- **Ordenamiento múltiple** (nombre, categoría, fecha vencimiento, calorías, fecha agregado)
- **Campo de notas opcional** para información adicional de cada alimento

### 🍞 Sistema de Recetas Inteligente ⭐ NUEVO
- **Gestión completa de recetas** con ingredientes desde su inventario
- **Cálculo automático de porciones** disponibles según el inventario actual
- **Detección inteligente de ingredientes faltantes** para cada receta
- **Categorización por tipo de comida** (🌅 desayunos, 🍽️ almuerzos, 🌙 cenas, 🍰 postres, 🥤 bebidas, 🥨 snacks)
- **Sistema de tags personalizable** para organización avanzada
- **Contador de veces cocinada** cada receta con función "Marcar como cocinada"
- **Modal de detalles** con información completa de disponibilidad de ingredientes
- **Estadísticas en tiempo real**: total recetas, disponibles, porciones totales, más cocinada

### 🧮 Calculadora de Supervivencia ⭐ NUEVO
- **Cálculo inteligente de días de supervivencia** considerando fechas de vencimiento
- **Configuración personalizable**: calorías diarias por persona y número de personas
- **Algoritmo avanzado**: prioriza alimentos próximos a vencer para minimizar desperdicio
- **Persistencia automática**: configuración guardada en localStorage
- **Indicadores visuales**: colores según días disponibles
  - 🟢 **Verde**: >30 días de supervivencia
  - 🟡 **Amarillo**: 15-30 días de supervivencia
  - 🔴 **Rojo**: <15 días de supervivencia
- **Cálculo en tiempo real**: se actualiza automáticamente con cambios en inventario

### 🏠 Ubicaciones Personalizables
- **Gestión flexible de ubicaciones** - hasta 4 ubicaciones personalizables
- **Nombres editables** para cada ubicación (máx. 20 caracteres)
- **Selector de emoji interactivo** con 24 emojis disponibles
- **Habilitación/deshabilitación** individual de ubicaciones según necesidad
- **Persistencia local** de configuraciones personalizadas en localStorage

### 📅 Control Avanzado de Vencimientos
- **Seguimiento inteligente** de fechas de vencimiento con notificaciones automáticas
- **Input de fecha personalizado** en formato español (DD/MM/AAAA)
- **Alertas automáticas** con codificación por colores:
  - 🔴 **Vencido**: fecha pasada
  - 🟠 **Urgente**: ≤7 días para vencer
  - 🟡 **Próximo**: ≤30 días para vencer
  - 🟢 **Bueno**: >30 días
- **Notificaciones toast automáticas** al cargar la página para alimentos próximos a vencer

### ♿ Accesibilidad y UX Avanzada
- **ARIA labels completos** en todos los controles interactivos
- **Navegación por teclado** totalmente funcional con focus management
- **Compatibilidad con lectores de pantalla** y tecnologías asistivas
- **UI moderna y responsive** optimizada para móviles y escritorio
- **Navegación SPA optimizada** con hamburger menu robusto y sin conflictos
- **Animaciones sutiles** y transiciones suaves sin afectar performance
- **Estados de loading** y feedback visual en todas las operaciones

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

```javascript
[YOUR_COLLECTION_NAME] (collection)
└── [YOUR_DOCUMENT_ID] (document)
    ├── foods: [ {id, name, quantity, unit, calories, expiryDate, location, notes, dateAdded, category}, ... ]
    └── recipes: [ {id, name, description, servings, ingredients, category, tags, timesCooked, dateAdded}, ... ]
```

**Estructura de Alimentos**:
- `id`: Identificador único
- `name`: Nombre del alimento
- `quantity`: Cantidad disponible
- `unit`: Unidad de medida
- `calories`: Calorías por unidad
- `expiryDate`: Fecha de vencimiento
- `location`: Ubicación de almacenamiento
- `notes`: Notas adicionales (opcional)
- `dateAdded`: Fecha de registro
- `category`: Categoría del alimento

**Estructura de Recetas**:
- `id`: Identificador único
- `name`: Nombre de la receta
- `description`: Notas o descripción
- `servings`: Número de porciones que produce
- `ingredients`: Array de ingredientes con foodId, quantity, unit, foodName
- `category`: Tipo de comida (desayunos, almuerzos, etc.)
- `tags`: Array de etiquetas personalizables
- `timesCooked`: Contador de veces preparada
- `dateAdded`: Fecha de creación

> **🔒 IMPORTANTE - CONFIGURACIÓN REQUERIDA**: Este proyecto requiere configuración personalizada de nombres de colecciones y documentos de Firebase por razones de seguridad. Consulte la sección [Configuración e Instalación](#-configuración-e-instalación) para instrucciones detalladas.

## 📁 Estructura del Proyecto

```text
comidaEmergencia/
├── .github/                     # Archivos para GitHub
├── public/
│   └── favicon.ico
├── src/
│   ├── components/              # Componentes Astro reutilizables
│   │   ├── Navbar.astro         # Barra de navegación
│   │   ├── StatsCards.astro     # Tarjetas de estadísticas
│   │   ├── ActionButtons.astro  # Botones de acción principales
│   │   ├── SearchAndFilters.astro # Búsqueda y filtros
│   │   ├── FoodsList.astro      # Lista de alimentos
│   │   ├── FoodModal.astro      # Modal agregar/editar alimento
│   │   ├── LocationsModal.astro # Modal gestión de ubicaciones
│   │   ├── RecipesList.astro    # Lista de recetas con disponibilidad
│   │   ├── RecipesModal.astro   # Modal agregar/editar recetas
│   │   ├── expiredDateInput.astro # Input personalizado de fecha
│   │   └── Toast.astro          # Notificaciones toast
│   ├── firebase/
│   │   ├── firebaseConfig.js    # Configuración de Firebase
│   │   ├── authService.js       # Servicio de autenticación
│   │   ├── foodService.js       # Servicio de gestión de alimentos
│   │   └── recipeService.js     # Servicio de gestión de recetas
│   ├── layouts/
│   │   └── Layout.astro         # Layout principal
│   ├── pages/
│   │   ├── index.astro          # Página de Inicio/login
│   │   ├── dashboard.astro      # Dashboard principal
│   │   └── recipes.astro        # Página de recetas
│   ├── scripts/                 # Lógica modular especializada
│   │   ├── dashboard.js         # Orquestador principal del dashboard
│   │   ├── recipes.js           # Orquestador principal de recetas
│   │   ├── foodManager.js       # Gestión completa de alimentos
│   │   ├── locationManager.js   # Gestión de ubicaciones
│   │   ├── authManager.js       # Manejo de autenticación
│   │   ├── domManager.js        # Gestión de DOM y eventos
│   │   ├── navigationManager.js # Navegación centralizada y hamburger menu
│   │   ├── survivalCalculator.js # Calculadora de supervivencia ⭐ NUEVO
│   │   ├── customInputs.js      # Inputs personalizados (fecha español)
│   │   └── utils.js             # Funciones utilitarias compartidas
│   ├── store/
│   │   └── useStore.js          # Store de estado personalizado
│   └── styles/
│       └── global.css           # Estilos globales
├── .env                         # Variables de entorno
├── .gitignore                   # Archivos ignorados por Git
├── astro.config.mjs             # Configuración de Astro
├── CONTRIBUTING.md              # Guía de Contribución
├── ARCHITECTURE.md              # Documentación de arquitectura
├── LICENSE.txt                  # Licencia AGPL-3.0
├── package.json                 # Dependencias y scripts
└── README.md                    # Documentación principal
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

### 4. Configurar nombres de colección y documento

⚠️ **IMPORTANTE PARA SEGURIDAD**: Por razones de seguridad, debe elegir sus propios nombres únicos para la colección y documento de Firestore.

**Recomendaciones para nombres seguros:**
- Use nombres únicos que no sean obvios
- Incluya números o fechas
- Evite nombres genéricos como "foods", "data", "users"
- Ejemplos: `alimentos_familia_2024`, `inventario_casa_xyz`, `emergency_food_abc123`

### 5. Variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Firebase API Key
PUBLIC_VITE_FIREBASE_API_KEY=tu_api_key_aqui

# Firestore Collection/Document Names (CAMBIE ESTOS VALORES POR SEGURIDAD)
PUBLIC_FIRESTORE_COLLECTION_NAME=su_nombre_coleccion_unico
PUBLIC_FIRESTORE_DOCUMENT_ID=su_documento_id_unico
```

### 6. Configurar reglas de Firestore

⚠️ **IMPORTANTE**: Use los mismos nombres que configuró en las variables de entorno del paso anterior.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{collection_name}/{document_id} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 7. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:4321`

## 🧞 Comandos Disponibles

| Comando           | Acción                                  |
| :---------------- | :-------------------------------------- |
| `npm install`     | Instala las dependencias                |
| `npm run dev`     | Inicia el servidor de desarrollo        |
| `npm run build`   | Construye la aplicación para producción |
| `npm run preview` | Previsualiza la construcción localmente |

## 🎨 Personalización

### Unidades de Medida Disponibles

El sistema incluye **6 unidades de medida**:
- **Gramos (g)** - Para productos secos y sólidos pequeños
- **Mililitros (ml)** - Para líquidos en pequeñas cantidades
- **Kilogramos (kg)** - Para productos en grandes cantidades
- **Litros (L)** - Para líquidos en grandes cantidades
- **Botella (750ml)** - Para bebidas embotelladas estándar
- **Paquete/Lata** - Para productos empaquetados o enlatados

### Configuración de Ubicaciones

**Emojis Disponibles para Ubicaciones**:
```
🏠 ❄️ 🧊 📦 🏪 🍽️ 🥫 🚪 🏘️ 🏔️ 🧺 📋
🎒 🛒 📱 💼 🗄️ 🗃️ 📂 📁 🏆 🎯 🔒 🔑
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

## 🔧 Desarrollo y Arquitectura

Para información detallada sobre la arquitectura del proyecto, patrones de diseño implementados y guías de desarrollo, consulte **[ARCHITECTURE.md](ARCHITECTURE.md)**.

### Resumen de Arquitectura

- **Arquitectura modular** con separación clara de responsabilidades
- **Event handling centralizado** con delegation pattern
- **Navegación SPA unificada** con gestión inteligente de event listeners
- **Store personalizado** con persistencia automática
- **Servicios Firebase especializados** con lógica de negocio
- **Componentes Astro reutilizables** con props tipadas

## 🐛 Issues y Soporte

¿Encontró un bug o tiene una sugerencia de mejora?

- 🐛 **[Reportar un Bug](https://github.com/Ariel-GonzAguer/comidaEmergencia/issues/new?labels=bug&template=bug_report.md)**
- 💡 **[Solicitar una Feature](https://github.com/Ariel-GonzAguer/comidaEmergencia/issues/new?labels=enhancement&template=feature_request.md)**
- 💬 **[Discusiones Generales](https://github.com/Ariel-GonzAguer/comidaEmergencia/discussions)**

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Para contribuir:

1. **Revise el [Roadmap](#-roadmap)** para ver qué funcionalidades están planeadas
2. **Haga Fork** del proyecto
3. **Cree** una rama para su feature (`git checkout -b feature/AmazingFeature`)
4. **Desarrolle** siguiendo las guías de estilo existentes
5. **Haga Commit** de sus cambios (`git commit -m 'Add some AmazingFeature'`)
6. **Haga Push** a la rama (`git push origin feature/AmazingFeature`)
7. **Abra** un Pull Request con descripción detallada

### Áreas Prioritarias para Contribuir

- **🌍 Internacionalización** - Traducir a otros idiomas
- **🔧 PWA Implementation** - Conversión a Progressive Web App
- **📊 Data Export/Import** - Funcionalidades de backup y restore
- **📷 Barcode Scanner** - Integración de escáner de códigos
- **📈 Advanced Analytics** - Gráficos y estadísticas mejoradas
- **🏷️ Tagging System** - Sistema de etiquetas personalizables
- **🔔 Smart Notifications** - Notificaciones push inteligentes

📖 **Para guías detalladas de contribución, revise [CONTRIBUTING.md](CONTRIBUTING.md)**

## 🎯 Roadmap

### Funcionalidades Sugeridas

- **📱 PWA (Progressive Web App)**
  - Instalación como app nativa
  - Funcionamiento offline
  - Notificaciones push para vencimientos

- **📊 Exportación/Importación de Datos**
  - Backup en formato CSV/JSON
  - Importación masiva de inventarios
  - Sincronización entre dispositivos

- **📷 Escáner de Códigos de Barras**
  - Adición rápida de productos
  - Base de datos de productos integrada
  - Información nutricional automática

- **🌙 Modo Oscuro**
  - Tema dark/light switcheable
  - Preferencias del sistema automáticas
  - Mejor experiencia nocturna

- **📈 Gráficos y Estadísticas Avanzadas**
  - Visualización de consumo por categorías
  - Tendencias de vencimiento
  - Reportes mensuales/anuales

## 📄 Licencia

Este proyecto está licenciado bajo la **GNU Affero General Public License v3.0 (AGPL-3.0)** - vea el archivo [LICENSE.txt](LICENSE.txt) para más detalles.

### Implicaciones de la Licencia AGPL v3

La AGPL v3 es una licencia copyleft que garantiza que:

- ✅ **Libertad de uso**: Puede usar este software para cualquier propósito
- ✅ **Libertad de estudio**: Puede examinar el código fuente
- ✅ **Libertad de distribución**: Puede compartir copias del software
- ✅ **Libertad de modificación**: Puede modificar el software y distribuir sus cambios

**Requisitos importantes**:
- 🔄 **Copyleft fuerte**: Cualquier trabajo derivado debe usar la misma licencia
- 🌐 **Disponibilidad de código**: Si ofrece el software como servicio web, debe proporcionar el código fuente a los usuarios
- 📝 **Preservación de derechos**: Debe mantener los avisos de copyright y licencia

## 👨‍💻 Autor

**Ariel 🔥**

- GitHub: [@Ariel-GonzAguer](https://github.com/Ariel-GonzAguer)
- Sitio Web: [Gato Rojo Lab](https://gatorojolab.com)

---

<div align="center">
  <p>Hecho libre para todo el mundo 🌍</p>
  <p>⭐ ¡Dele una estrella si le gusta el proyecto!</p>
</div>