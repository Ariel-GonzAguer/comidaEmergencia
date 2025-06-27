# Arquitectura del Proyecto

## Estructura del Proyecto

```
src/
├── components/    # Componentes Astro reutilizables
├── firebase/      # Servicios de base de datos
├── layouts/       # Layouts base
├── pages/         # Páginas principales de la aplicación
├── scripts/       # Módulos de lógica especializados
├── store/         # Estado centralizado
└── styles/        # Estilos globales
```

## Cómo Funciona

### 1. Arquitectura Modular

El proyecto utiliza una **arquitectura por módulos** donde cada funcionalidad está separada en módulos especializados:

- **`dashboard.js`** - Orquestador principal que importa todos los módulos
- **`foodManager.js`** - Gestión completa de alimentos (CRUD, renderizado, filtros)
- **`locationManager.js`** - Gestión de ubicaciones personalizables
- **`authManager.js`** - Manejo de autenticación y navegación
- **`domManager.js`** - Gestión centralizada de elementos DOM y eventos
- **`survivalCalculator.js`** - Cálculos de supervivencia considerando vencimientos
- **`customInputs.js`** - Componentes de entrada personalizados (fecha en español)
- **`utils.js`** - Funciones utilitarias compartidas

### 2. Patrón de Inicialización Modular

Cada página principal importa y orquesta módulos especializados:

```javascript
export function initializeDashboard() {
  // Obtener elementos del DOM una sola vez
  const elements = getDOMElements();

  // Configurar navegación
  setupNavigation(elements);

  // Configurar event listeners con manejadores específicos
  const handlers = {
    handleLogout: () => handleLogout(store),
    openModal,
    closeModal,
    handleFoodSubmit: (e) => handleFoodSubmit(e, currentUser),
    calculateAndShowSurvival,
  };

  setupEventListeners(elements, handlers);

  // Configurar autenticación con callbacks
  setupAuth(store, updateStats, renderFoodsList, updateSurvivalCard);
}
```

**¿Por qué?**

- **Separación de responsabilidades**: Cada módulo tiene una función específica
- **Reutilización**: Los módulos se pueden usar en diferentes páginas
- **Mantenibilidad**: Cambios en una funcionalidad no afectan otras
- **Testabilidad**: Cada módulo se puede probar independientemente

### 3. Funcionalidades Principales

#### Dashboard (Inventario)

- **Gestión de alimentos**: Agregar/editar/eliminar con validación
- **Búsqueda inteligente**: Por nombre con filtrado en tiempo real
- **Filtros avanzados**: Por categoría y ordenamiento múltiple
- **Gestión de ubicaciones**: Ubicaciones personalizables con localStorage
- **Calculadora de supervivencia**: Cálculo considerando fechas de vencimiento
- **Estadísticas en tiempo real**: Total alimentos, próximos a vencer, calorías
- **Input de fecha personalizado**: Formato español (DD/MM/AAAA)

#### Recetas

- **Gestión completa**: Crear/editar/eliminar recetas con ingredientes
- **Cálculo inteligente**: Porciones disponibles según inventario actual
- **Ingredientes dinámicos**: Selección desde inventario existente
- **Detección de faltantes**: Ingredientes que no están disponibles
- **Categorización**: Desayunos, almuerzos, cenas, postres, bebidas, snacks
- **Tags personalizables**: Sistema de etiquetas para organización
- **Estadísticas de uso**: Contador de veces cocinada cada receta

#### Calculadora de Supervivencia ⭐ NUEVO

- **Cálculo inteligente**: Días de supervivencia considerando vencimientos
- **Configuración personalizable**: Calorías por persona y número de personas
- **Algoritmo avanzado**: Prioriza alimentos por fecha de vencimiento
- **Persistencia**: Configuración guardada en localStorage
- **Indicadores visuales**: Colores según días disponibles (verde/amarillo/rojo)

### 4. Servicios Firebase

#### foodService.js

```javascript
// Gestión completa de alimentos con validación
class FoodService {
  async addFood(userId, foodData) {}
  async updateFood(userId, foodId, data) {}
  async deleteFood(userId, foodId) {}
  onFoodsChange(userId, callback) {} // Escucha cambios en tiempo real
  checkExpiringFoodsAndShowToast(userId) {} // Notificaciones automáticas
}
```

