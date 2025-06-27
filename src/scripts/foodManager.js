// @ts-nocheck
/**
 * Módulo para manejo de alimentos
 */

import { foodService } from '../firebase/foodService.js';
import { showToast, formatDate, getDaysUntilExpiry, getExpiryStatusClass, getExpiryStatusText, formatDateToSpanish } from './utils.js';
import { getStoredLocations, loadLocationOptions } from './locationManager.js';

// Variables de estado
let editingFoodId = null;
let currentFilter = "all";
let searchTerm = "";
let sortBy = "name";
let storeInstance = null;

/**
 * Actualiza las estadísticas de alimentos
 * @param {Array} foods - Array de alimentos
 */
export function updateStats(foods) {
  const total = foods.length;
  const expiring = foods.filter(
    (food) => getDaysUntilExpiry(food.expiryDate) <= 30
  ).length;

  const calories = foods.reduce(
    (sum, food) => sum + Number(food.calories),
    0
  );

  const totalFoodsEl = document.getElementById("total-foods");
  const expiringFoodsEl = document.getElementById("expiring-foods");
  const totalCaloriesEl = document.getElementById("total-calories");

  if (totalFoodsEl) totalFoodsEl.textContent = total;
  if (expiringFoodsEl) expiringFoodsEl.textContent = expiring;
  if (totalCaloriesEl) totalCaloriesEl.textContent = calories.toLocaleString();
}

/**
 * Maneja el envío del formulario de alimentos
 * @param {Event} e - Evento del formulario
 * @param {Object} currentUser - Usuario actual
 */
export async function handleFoodSubmit(e, currentUser) {
  e.preventDefault();
  
  // Obtener datos del formulario
  const name = document.getElementById("food-name")?.value;
  const category = document.getElementById("food-category")?.value;
  const quantity = parseInt(document.getElementById("food-quantity")?.value) || 1;
  const unit = document.getElementById("food-unit")?.value;
  const calories = parseInt(document.getElementById("food-calories")?.value) || 0;
  const expiryDate = new Date(document.getElementById("food-expiry")?.value);
  const location = document.getElementById("food-location")?.value;
  const notes = document.getElementById("food-notes")?.value?.trim();

  const foodData = {
    name,
    category,
    quantity,
    unit,
    calories,
    expiryDate,
    location,
    notes
  };

  // Solo añadir dateAdded si es un nuevo alimento
  if (!editingFoodId) {
    foodData.dateAdded = new Date();
  }

  // Mostrar loading
  const saveSpinner = document.getElementById("save-spinner");
  const saveText = document.getElementById("save-text");
  const saveBtn = document.getElementById("save-btn");
  
  if (saveSpinner) saveSpinner.classList.remove("hidden");
  if (saveText) saveText.textContent = "Guardando...";
  if (saveBtn) saveBtn.disabled = true;

  try {
    if (editingFoodId) {
      await foodService.updateFood(currentUser.uid, editingFoodId, foodData);
      showToast("Alimento actualizado exitosamente");
    } else {
      await foodService.addFood(currentUser.uid, foodData);
      showToast("Alimento agregado exitosamente");
    }

    closeModal();
  } catch (error) {
    showToast("Error al guardar alimento: " + error.message, true);
  } finally {
    // Ocultar loading
    if (saveSpinner) saveSpinner.classList.add("hidden");
    if (saveText) saveText.textContent = "Guardar";
    if (saveBtn) saveBtn.disabled = false;
  }
}

/**
 * Renderiza la lista de alimentos
 * @param {Array} foods - Array de alimentos
 */
