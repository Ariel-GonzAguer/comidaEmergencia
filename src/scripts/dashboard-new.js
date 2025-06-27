// @ts-nocheck
// Lógica principal del dashboard - Refactorizada en módulos

import { authService } from "../firebase/authService.js";
import useEmergencyFoodStore from "../store/useStore.js";

// Importar módulos especializados
import { showToast } from "./utils.js";
import { 
  updateStats, 
  handleFoodSubmit, 
  renderFoodsList, 
  openModal, 
  closeModal, 
  handleSearch, 
  handleSort, 
  handleCategoryFilter,
  initializeFoodGlobalFunctions 
} from "./foodManager.js";
import { 
  loadLocationOptions, 
  openLocationsModal, 
  closeLocationsModal, 
  saveLocationsFromModal 
} from "./locationManager.js";
import { setupCustomDateInput } from "./customInputs.js";
import { setupAuth, setupNavigation, handleLogout } from "./authManager.js";
import { getDOMElements, setupEventListeners } from "./domManager.js";
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

// Variables globales
let currentUser = null;

/**
 * Función principal de inicialización del dashboard
 */
export function initializeDashboard() {
  // Obtener elementos del DOM
  const elements = getDOMElements();
  
  // Configurar navegación
  setupNavigation(elements);
  
  // Configurar event listeners con todas las funciones manejadoras
  const handlers = {
    handleLogout: () => handleLogout(store),
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
  
  // Configurar autenticación y obtener función para usuario actual
  const getCurrentUser = setupAuth(store, updateStats, renderFoodsList, updateSurvivalCard);
  
  // Actualizar referencia al usuario actual cuando cambie la autenticación
  const originalOnAuthStateChanged = authService.onAuthStateChanged;
  authService.onAuthStateChanged = (callback) => {
    return originalOnAuthStateChanged((user) => {
      currentUser = user;
      callback(user);
    });
  };
  
  // Configurar autenticación (esto manejará la actualización de currentUser internamente)
  setupAuth(store, updateStats, renderFoodsList, updateSurvivalCard);
  
  // Inicializar funciones globales para alimentos
  initializeFoodGlobalFunctions(store);
  
  // Cargar ubicaciones disponibles
  loadLocationOptions();
}