#### recipeService.js

```javascript
// Gestión de recetas con lógica inteligente
class RecipeService {
  async addRecipe(userId, recipeData) {}
  async updateRecipe(userId, recipeId, data) {}
  async deleteRecipe(userId, recipeId) {}
  async markAsCooked(userId, recipeId) {} // Incrementa contador
  onRecipesChange(userId, callback) {} // Tiempo real

  // 🧮 Funciones de cálculo inteligente
  calculateAvailableServings(recipe, foods) {} // Porciones posibles
  getMissingIngredients(recipe, foods) {} // Ingredientes faltantes
}
```

#### authService.js

```javascript
// Autenticación y gestión de usuarios
class AuthService {
  async signInWithEmail(email, password) {}
  async signUpWithEmail(email, password) {}
  async signOut() {}
  onAuthStateChanged(callback) {} // Estado de autenticación
}
```

### 5. Flujo de Datos y Manejo de Eventos

```
Usuario Autenticado
        ↓
Firebase (Base de datos en tiempo real)
        ↓
Services (foodService, recipeService, authService)
        ↓
Event Listeners (onFoodsChange, onRecipesChange, onAuthStateChanged)
        ↓
Módulos Especializados (foodManager, survivalCalculator, etc.)
        ↓
Update Functions (updateStats, renderList, updateSurvivalCard)
        ↓
UI actualizada automáticamente
```

#### Manejo de Eventos Centralizado

```javascript
// domManager.js - Configuración centralizada de eventos
export function setupEventListeners(elements, handlers) {
  // Event delegation y configuración modular
  elements.addFoodBtn?.addEventListener("click", () => handlers.openModal());
  elements.searchInput?.addEventListener("input", handlers.handleSearch);
  elements.formElement?.addEventListener("submit", handlers.handleFoodSubmit);

  // Event listeners específicos para cada funcionalidad
  setupSurvivalCalculatorEvents(elements, handlers);
  setupFilterEvents(elements, handlers);
}
```

#### Estado Reactivo

- **Store centralizado**: `useEmergencyFoodStore()` con estado global
- **Persistencia automática**: localStorage para configuraciones
- **Suscripciones Firebase**: Actualizaciones en tiempo real
- **Estado local**: Variables de módulo para estado temporal

### 6. Navegación y Estado

#### Navegación Móvil

- **Menú hamburguesa centralizado**: Toda la lógica está en `navigationManager.js`
- **Patrón unificado**: `setupNavigation()` maneja menú móvil, enlaces activos y eventos de navegación
- **Separación de responsabilidades**: 
  - `navigationManager.js`: Menú móvil y navegación activa
  - `authManager.js`: Solo botón de logout
- **Prevención de duplicados**: Solo una fuente de la lógica del menú móvil

#### Gestión de Estado

- **Estado por página**: Cada página maneja su propio estado y lifecycle
- **Persistencia selectiva**:
  - Ubicaciones → localStorage
  - Configuración supervivencia → localStorage
  - Datos principales → Firebase en tiempo real
- **Cleanup automático**: Desuscripción de listeners al cambiar página

#### Patrón de Navegación Unificado

```javascript
// Patrón implementado en cada página:

// 1. Dashboard (dashboard.js)
import { setupNavigation } from "./navigationManager.js";
import { setupNavigation as setupAuthNavigation } from "./authManager.js";

// Configurar navegación móvil y resaltado
setupNavigation();
// Configurar solo logout
setupAuthNavigation(elements);

// 2. Recetas (recipes.js)
import { setupNavigation } from "./navigationManager.js";

// Una sola llamada que maneja todo
setupNavigation();
```

**Beneficios del patrón unificado**:
- ✅ Elimina código duplicado
- ✅ Previene conflictos entre event listeners
- ✅ Facilita el mantenimiento
- ✅ Consistencia entre páginas
- ✅ Una sola fuente de la lógica del menú móvil

#### Lifecycle de Páginas

