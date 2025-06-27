# Arquitectura del Proyecto

## 📋 Índice

- [Visión General](#visión-general)
- [Patrones de Inicialización](#patrones-de-inicialización)
- [Arquitectura de Componentes](#arquitectura-de-componentes)
- [Flujo de Datos](#flujo-de-datos)
- [Servicios Firebase](#servicios-firebase)
- [Gestión del Estado](#gestión-del-estado)
- [Ejemplos Prácticos](#ejemplos-prácticos)

---

## 🎯 Visión General

Este proyecto utiliza una **arquitectura modular basada en componentes** con **patrones de inicialización** para gestionar el ciclo de vida de la aplicación de manera organizada y predecible.

### Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables de UI
├── firebase/           # Servicios de Firebase
├── layouts/            # Layouts base
├── pages/              # Páginas de la aplicación
├── scripts/            # Lógica de JavaScript
├── store/              # Gestión de estado
└── styles/             # Estilos globales
```

---

## 🚀 Patrones de Inicialización

### ¿Qué es el Patrón de Inicialización?

El **Patrón de Inicialización** (Initialization Pattern) es una técnica donde organizamos todo el código de configuración en funciones específicas que se ejecutan en un orden determinado.

### ¿Por qué lo necesitamos?

#### 1. **Problema del Timing del DOM**

```javascript
// ❌ PROBLEMA: El DOM puede no estar listo
document.getElementById("my-button").addEventListener("click", handler);
// Error: Cannot read property 'addEventListener' of null

// ✅ SOLUCIÓN: Inicialización controlada
export function initializeApp() {
  const button = document.getElementById("my-button");
  if (button) {
    button.addEventListener("click", handler);
  }
}
```

#### 2. **Orden de Dependencias**

```javascript
// ❌ PROBLEMA: Orden impredecible
setupAuth(); // Podría ejecutarse después
setupEventListeners(); // Falla si no hay usuario autenticado

// ✅ SOLUCIÓN: Orden controlado
export function initializeApp() {
  setupAuth(); // 1. Primero autenticación
  setupEventListeners(); // 2. Después eventos
  setupNavigation(); // 3. Finalmente navegación
}
```

### Implementación en el Proyecto

#### Dashboard (`dashboard.js`)

```javascript
export function initializeDashboard() {
  // Obtener elementos del DOM
  const elements = getDOMElements();

  // Configurar navegación
  setupNavigation();

  // Configurar event listeners
  setupEventListeners(elements);

  // Verificar autenticación
  setupAuth();
}
```

**¿Por qué?** Para evitar errores cuando la página aún no está lista.

---

## 🧩 Arquitectura de Componentes

### Filosofía: **Separación de Responsabilidades**

Cada parte del código tiene una responsabilidad específica:

#### 1. **Componentes Astro** (.astro)

- **Responsabilidad**: Estructura HTML y estilos
- **No contienen**: Lógica de JavaScript compleja

```astro
---
// ActionButtons.astro
// Solo estructura, sin lógica compleja
---

<div class="mb-6 flex flex-wrap gap-3">
  <button id="add-food-btn">
    Agregar Alimento
  </button>
  <a href="/recipes">
    🍞 Ver Recetas
  </a>
</div>
```

#### 2. **Scripts** (.js)

- **Responsabilidad**: Lógica de la aplicación
- **Contienen**: Event listeners, manipulación del DOM, llamadas a servicios

```javascript
// dashboard.js
function setupEventListeners(elements) {
  if (elements.addFoodBtn) {
    elements.addFoodBtn.addEventListener("click", () => {
      openFoodModal();
    });
  }
}
```

#### 3. **Servicios** (.js)

- **Responsabilidad**: Comunicación con Firebase
- **Contienen**: CRUD operations, business logic

```javascript
// foodService.js
class FoodService {
  async addFood(userId, foodData) {
    // Lógica para agregar alimento
  }
}
```

---

## 🔄 Flujo de Datos

### Patrón Observador (Observer Pattern)

El proyecto usa **suscripciones en tiempo real** para mantener la UI sincronizada:

```javascript
// 1. Suscripción a cambios
unsubscribeRecipes = recipeService.onRecipesChange(user.uid, (recipes) => {
  currentRecipes = recipes;
  updateRecipeStats(recipes); // Actualizar estadísticas
  renderRecipesList(recipes); // Re-renderizar lista
});

// 2. Limpieza al salir
window.addEventListener("beforeunload", () => {
  if (unsubscribeRecipes) unsubscribeRecipes();
});
```

### Flujo Completo

```
Usuario Autenticado
        ↓
Firebase (Datos)
        ↓
Service Layer (foodService, recipeService)
        ↓
Event Listeners (onFoodsChange, onRecipesChange)
        ↓
Update Functions (updateStats, renderList)
        ↓
DOM Update (UI actualizada)
```

---

## 🔥 Servicios Firebase

### Estructura de Servicios

#### 1. **foodService.js**

```javascript
class FoodService {
  // Operaciones CRUD
  async addFood(userId, foodData) {}
  async updateFood(userId, foodId, updatedData) {}
  async deleteFood(userId, foodId) {}

  // Suscripciones en tiempo real
  onFoodsChange(userId, callback) {}
}
```

#### 2. **recipeService.js**

```javascript
class RecipeService {
  // Operaciones CRUD + Lógica de Negocio
  async addRecipe(userId, recipeData) {}

  // Cálculos inteligentes
  calculateAvailableServings(recipe, foods) {
    // Lógica compleja para calcular porciones disponibles
  }

  getMissingIngredients(recipe, foods) {
    // Detectar ingredientes faltantes
  }
}
```

### Patrón Singleton

```javascript
// Solo una instancia de cada servicio
export const foodService = new FoodService();
export const recipeService = new RecipeService();
```

---

## 🗃️ Gestión del Estado

### Estado Local vs Global

#### **Estado Local** (por módulo)

```javascript
// recipes.js
let currentUser = null;
let currentRecipes = [];
let currentFoods = [];
let editingRecipeId = null;
```

#### **Estado Global** (store)

```javascript
// useStore.js
import useEmergencyFoodStore from "../store/useStore.js";
const store = useEmergencyFoodStore();
```

### Ventajas de esta Arquitectura

1. **Encapsulación**: Cada módulo maneja su propio estado
2. **Previsibilidad**: El flujo de datos es claro
3. **Debugging**: Fácil identificar dónde está el problema
4. **Mantenimiento**: Cambios aislados por módulo

---

## 💡 Ejemplos Prácticos

### Ejemplo 1: Agregar una Nueva Receta

#### Flujo Completo:

```javascript
// 1. Usuario hace clic en "Agregar Receta"
document.getElementById("add-recipe-btn").addEventListener("click", () => {
  openRecipeModal(); // 2. Abrir modal
});

// 3. Usuario llena formulario y envía
async function handleRecipeSubmit(e) {
  e.preventDefault();

  // 4. Recopilar datos del formulario
  const recipeData = collectFormData();

  // 5. Guardar en Firebase
  await recipeService.addRecipe(currentUser.uid, recipeData);

  // 6. Firebase notifica cambios automáticamente
  // 7. onRecipesChange se ejecuta
  // 8. UI se actualiza automáticamente
}
```

### Ejemplo 2: Calcular Porciones Disponibles

```javascript
// recipeService.js
calculateAvailableServings(recipe, foods) {
  let minServings = Infinity;

  // Para cada ingrediente de la receta
  recipe.ingredients.forEach(ingredient => {
    // Buscar el alimento disponible
    const availableFood = foods.find(f => f.id === ingredient.foodId);

    if (availableFood) {
      // Calcular cuántas porciones se pueden hacer con este ingrediente
      const possibleServings = Math.floor(
        availableFood.quantity / ingredient.quantity
      );

      // El ingrediente que menos cantidad tiene limita las porciones
      minServings = Math.min(minServings, possibleServings);
    } else {
      // Si no hay ingrediente, no se puede hacer la receta
      minServings = 0;
    }
  });

  return minServings === Infinity ? 0 : minServings;
}
```

---

## 🎯 Ventajas de esta Arquitectura

### ✅ **Mantenibilidad**

- Código organizado por responsabilidades
- Fácil localizar y corregir bugs
- Cambios aislados por módulo

### ✅ **Escalabilidad**

- Fácil agregar nuevas funcionalidades
- Componentes reutilizables
- Servicios extensibles

### ✅ **Debugging**

- Flujo de datos predecible
- Estado encapsulado
- Logs claros en cada capa

### ✅ **Performance**

- Suscripciones en tiempo real eficientes
- Re-renders mínimos necesarios
- Limpieza automática de recursos

---

## 🚀 Cómo Extender el Sistema

### Agregar Nueva Funcionalidad

1. **Crear Servicio**:

```javascript
// planningService.js
class PlanningService {
  async createMealPlan(userId, planData) {}
}
```

2. **Crear Componentes**:

```astro
<!-- PlanningModal.astro -->
<div id="planning-modal">
  <!-- UI del planificador -->
</div>
```

3. **Crear Script**:

```javascript
// planning.js
export function initializePlanning() {
  setupAuth();
  setupEventListeners();
  setupNavigation();
}
```

4. **Integrar en Página**:

```astro
---
// planning.astro
import Layout from "../layouts/Layout.astro";
import PlanningModal from "../components/PlanningModal.astro";
---

<Layout title="Planificación">
  <PlanningModal />
</Layout>

<script type="module">
  import { initializePlanning } from '../scripts/planning.js';
  initializePlanning();
</script>
```

---

## 🎓 Conclusión

Esta arquitectura combina lo mejor de varios patrones:

- **Patrón de Inicialización**: Control del ciclo de vida
- **Separación de Responsabilidades**: Código organizado
- **Patrón Observador**: Reactividad en tiempo real
- **Patrón Singleton**: Servicios únicos
- **Modularidad**: Componentes independientes

El resultado es un sistema **robusto**, **mantenible** y **escalable** que puede crecer con las necesidades del proyecto. 🚀
