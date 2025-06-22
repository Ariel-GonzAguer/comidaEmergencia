# 🍱 comidaEmergencia

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01?logo=astro&logoColor=white)](https://astro.build/)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

Una aplicación web **Open Source/Código Abierto** para gestionar el inventario de alimentos de emergencia, construida con **Astro**, **Firebase** y **Tailwind CSS**. Diseñada para ser simple, intuitiva y funcional.

> **🔒 IMPORTANTE - CONFIGURACIÓN REQUERIDA**: Este proyecto requiere configuración personalizada de nombres de colecciones y documentos de Firebase por razones de seguridad. Consulte la sección [Configuración e Instalación](#-configuración-e-instalación) para instrucciones detalladas. **Es muy fácil de hacer**.

## ✨ Características

- 🔐 **Autenticación segura** con Firebase Auth (email/contraseña)
- 📦 **Gestión completa de inventario** con 9 categorías (latas, paquetes, frescos, frascos, bebidas, congelados, granos, condimentos, otros) - se estarán agregando más.
- 🏷️ **Filtrado por categorías**
- 📅 **Seguimiento de fechas de vencimiento** con alertas automáticas
- ⚠️ **Notificaciones toast** para alimentos próximos a vencer (30 días)
- 📊 **Dashboard con estadísticas** (total alimentos, próximos a vencer, calorías totales)
- 🎨 **UI moderna y amigable**
- 🔄 **Actualizaciones en tiempo real** con Firestore
- 📱 **Diseño responsivo**

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
    ├── latas: [ {id, name, quantity, unit, calories, expiryDate}, ... ]
    ├── paquetes: [ {id, name, quantity, unit, calories, expiryDate}, ... ]
    ├── frescos: [ {id, name, quantity, unit, calories, expiryDate}, ... ]
    ├── frascos: [ {id, name, quantity, unit, calories, expiryDate}, ... ]
    ├── bebidas: [ {id, name, quantity, unit, calories, expiryDate}, ... ]
    ├── congelados: [ {id, name, quantity, unit, calories, expiryDate}, ... ]
    ├── granos: [ {id, name, quantity, unit, calories, expiryDate}, ... ]
    ├── condimentos: [ {id, name, quantity, unit, calories, expiryDate}, ... ]
    └── otros: [ {id, name, quantity, unit, calories, expiryDate}, ... ]
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

- Login con email y contraseña
- Redirección automática según estado de autenticación
- Logout seguro
- Persistencia de sesión

### 🍕 Gestión de Alimentos

**Agregar alimentos** con:

- Nombre del alimento
- Categoría (🥫 Latas, 📦 Paquetes, 🥬 Frescos, 🫙 Frascos, 🥤 Bebidas, 🧊 Congelados, 🌾 Granos, 🧂 Condimentos, 📋 Otros)
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

### 🗂️ Categorías de Alimentos

El sistema organiza los alimentos en 9 categorías principales:

- 🥫 **Latas** - Conservas, atún, vegetales enlatados, salsas
- 📦 **Paquetes** - Pasta, arroz empaquetado, cereales, snacks
- 🥬 **Frescos** - Frutas, verduras, productos perecederos
- 🫙 **Frascos** - Mermeladas, miel, productos en vidrio
- 🥤 **Bebidas** - Jugos, refrescos, agua embotellada
- 🧊 **Congelados** - Carnes, pescados, vegetales congelados
- 🌾 **Granos** - Legumbres, cereales a granel, harinas
- 🧂 **Condimentos** - Especias, sal, aceites, vinagres
- 📋 **Otros** - Productos que no encajan en otras categorías

### 🔔 Notificaciones

- Toast automático para alimentos próximos a vencer
- Alertas visuales en la lista de alimentos
- Estados de color según días restantes

## 🎨 Personalización

### Colores y Estilos

- Modificar los colores en sus respectivas clases.
- Estilos globales en `src/styles/global.css`

### Unidades Disponibles

El sistema incluye las siguientes unidades de medida:

- **Gramos (g)** - Para productos secos y sólidos
- **Mililitros (ml)** - Para líquidos en pequeñas cantidades
- **Kilogramos (kg)** - Para productos en grandes cantidades
- **Litros (L)** - Para líquidos en grandes cantidades
- **Botella (750ml)** - Para bebidas embotelladas estándar
- **Paquete/Lata** - Para productos empaquetados o enlatados

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
