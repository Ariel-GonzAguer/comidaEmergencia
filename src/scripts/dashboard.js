// @ts-nocheck
// Lógica principal del dashboard - Refactorizada en módulos

import { authService } from "../firebase/authService.js";
import useEmergencyFoodStore from "../store/useStore.js";

// Importar módulos especializados
import {
  updateStats,
  handleFoodSubmit,
  renderFoodsList,
  openModal,
  closeModal,
  handleSearch,
  handleSort,
  handleCategoryFilter,
  initializeFoodGlobalFunctions,
  resetFilters
} from "./foodManager.js";

import {
  loadLocationOptions,
  openLocationsModal,
  closeLocationsModal,
  saveLocationsFromModal
} from "./locationManager.js";

import { setupCustomDateInput } from "./customInputs.js";

import { setupAuth } from "./authManager.js";

import { getDOMElements, setupEventListeners } from "./domManager.js";
import { setupNavigation } from "./navigationManager.js";

import {
  calculateAndShowSurvival,
  updateSurvivalCard,
  loadDailyCalories,
  loadNumPeople,
  saveDailyCalories,
  saveNumPeople
} from "./survivalCalculator.js";

// Store
const store = useEmergencyFoodStore();

// Variable global para el usuario actual
let currentUser = null;
let isInitialized = false;

// Actualizar currentUser cuando cambie la autenticación
authService.onAuthStateChanged((user) => {
  currentUser = user;
});

/**
 * Función principal de inicialización del dashboard
 */
export function initializeDashboard() {
  // Evitar inicialización múltiple en la misma carga
  if (isInitialized) {
    console.log('Dashboard ya está inicializado');
    return;
  }

  console.log('Inicializando dashboard...');

  // Obtener elementos del DOM
  const elements = getDOMElements();

  // Configurar navegación (menú móvil y estado activo)
  setupNavigation();

  // Configurar event listeners con todas las funciones manejadoras
  const handlers = {
    openModal,
    closeModal,
    openLocationsModal,
    closeLocationsModal,
    saveLocationsFromModal,
    handleSearch,
    handleSort,
    handleCategoryFilter,
    handleFoodSubmit: (e) => handleFoodSubmit(e, currentUser),
    calculateAndShowSurvival,
    loadDailyCalories,
    loadNumPeople,
    saveDailyCalories,
    saveNumPeople
  };

  setupEventListeners(elements, handlers);

  // Configurar el input personalizado de fecha
  setupCustomDateInput();

  // Configurar autenticación
  setupAuth(store, updateStats, renderFoodsList, updateSurvivalCard);

  // Inicializar funciones globales para alimentos
  initializeFoodGlobalFunctions(store);

  // Cargar ubicaciones disponibles
  loadLocationOptions();

  // Marcar como inicializado
  isInitialized = true;
  console.log('Dashboard inicializado correctamente');
}

/**
 * Función para resetear el estado del dashboard (útil para navegaciones)
 */
export function resetDashboard() {
  isInitialized = false;
  resetFilters();
  console.log('Dashboard reseteado');
}

// Configurar listeners para navegación de Astro
document.addEventListener("astro:after-swap", () => {
  // Solo reinicializar si estamos en la página del dashboard
  if (window.location.pathname === "/dashboard") {
    console.log("Reinicializando dashboard después de navegación de Astro");
    resetDashboard();
    setTimeout(() => {
      initializeDashboard();
    }, 100);
  }
});