```javascript
// recipes.js - Ejemplo de manejo de lifecycle
export function initializeRecipes() {
  if (isInitialized) return; // Evitar inicialización múltiple

  setupAuth();
  setupEventListeners();
  setupNavigation();

  isInitialized = true;
}

export function resetRecipes() {
  // Cleanup para navegación
  if (unsubscribeRecipes) unsubscribeRecipes();
  if (unsubscribeFoods) unsubscribeFoods();
  isInitialized = false;
}
```

## Características Técnicas

### ✅ Arquitectura Modular

- **Separación de responsabilidades**: Cada módulo tiene una función específica
- **Composición funcional**: Los módulos se importan y combinan según necesidad
- **Event delegation**: Manejo centralizado de eventos en `domManager.js`
- **Inyección de dependencias**: Funciones reciben dependencies como parámetros

### ✅ Tiempo Real y Performance

- **Actualizaciones automáticas**: Sin recarga manual, todo en tiempo real
- **Sincronización multi-dispositivo**: Firebase Firestore real-time
- **Optimización de queries**: Listeners específicos por usuario
- **Estado consistente**: Sincronización entre store local y Firebase

### ✅ Responsive y UX

- **Mobile-first**: Diseño prioritario para móviles
- **Menú adaptativo**: Hamburguesa en móvil, horizontal en escritorio
- **UI optimizada**: Touch-friendly con feedback visual
- **Loading states**: Indicadores de carga y estados vacíos

### ✅ Accesibilidad y Calidad

- **ARIA labels completos**: Navegación accesible
- **Keyboard navigation**: Soporte completo de teclado
- **Screen reader compatible**: Semántica HTML correcta
- **Input validation**: Validación robusta en frontend y backend

### ✅ Características Avanzadas

- **Input de fecha español**: Formato DD/MM/AAAA nativo
- **Calculadora de supervivencia**: Algoritmo inteligente considerando vencimientos
- **Sistema de notificaciones**: Toast automático para alimentos próximos a vencer
- **Búsqueda en tiempo real**: Filtrado instantáneo sin delay
- **Persistencia inteligente**: Solo datos necesarios en localStorage

## Extensibilidad

### Agregar Nueva Funcionalidad

La arquitectura modular permite agregar funcionalidades fácilmente:

#### 1. Crear Servicios Firebase

```javascript
// planningService.js
export const planningService = {
  async createMealPlan(userId, planData) {
    // Lógica del servicio
  },
  onPlansChange(userId, callback) {
    // Listener en tiempo real
  },
};
```

#### 2. Crear Módulo de Lógica

```javascript
// planningManager.js
export function handlePlanSubmit(planData) {}
export function renderPlansList(plans) {}
export function updatePlanStats(plans) {}
```

#### 3. Crear Página Principal

```javascript
// planning.js
import { planningService } from "../firebase/planningService.js";
import { handlePlanSubmit, renderPlansList } from "./planningManager.js";

export function initializePlanning() {
  const elements = getDOMElements();
  const handlers = { handlePlanSubmit /* otros handlers */ };

  setupEventListeners(elements, handlers);
  setupAuth(store, updateStats, renderPlansList);
}
```

#### 4. Integrar con Componentes Astro

```astro
<!-- planning.astro -->
<script>
  import { initializePlanning } from "../scripts/planning.js";

  document.addEventListener("DOMContentLoaded", () => {
    initializePlanning();
  });
</script>
```

### Modificar Funcionalidad Existente

Para modificar comportamiento:

1. **Lógica de negocio** → Editar módulo específico (`foodManager.js`, `recipeManager.js`)
2. **UI/UX** → Editar componente Astro (`.astro`)
3. **Datos** → Editar servicio Firebase (`.js`)
4. **Eventos** → Editar `domManager.js` o módulo específico

### Patrones de Extensión

```javascript
// Ejemplo: Agregar nueva estadística
// 1. En foodManager.js
export function updateStatsWithNewMetric(foods) {
  const newMetric = calculateNewMetric(foods);
  updateStatsDisplay({ ...existingStats, newMetric });
}

// 2. En dashboard.js
setupAuth(store, updateStatsWithNewMetric, renderFoodsList);
```

La arquitectura es **compositiva** y **extensible**, diseñada para evolucionar sin romper funcionalidad existente.
