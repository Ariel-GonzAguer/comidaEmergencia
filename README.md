# 🍱 comidaEmergencia

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01?logo=astro&logoColor=white)](https://astro.build/)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

Una aplicación web **Open Source/Código Abierto** para gestionar el inventario de alimentos de emergencia, construida con **Astro**, **Firebase** y **Tailwind CSS**. Diseñada para ser simple, intuitiva y funcional.

> **🔒 IMPORTANTE - CONFIGURACIÓN REQUERIDA**: Este proyecto requiere configuración personalizada de nombres de colecciones y documentos de Firebase por razones de seguridad. Consulte la sección [Configuración e Instalación](#-configuración-e-instalación) para instrucciones detalladas. **Es muy fácil de hacer**.

## ✨ Características

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

### 🏠 Ubicaciones Personalizables
- **Gestión de ubicaciones** - hasta 4 ubicaciones personalizables
- **Nombres editables** para cada ubicación (máx. 20 caracteres)
- **Selector de emoji interactivo** con 24 emojis disponibles
- **Habilitación/deshabilitación** de ubicaciones según necesidad
- **Persistencia local** de configuraciones personalizadas

### 📅 Control de Vencimientos
- **Seguimiento inteligente** de fechas de vencimiento
- **Alertas automáticas** con codificación por colores
- **Notificaciones toast** para alimentos próximos a vencer (30 días)
- **Estados visuales**: vencido (rojo), próximo a vencer ≤7 días (naranja), ≤30 días (amarillo), bueno (verde)

### 📊 Dashboard Inteligente
- **Estadísticas en tiempo real** (total alimentos, próximos a vencer, calorías totales)
- **Visualización dinámica** con iconos y colores
- **Actualizaciones automáticas** al agregar/editar/eliminar alimentos

### ♿ Accesibilidad y UX
- **ARIA labels completos** en todos los controles interactivos
- **Navegación por teclado** totalmente funcional
- **Compatibilidad con lectores de pantalla**
- **UI moderna y responsive** optimizada para móviles y escritorio
- **Animaciones sutiles** y transiciones suaves

### 🔄 Funcionalidades Técnicas
- **Actualizaciones en tiempo real** con Firestore
- **Gestión de estado avanzada** con store personalizado
- **Validación de datos** para prevenir errores de Firebase
- **Manejo robusto de errores** con mensajes descriptivos

## 🏗️ Stack Tecnológico

- **[Astro](https://astro.build/)** - Framework web moderno y rápido
- **[Firebase](https://firebase.google.com/)** - Backend as a Service
  - **Firebase Auth** - Autenticación de usuarios
  - **Cloud Firestore** - Base de datos NoSQL en tiempo real
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de CSS utilitario
- **JavaScript (ES6+)** - Sin TypeScript para simplicidad → pero usted puede hacer y compartir su versión tipada 🔥
- **Vite** - Herramientas de desarrollo

## 🗄️ Estructura de Datos

### Firestore Database

```
[YOUR_COLLECTION_NAME] (collection)
└── [YOUR_DOCUMENT_ID] (document)
    ├── latas: [ {id, name, quantity, unit, calories, expiryDate, location, notes, dateAdded}, ... ]
    ├── paquetes: [ {id, name, quantity, unit, calories, expiryDate, location, notes, dateAdded}, ... ]
    ├── frescos: [ {id, name, quantity, unit, calories, expiryDate, location, notes, dateAdded}, ... ]
    ├── frascos: [ {id, name, quantity, unit, calories, expiryDate, location, notes, dateAdded}, ... ]
    ├── bebidas: [ {id, name, quantity, unit, calories, expiryDate, location, notes, dateAdded}, ... ]
    ├── congelados: [ {id, name, quantity, unit, calories, expiryDate, location, notes, dateAdded}, ... ]
    ├── granos: [ {id, name, quantity, unit, calories, expiryDate, location, notes, dateAdded}, ... ]
    ├── condimentos: [ {id, name, quantity, unit, calories, expiryDate, location, notes, dateAdded}, ... ]
    └── otros: [ {id, name, quantity, unit, calories, expiryDate, location, notes, dateAdded}, ... ]
```

### Ubicaciones Personalizadas (localStorage)

```javascript
[
  { id: "despensa", name: "Despensa", emoji: "🏠", enabled: true },
  { id: "refrigerador", name: "Refrigerador", emoji: "❄️", enabled: true },
  { id: "congelador", name: "Congelador", emoji: "🧊", enabled: true },
  { id: "alacena", name: "Alacena", emoji: "📦", enabled: true }
]
```

> **⚠️ Importante**: Debe elegir sus propios nombres para la colección y documento. Los valores mostrados son placeholders que debe reemplazar por sus propios nombres únicos.

## 📁 Estructura del Proyecto

```text
comidaEmergencia/
├── public/
│   └── favicon.ico             
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

### 4. Configurar nombres de colección y documento

⚠️ **IMPORTANTE PARA SEGURIDAD**: Por razones de seguridad, debe elegir sus propios nombres únicos para la colección y documento de Firestore.

Estos nombres se configuran a través de variables de entorno para mayor seguridad y flexibilidad.

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

> **🔒 Importante**: Elija nombres únicos y no predecibles para mayor seguridad. Nunca use valores como "users", "data", "foods", etc.

> **📋 Si ya tiene el proyecto funcionando:**
>
> - Use los mismos nombres que tiene actualmente en Firebase
> - Agregue las variables al `.env` con sus nombres existentes
> - No necesita crear nuevas colecciones/documentos

### 6. Configurar reglas de Firestore

⚠️ **IMPORTANTE**: Use los mismos nombres que configuró en las variables de entorno del paso anterior.

Con esta configuración solo las personas autenticadas pueden leer y actualizar el documento.

Cada usuario se debe agregar manualmente en la sección de Firebase Auth.

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

> **Ejemplo**: Si configuró `PUBLIC_FIRESTORE_COLLECTION_NAME=mi_comida_123` y `PUBLIC_FIRESTORE_DOCUMENT_ID=inventario_abc`, la regla sería:
>
> ```javascript
> match /mi_comida_123/inventario_abc {
>   allow read, write: if request.auth != null;
> }
> ```

### 7. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:4321`

> **✅ Checklist de configuración:**
>
> - [ ] Proyecto Firebase creado
> - [ ] Authentication habilitado
> - [ ] Firestore creado
> - [ ] Variables de entorno configuradas en `.env`
> - [ ] Nombres únicos elegidos para colección/documento
> - [ ] Reglas de Firestore actualizadas con sus nombres específicos

## 🧞 Comandos Disponibles

| Comando           | Acción                                  |
| :---------------- | :-------------------------------------- |
| `npm install`     | Instala las dependencias                |
| `npm run dev`     | Inicia el servidor de desarrollo        |
| `npm run build`   | Construye la aplicación para producción |
| `npm run preview` | Previsualiza la construcción localmente |

## 📱 Funcionalidades Principales

### 🔐 Autenticación

- **Login seguro** con email y contraseña
- **Redirección automática** según estado de autenticación
- **Logout seguro** con limpieza de estado
- **Persistencia de sesión** entre visitas

### 🍕 Gestión Avanzada de Alimentos

**Agregar/Editar alimentos** con información completa:

- **Nombre del alimento** (requerido)
- **Categoría** - 9 opciones disponibles (🥫 Latas, 📦 Paquetes, 🥬 Frescos, 🫙 Frascos, 🥤 Bebidas, 🧊 Congelados, 🌾 Granos, 🧂 Condimentos, 📋 Otros)
- **Cantidad y unidad** de medida
- **Calorías** por unidad
- **Fecha de vencimiento** con validación
- **Ubicación personalizable** (hasta 4 ubicaciones)
- **Notas opcionales** para información adicional

**Búsqueda y Filtrado**:

- 🔍 **Búsqueda en tiempo real** por nombre de alimento
- 🏷️ **Filtros por categoría** con botones interactivos
- 📊 **Ordenamiento múltiple**: nombre, categoría, fecha vencimiento, calorías, fecha agregado
- 🎯 **Resultados instantáneos** sin recargar página

**Operaciones CRUD**:

- ✏️ **Editar alimentos** existentes manteniendo historial
- 🗑️ **Eliminar alimentos** con confirmación de seguridad
- �️ **Vista en tiempo real** de todos los cambios
- � **Interface responsive** en todos los dispositivos

### 🏠 Gestión de Ubicaciones Personalizadas

**Configuración Flexible**:

- **Hasta 4 ubicaciones** configurables independientemente
- **Nombres editables** de hasta 20 caracteres
- **Selector de emoji** con 24 opciones disponibles
- **Habilitación individual** de cada ubicación

**Selector de Emoji Interactivo**:

- 🎨 **Grid visual de emojis**
- 🏠 **Emojis predefinidos**: hogar, cocina, almacenamiento
- 🔧 **Cambio en tiempo real** en formularios y listas
- 💾 **Persistencia automática** en localStorage

**Emojis Disponibles**: 🏠 ❄️ 🧊 📦 🏪 🍽️ 🥫 🚪 🏘️ 🏔️ 🧺 📋 🎒 🛒 📱 💼 🗄️ 🗃️ 📂 📁 🏆 🎯 🔒 🔑

### �Dashboard Inteligente

**Estadísticas Dinámicas**:

- **📦 Total de alimentos** - contador en tiempo real
- **⚠️ Próximos a vencer** - alimentos ≤30 días para vencer
- **⚡ Total calorías** - suma de todas las calorías registradas

**Alertas Visuales Inteligentes** por estado de vencimiento:

- 🔴 **Vencido** - productos que ya pasaron su fecha (rojo)
- 🟠 **Critical** - vencen en ≤7 días (naranja)
- � **Advertencia** - vencen en ≤30 días (amarillo)
- 🟢 **Bueno** - más de 30 días restantes (verde)

**Controles Interactivos**:

- 🎛️ **Filtros visuales** con estados activo/inactivo
- 🔄 **Actualizaciones automáticas** sin recarga manual
- 📱 **Interface adaptable** a cualquier tamaño de pantalla

### ♿ Accesibilidad y Experiencia de Usuario

**Cumplimiento de Estándares**:

- **ARIA labels** completos en todos los controles
- **Navegación por teclado** 100% funcional
- **Compatibilidad con lectores de pantalla**
- **Etiquetas descriptivas** para cada elemento interactivo

**Experiencia Optimizada**:

- **Mensajes toast** informativos para todas las acciones
- **Confirmaciones de seguridad** para operaciones críticas
- **Loading states** durante operaciones asíncronas
- **Estados de error** claros y descriptivos

### 🔔 Sistema de Notificaciones

**Alertas Automáticas**:

- 🔔 **Toast notifications** al iniciar la aplicación
- ⏰ **Verificación automática** de alimentos próximos a vencer
- 🎨 **Indicadores visuales** en la lista de alimentos
- 📊 **Contador dinámico** en el dashboard

**Estados de Notificación**:

- ✅ **Éxito** - operaciones completadas (verde)
- ❌ **Error** - problemas detectados (rojo)
- ℹ️ **Información** - datos relevantes (azul)

## 🎨 Personalización

### 🎨 Colores y Estilos

- **Temas visuales**: Modificar colores en las clases de Tailwind CSS
- **Estilos globales**: Personalizar en `src/styles/global.css`
- **Componentes**: Cada componente Astro es totalmente personalizable

### 📏 Unidades de Medida Disponibles

El sistema incluye **6 unidades de medida** para máxima flexibilidad:

- **Gramos (g)** - Para productos secos y sólidos pequeños
- **Mililitros (ml)** - Para líquidos en pequeñas cantidades
- **Kilogramos (kg)** - Para productos en grandes cantidades
- **Litros (L)** - Para líquidos en grandes cantidades
- **Botella (750ml)** - Para bebidas embotelladas estándar
- **Paquete/Lata** - Para productos empaquetados o enlatados

### 🏠 Configuración de Ubicaciones

**Personalización Completa**:

- **Nombres**: Hasta 20 caracteres por ubicación
- **Emojis**: 24 opciones disponibles en el selector
- **Estados**: Habilitar/deshabilitar ubicaciones individualmente
- **Persistencia**: Configuraciones guardadas automáticamente en localStorage

**Emojis Disponibles para Ubicaciones**:
```
🏠 ❄️ 🧊 📦 🏪 🍽️ 🥫 🚪 🏘️ 🏔️ 🧺 📋 
🎒 🛒 📱 💼 🗄️ 🗃️ 📂 📁 🏆 🎯 🔒 🔑
```

### 🔧 Personalización Técnica

**Variables de Entorno**:
- Nombres de colecciones y documentos de Firebase personalizables
- Configuración de seguridad flexible
- Entornos de desarrollo y producción separados

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

### 🏗️ Estructura del Estado

**Estado centralizado** con clase personalizada en `src/store/useStore.js`:

- **Persistencia automática** en localStorage
- **Métodos específicos** para usuarios y alimentos
- **Estados de carga** y manejo de errores
- **Sincronización** entre componentes

### 🔥 Servicios Firebase

**Servicios especializados**:

- **`authService.js`** - Autenticación y gestión de usuarios
- **`foodService.js`** - CRUD completo de alimentos con validación
- **`firebaseConfig.js`** - Configuración segura y variables de entorno

### 🧪 Validación de Datos

**Prevención de errores Firestore**:

- **Validación pre-guardado** de todos los campos
- **Valores por defecto** para campos numéricos
- **Manejo de campos undefined** y null
- **Sanitización de datos** antes del envío

### 📱 Responsive Design

**Adaptabilidad completa**:

- **Mobile-first approach** con Tailwind CSS
- **Breakpoints optimizados** (sm, md, lg, xl)
- **Touch-friendly** interfaces para dispositivos móviles
- **Grid adaptativo** para diferentes tamaños de pantalla

## 🔒 Consideraciones de Seguridad

### Configuración Personalizada Requerida

Por razones de seguridad, **NUNCA** use los nombres de colecciones y documentos tal como aparecen en ejemplos públicos. Siempre:

1. **Elija nombres únicos** para sus colecciones y documentos
2. **Use variables de entorno** para configurar estos nombres
3. **No use nombres predecibles** como "users", "data", etc.
4. **Configure las reglas de Firestore** correctamente
5. **Mantenga privadas** sus credenciales de Firebase

### Archivos de Configuración

- **`.env`**: Contiene las variables de entorno (NUNCA subir al repositorio)
- **`foodService.js`**: Lee automáticamente las variables de entorno
- **Reglas de Firestore**: Deben coincidir con los nombres en `.env`

### Reglas de Firestore

Las reglas incluidas en este proyecto permiten acceso solo a usuarios autenticados. Para mayor seguridad, considere:

- Implementar reglas más específicas por usuario
- Validar estructura de datos en las reglas
- Limitar operaciones por campos específicos

### Variables de Entorno

- Nunca incluya credenciales reales en el código
- Use archivos `.env` que no se suban al repositorio
- Considere usar diferentes proyectos Firebase para desarrollo y producción

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

¡Las contribuciones son bienvenidas! Principalmente para las funcionalidades del roadmap. Para contribuir:

1. **Revisa el [Roadmap](#-roadmap---próximas-funcionalidades)** para ver qué funcionalidades están planeadas
2. **Haz Fork** del proyecto
3. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
4. **Desarrolla** siguiendo las guías de estilo existentes
5. **Prueba** tu implementación con diferentes casos de uso
6. **Haz Commit** de tus cambios (`git commit -m 'Add some AmazingFeature'`)
7. **Haz Push** a la rama (`git push origin feature/AmazingFeature`)
8. **Abre** un Pull Request con descripción detallada

### 🎯 Áreas Prioritarias para Contribuir

- **🌍 Internacionalización** - Traducir a otros idiomas
- **🔧 PWA Implementation** - Conversión a Progressive Web App
- **📊 Data Export/Import** - Funcionalidades de backup y restore
- **📷 Barcode Scanner** - Integración de escáner de códigos
- **📈 Advanced Analytics** - Gráficos y estadísticas mejoradas
- **🏷️ Tagging System** - Sistema de etiquetas personalizables
- **🔔 Smart Notifications** - Notificaciones push inteligentes

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

## 🚀 Novedades y Mejoras Recientes

### ✨ Versión Actual - Funcionalidades Implementadas 22/6/2025

**🔍 Búsqueda y Filtrado Avanzado**:
- Búsqueda en tiempo real por nombre de alimento
- Filtros interactivos por categorías con estados visuales
- Ordenamiento múltiple (nombre, categoría, vencimiento, calorías, fecha agregado)

**🏠 Sistema de Ubicaciones Personalizable**:
- Gestión completa de hasta 4 ubicaciones
- Editor de nombres con validación (máx. 20 caracteres)
- Selector de emoji interactivo con 24 opciones
- Persistencia automática en localStorage

**♿ Accesibilidad y UX Mejoradas**:
- ARIA labels completos en todos los controles
- Navegación por teclado 100% funcional
- Compatibilidad con lectores de pantalla
- Estados de loading y confirmaciones de seguridad

**📝 Campo de Notas**:
- Información adicional opcional para cada alimento
- Visualización discreta en la lista de alimentos
- Ideal para recordatorios y detalles especiales

**🛠️ Correcciones Técnicas**:
- Eliminación del error "Unsupported field value: undefined" en Firestore
- Validación robusta de datos antes del guardado
- Manejo mejorado de campos numéricos y fechas

### 🎯 Roadmap - Próximas Funcionalidades

**🌟 Funcionalidades Sugeridas**:

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

- **🏷️ Sistema de Etiquetas**
  - Tags personalizables para alimentos
  - Filtrado por múltiples etiquetas
  - Organización más granular

- **🔔 Notificaciones Inteligentes**
  - Recordatorios personalizables
  - Alertas por email/SMS
  - Configuración de frecuencia

**🤝 ¿Quieres Contribuir?**

¡Estas funcionalidades están abiertas para contribuciones de la comunidad! Si le interesa implementar alguna:

1. Revisa los [Issues abiertos](https://github.com/Ariel-GonzAguer/comidaEmergencia/issues)
2. Crea un nuevo Issue para discutir la funcionalidad
3. Haz Fork del proyecto y comienza a desarrollar
4. Envía un Pull Request con tus cambios

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
