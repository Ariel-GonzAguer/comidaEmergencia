// @ts-nocheck
/**
 * Módulo para manejo del DOM y event listeners
 */

/**
 * Obtiene todos los elementos del DOM necesarios para el dashboard
 * @returns {Object} Objeto con referencias a elementos del DOM
 */
export function getDOMElements() {
  return {
    // Elementos básicos
    userEmail: document.getElementById("user-email"),
    logoutBtn: document.getElementById("logout-btn"),
    addFoodBtn: document.getElementById("add-food-btn"),
    manageLocationsBtn: document.getElementById("manage-locations-btn"),
    
    // Navegación móvil
    mobileMenuBtn: document.getElementById("mobile-menu-btn"),
    mobileMenu: document.getElementById("mobile-menu"),
    
    // Modales
    foodModal: document.getElementById("food-modal"),
    locationsModal: document.getElementById("locations-modal"),
    foodForm: document.getElementById("food-form"),
    modalTitle: document.getElementById("modal-title"),
    
    // Botones de modal
    cancelBtn: document.getElementById("cancel-btn"),
    locationsCancelBtn: document.getElementById("locations-cancel-btn"),
    locationsSaveBtn: document.getElementById("locations-save-btn"),
    saveBtn: document.getElementById("save-btn"),
    
    // Toast
    toast: document.getElementById("toast"),
    toastMessage: document.getElementById("toast-message"),
    
    // Búsqueda y filtros
    searchInput: document.getElementById("search-input"),
    sortSelect: document.getElementById("sort-select"),
    filterBtns: document.querySelectorAll(".filter-btn"),
    
    // Estadísticas
    totalFoods: document.getElementById("total-foods"),
    expiringFoods: document.getElementById("expiring-foods"),
    totalCalories: document.getElementById("total-calories"),
    
    // Lista de alimentos
    foodsList: document.getElementById("foods-list"),
    foodsContainer: document.getElementById("foods-container"),
    loadingFoods: document.getElementById("loading-foods"),
    emptyState: document.getElementById("empty-state"),
    
    // Calculadora de supervivencia
    dailyCaloriesInput: document.getElementById("daily-calories"),
    numPeopleInput: document.getElementById("num-people"),
    calculateBtn: document.getElementById("calculate-survival-btn")
  };
}

/**
 * Configura todos los event listeners del dashboard
 * @param {Object} elements - Elementos del DOM
 * @param {Object} handlers - Objeto con todas las funciones manejadoras
 */
export function setupEventListeners(elements, handlers) {
  const {
    handleLogout,
    openModal,
    closeModal,
    openLocationsModal,
    closeLocationsModal,
    saveLocationsFromModal,
    handleSearch,
    handleSort,
    handleCategoryFilter,
    handleFoodSubmit,
    calculateAndShowSurvival,
    loadDailyCalories,
    loadNumPeople,
    saveDailyCalories,
    saveNumPeople
  } = handlers;

  // Logout
  elements.logoutBtn?.addEventListener("click", handleLogout);
  
  // Botones principales
  elements.addFoodBtn?.addEventListener("click", () => openModal());
  elements.manageLocationsBtn?.addEventListener("click", openLocationsModal);
  
  // Botones de modal
  elements.cancelBtn?.addEventListener("click", closeModal);
  elements.locationsCancelBtn?.addEventListener("click", closeLocationsModal);
  elements.locationsSaveBtn?.addEventListener("click", saveLocationsFromModal);
  
  // Búsqueda y filtros
  elements.searchInput?.addEventListener("input", handleSearch);
  elements.sortSelect?.addEventListener("change", handleSort);
  
  // Filtros por categoría
  elements.filterBtns?.forEach(btn => {
    btn.addEventListener("click", handleCategoryFilter);
  });

  // Input de calorías diarias y número de personas
  if (elements.dailyCaloriesInput) {
    // Cargar valor guardado
    elements.dailyCaloriesInput.value = loadDailyCalories();
    
    // Guardar cambios
    elements.dailyCaloriesInput.addEventListener("input", () => {
      const value = parseInt(elements.dailyCaloriesInput.value);
      if (!isNaN(value) && value > 0) {
        saveDailyCalories(value);
      }
    });
  }
  
  if (elements.numPeopleInput) {
    // Cargar valor guardado
    elements.numPeopleInput.value = loadNumPeople();
    
    // Guardar cambios
    elements.numPeopleInput.addEventListener("input", () => {
      const value = parseInt(elements.numPeopleInput.value);
      if (!isNaN(value) && value > 0) {
        saveNumPeople(value);
      }
    });
  }
  
  // Botón calcular supervivencia
  if (elements.calculateBtn) {
    elements.calculateBtn.addEventListener("click", () => {
      calculateAndShowSurvival();
    });
  }
  
  // Cerrar modales al hacer clic fuera
  elements.foodModal?.addEventListener("click", (e) => {
    if (e.target === elements.foodModal) closeModal();
  });
  
  elements.locationsModal?.addEventListener("click", (e) => {
    if (e.target === elements.locationsModal) closeLocationsModal();
  });

  // Formulario de alimentos
  elements.foodForm?.addEventListener("submit", handleFoodSubmit);
}