export function renderFoodsList(foods) {
  const loadingFoods = document.getElementById("loading-foods");
  const emptyState = document.getElementById("empty-state");
  const foodsContainer = document.getElementById("foods-container");

  if (loadingFoods) loadingFoods.classList.add("hidden");

  // Filtrar por búsqueda
  let filteredFoods = foods.filter(food => 
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar por categoría
  if (currentFilter !== "all") {
    filteredFoods = filteredFoods.filter((food) => food.category === currentFilter);
  }

  // Ordenar alimentos
  filteredFoods.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "category":
        return a.category.localeCompare(b.category);
      case "expiry":
        return new Date(a.expiryDate.seconds ? a.expiryDate.seconds * 1000 : a.expiryDate) - 
               new Date(b.expiryDate.seconds ? b.expiryDate.seconds * 1000 : b.expiryDate);
      case "calories":
        return b.calories - a.calories;
      case "dateAdded":
        return new Date(b.dateAdded?.seconds ? b.dateAdded.seconds * 1000 : b.dateAdded || 0) - 
               new Date(a.dateAdded?.seconds ? a.dateAdded.seconds * 1000 : a.dateAdded || 0);
      default:
        return 0;
    }
  });

  if (filteredFoods.length === 0) {
    if (emptyState) emptyState.classList.remove("hidden");
    if (foodsContainer) foodsContainer.innerHTML = "";
    return;
  }

  if (emptyState) emptyState.classList.add("hidden");

  const foodsHTML = filteredFoods
    .map((food) => {
      const daysUntilExpiry = getDaysUntilExpiry(food.expiryDate);
      const statusClass = getExpiryStatusClass(daysUntilExpiry);
      const statusText = getExpiryStatusText(daysUntilExpiry);
      
      // Mapear categorías a emojis
      const categoryEmojis = {
        latas: "🥫",
        paquetes: "📦",
        frescos: "🥬",
        frascos: "🫙",
        bebidas: "🥤",
        congelados: "🧊",
        granos: "🌾",
        condimentos: "🧂",
        otros: "📋",
      };
      const categoryEmoji = categoryEmojis[food.category] || "📋";
      
      // Mapear ubicaciones a emojis personalizados
      const locations = getStoredLocations();
      const locationData = locations.find(loc => loc.id === food.location);
      const locationEmoji = locationData ? locationData.emoji : "📍";
      const locationName = locationData ? locationData.name : (food.location || 'No especificada');

      return `
        <div class="px-4 py-4 border-b border-gray-200 hover:bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="text-lg">${categoryEmoji}</span>
                  <h4 class="text-sm font-medium text-gray-900">${food.name}</h4>
                  <span class="text-xs text-gray-500">${locationEmoji} ${locationName}</span>
                </div>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}">
                  ${statusText}
                </span>
              </div>
              <div class="mt-1 text-sm text-gray-500 ml-7">
                <span class="mr-4">Cantidad: ${food.quantity} ${food.unit}</span>
                <span class="mr-4">Calorías: ${food.calories}</span>
                <span class="mr-4">Vencimiento: ${formatDate(food.expiryDate)}</span>
              </div>
              ${food.notes ? `<div class="mt-1 text-xs text-gray-400 ml-7 italic">📝 ${food.notes}</div>` : ''}
            </div>
            <div class="flex items-center space-x-2 ml-4">
              <button
                onclick="editFood('${food.id}')"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
                aria-label="Editar ${food.name}"
              >
                Editar
              </button>
              <button
                onclick="deleteFood('${food.id}')"
                class="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer"
                aria-label="Eliminar ${food.name}"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  if (foodsContainer) {
    foodsContainer.innerHTML = foodsHTML;
  }
}

/**
 * Abre el modal de alimentos
 * @param {Object|null} food - Alimento a editar o null para crear nuevo
 */
export function openModal(food = null) {
  editingFoodId = food?.id || null;
  const modalTitle = document.getElementById("modal-title");
  const foodModal = document.getElementById("food-modal");
  const foodForm = document.getElementById("food-form");
  
  if (modalTitle) {
    modalTitle.textContent = food ? "Editar Alimento" : "Agregar Alimento";
  }
  
  // Cargar ubicaciones disponibles
  loadLocationOptions();
  
  if (food) {
    const nameInput = document.getElementById("food-name");
    const categoryInput = document.getElementById("food-category");
    const quantityInput = document.getElementById("food-quantity");
    const unitInput = document.getElementById("food-unit");
    const caloriesInput = document.getElementById("food-calories");
    const expiryInput = document.getElementById("food-expiry");
    const expiryDisplayInput = document.getElementById("food-expiry-display");
    const locationInput = document.getElementById("food-location");
    const notesInput = document.getElementById("food-notes");
    
    if (nameInput) nameInput.value = food.name || "";
    if (categoryInput) categoryInput.value = food.category || "";
    if (quantityInput) quantityInput.value = food.quantity || "";
    if (unitInput) unitInput.value = food.unit || "";
    if (caloriesInput) caloriesInput.value = food.calories || "";
    if (locationInput) locationInput.value = food.location || "";
    if (notesInput) notesInput.value = food.notes || "";
    
    // Manejar fecha con el nuevo componente personalizado
    if (food.expiryDate && expiryInput && expiryDisplayInput) {
      let dateValue;
      if (food.expiryDate.toDate) {
        dateValue = food.expiryDate.toDate();
      } else {
        dateValue = new Date(food.expiryDate);
      }
      
      const isoDate = dateValue.toISOString().split('T')[0];
      expiryInput.value = isoDate;
      expiryDisplayInput.value = formatDateToSpanish(isoDate);
    }
  } else {
    if (foodForm) foodForm.reset();
    
    // Limpiar también los campos de fecha personalizados
    const expiryDisplayInput = document.getElementById("food-expiry-display");
    const expiryInput = document.getElementById("food-expiry");
    if (expiryDisplayInput) expiryDisplayInput.value = '';
    if (expiryInput) expiryInput.value = '';
  }

  if (foodModal) foodModal.classList.remove("hidden");
}

/**
 * Cierra el modal de alimentos
 */
export function closeModal() {
  const foodModal = document.getElementById("food-modal");
  if (foodModal) foodModal.classList.add("hidden");
  editingFoodId = null;
}

/**
 * Elimina un alimento
 * @param {string} foodId - ID del alimento
 * @param {Object} currentUser - Usuario actual
 */
export async function deleteFood(foodId, currentUser) {
  if (!confirm("¿Estás seguro de que quieres eliminar este alimento?")) {
    return;
  }

  try {
    await foodService.deleteFood(currentUser.uid, foodId);
    showToast("Alimento eliminado exitosamente");
  } catch (error) {
    showToast("Error al eliminar alimento: " + error.message, true);
  }
}

/**
 * Maneja la búsqueda de alimentos
 * @param {Event} e - Evento de input
 */
export function handleSearch(e) {
  searchTerm = e.target.value;
  if (storeInstance) {
    const foods = storeInstance.getState().foods;
    renderFoodsList(foods);
  }
}

/**
 * Maneja el cambio de ordenamiento
 * @param {Event} e - Evento de cambio
 */
export function handleSort(e) {
  sortBy = e.target.value;
  if (storeInstance) {
    const foods = storeInstance.getState().foods;
    renderFoodsList(foods);
  }
}

/**
 * Maneja el filtro por categoría
 * @param {Event} e - Evento de cambio
 */
export function handleCategoryFilter(e) {
  const filterBtns = document.querySelectorAll(".filter-btn");
  
  // Remover estilos activos de todos los botones
  filterBtns.forEach((b) => {
    b.classList.remove("bg-blue-600", "text-white");
    b.classList.add("bg-gray-100", "text-gray-600");
  });

  // Aplicar estilos activos al botón clickeado
  const target = e.currentTarget;
  target.classList.remove("bg-gray-100", "text-gray-600");
  target.classList.add("bg-blue-600", "text-white");

  // Actualizar filtro actual
  currentFilter = target.id.replace("filter-", "");

  // Re-renderizar la lista
  if (storeInstance) {
    const foods = storeInstance.getState().foods;
    renderFoodsList(foods);
  }
}

/**
 * Resetea los filtros y búsqueda
 */
export function resetFilters() {
  currentFilter = "all";
  searchTerm = "";
  sortBy = "name";
  
  // Limpiar campos de UI
  const searchInput = document.getElementById("search-input");
  const sortSelect = document.getElementById("sort-select");
  
  if (searchInput) searchInput.value = "";
  if (sortSelect) sortSelect.value = "name";
  
  // Resetear botones de filtro
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) => {
    btn.classList.remove("bg-blue-600", "text-white");
    btn.classList.add("bg-gray-100", "text-gray-600");
  });
  
  // Activar el botón "all"
  const allFilterBtn = document.getElementById("filter-all");
  if (allFilterBtn) {
    allFilterBtn.classList.remove("bg-gray-100", "text-gray-600");
    allFilterBtn.classList.add("bg-blue-600", "text-white");
  }
}

// Exportar funciones para uso global
export function initializeFoodGlobalFunctions(store) {
  // Guardar referencia al store
  storeInstance = store;
  
  // Funciones globales para los botones
  window.editFood = (foodId) => {
    const food = store.getState().foods.find((f) => f.id === foodId);
    if (food) {
      openModal(food);
    }
  };

  window.deleteFood = async (foodId) => {
    const currentUser = store.getState().user;
    if (currentUser) {
      await deleteFood(foodId, currentUser);
    }
  };
}
