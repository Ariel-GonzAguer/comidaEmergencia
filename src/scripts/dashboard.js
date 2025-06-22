// @ts-nocheck
// Lógica principal del dashboard

import { authService } from "../firebase/authService.js";
import { foodService } from "../firebase/foodService.js";
import { logOut } from "../firebase/firebaseConfig.js";
import useEmergencyFoodStore from "../store/useStore.js";

// Store
const store = useEmergencyFoodStore();

// Variables globales
let currentUser = null;
let editingFoodId = null;
let unsubscribe = null;

// Variables de filtros y búsqueda
let currentFilter = "all";
let searchTerm = "";
let sortBy = "name";

// Ubicaciones predeterminadas
const defaultLocations = [
  { id: "despensa", name: "Despensa", emoji: "🏠", enabled: true },
  { id: "refrigerador", name: "Refrigerador", emoji: "❄️", enabled: true },
  { id: "congelador", name: "Congelador", emoji: "🧊", enabled: true },
  { id: "alacena", name: "Alacena", emoji: "📦", enabled: true }
];

// Función de inicialización
export function initializeDashboard() {
  // Obtener elementos del DOM
  const elements = getDOMElements();
  
  // Configurar event listeners
  setupEventListeners(elements);
  
  // Verificar autenticación
  setupAuth();
}

// Obtener elementos del DOM
function getDOMElements() {
  return {
    // Elementos básicos
    userEmail: document.getElementById("user-email"),
    logoutBtn: document.getElementById("logout-btn"),
    addFoodBtn: document.getElementById("add-food-btn"),
    manageLocationsBtn: document.getElementById("manage-locations-btn"),
    
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
    emptyState: document.getElementById("empty-state")
  };
}

// Configurar event listeners
function setupEventListeners(elements) {
  // Logout
  elements.logoutBtn.addEventListener("click", handleLogout);
  
  // Botones principales
  elements.addFoodBtn.addEventListener("click", () => openModal());
  elements.manageLocationsBtn.addEventListener("click", openLocationsModal);
  
  // Botones de modal
  elements.cancelBtn.addEventListener("click", closeModal);
  elements.locationsCancelBtn.addEventListener("click", closeLocationsModal);
  elements.locationsSaveBtn.addEventListener("click", saveLocationsFromModal);
  
  // Búsqueda y filtros
  elements.searchInput.addEventListener("input", handleSearch);
  elements.sortSelect.addEventListener("change", handleSort);
  
  // Filtros por categoría
  elements.filterBtns.forEach(btn => {
    btn.addEventListener("click", handleCategoryFilter);
  });
  
  // Cerrar modales al hacer clic fuera
  elements.foodModal.addEventListener("click", (e) => {
    if (e.target === elements.foodModal) closeModal();
  });
  
  elements.locationsModal.addEventListener("click", (e) => {
    if (e.target === elements.locationsModal) closeLocationsModal();
  });
  
  // Formulario de alimentos
  elements.foodForm.addEventListener("submit", handleFoodSubmit);
}

// Funciones de utilidad
function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  
  toastMessage.textContent = message;
  toast.className = `fixed top-4 right-4 px-6 py-3 rounded-md shadow-lg transform transition-transform duration-300 ease-in-out ${
    isError ? "bg-red-500" : "bg-green-500"
  } text-white`;
  toast.style.transform = "translateX(0)";

  setTimeout(() => {
    toast.style.transform = "translateX(100%)";
  }, 3000);
}

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date.seconds ? date.seconds * 1000 : date);
  return d.toLocaleDateString("es-ES");
}

function formatDateForInput(date) {
  if (!date) return "";
  const d = new Date(date.seconds ? date.seconds * 1000 : date);
  return d.toISOString().split("T")[0];
}

function getDaysUntilExpiry(expiryDate) {
  const expiry = new Date(
    expiryDate.seconds ? expiryDate.seconds * 1000 : expiryDate
  );
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function getExpiryStatusClass(days) {
  if (days < 0) return "bg-red-100 text-red-800";
  if (days <= 7) return "bg-orange-100 text-orange-800";
  if (days <= 30) return "bg-yellow-100 text-yellow-800";
  return "bg-green-100 text-green-800";
}

function getExpiryStatusText(days) {
  if (days < 0) return `Vencido hace ${Math.abs(days)} días`;
  if (days === 0) return "Vence hoy";
  if (days === 1) return "Vence mañana";
  return `Vence en ${days} días`;
}

// Event handlers
async function handleLogout() {
  try {
    await logOut();
    store.logout();
    window.location.href = "/";
  } catch (error) {
    showToast("Error al cerrar sesión", true);
  }
}

function handleSearch(e) {
  searchTerm = e.target.value;
  const foods = store.getState().foods;
  renderFoodsList(foods);
}

function handleSort(e) {
  sortBy = e.target.value;
  const foods = store.getState().foods;
  renderFoodsList(foods);
}

function handleCategoryFilter(e) {
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
  const currentFoods = store.getState().foods;
  renderFoodsList(currentFoods);
}

async function handleFoodSubmit(e) {
  e.preventDefault();
  
  // Obtener datos del formulario
  const name = document.getElementById("food-name").value;
  const category = document.getElementById("food-category").value;
  const quantity = parseInt(document.getElementById("food-quantity").value) || 1;
  const unit = document.getElementById("food-unit").value;
  const calories = parseInt(document.getElementById("food-calories").value) || 0;
  const expiryDate = new Date(document.getElementById("food-expiry").value);
  const location = document.getElementById("food-location").value;
  const notes = document.getElementById("food-notes").value.trim();

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
  
  saveSpinner.classList.remove("hidden");
  saveText.textContent = "Guardando...";
  saveBtn.disabled = true;

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
    saveSpinner.classList.add("hidden");
    saveText.textContent = "Guardar";
    saveBtn.disabled = false;
  }
}

// Funciones principales
function updateStats(foods) {
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

function renderFoodsList(foods) {
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

// Funciones de modal
function openModal(food = null) {
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
    const locationInput = document.getElementById("food-location");
    const notesInput = document.getElementById("food-notes");
    
    if (nameInput) nameInput.value = food.name || "";
    if (categoryInput) categoryInput.value = food.category || "";
    if (quantityInput) quantityInput.value = food.quantity || "";
    if (unitInput) unitInput.value = food.unit || "";
    if (caloriesInput) caloriesInput.value = food.calories || "";
    if (expiryInput) expiryInput.value = formatDateForInput(food.expiryDate);
    if (locationInput) locationInput.value = food.location || "";
    if (notesInput) notesInput.value = food.notes || "";
  } else {
    if (foodForm) foodForm.reset();
  }

  if (foodModal) foodModal.classList.remove("hidden");
}

function closeModal() {
  const foodModal = document.getElementById("food-modal");
  if (foodModal) foodModal.classList.add("hidden");
  editingFoodId = null;
}

// Funciones globales para los botones
window.editFood = (foodId) => {
  const food = store.getState().foods.find((f) => f.id === foodId);
  if (food) {
    openModal(food);
  }
};

window.deleteFood = async (foodId) => {
  if (!confirm("¿Estás seguro de que quieres eliminar este alimento?")) {
    return;
  }

  try {
    await foodService.deleteFood(currentUser.uid, foodId);
    showToast("Alimento eliminado exitosamente");
  } catch (error) {
    showToast("Error al eliminar alimento: " + error.message, true);
  }
};

// Funciones de ubicaciones
function getStoredLocations() {
  const stored = localStorage.getItem('emergency-food-locations');
  return stored ? JSON.parse(stored) : defaultLocations;
}

function saveLocations(locations) {
  localStorage.setItem('emergency-food-locations', JSON.stringify(locations));
}

function loadLocationOptions() {
  const locations = getStoredLocations();
  const locationSelect = document.getElementById("food-location");
  
  if (!locationSelect) return;
  
  // Limpiar opciones existentes excepto la primera
  locationSelect.innerHTML = '<option value="">Seleccionar ubicación</option>';
    // Añadir ubicaciones habilitadas con sus emojis personalizados
  locations.filter(loc => loc.enabled).forEach(location => {
    const option = document.createElement('option');
    option.value = location.id;
    option.textContent = `${location.emoji} ${location.name}`;
    locationSelect.appendChild(option);
  });
}

function renderLocationsManager() {
  const locations = getStoredLocations();
  const container = document.getElementById('locations-list');
  
  if (!container) return;
  
  // Lista de emojis disponibles para ubicaciones
  const availableEmojis = [
    '🏠', '❄️', '🧊', '📦', '🏪', '🍽️', '🥫', '🚪', 
    '🏘️', '🏔️', '🧺', '📋', '🎒', '🛒', '📱', '💼',
    '🗄️', '🗃️', '📂', '📁', '🏆', '🎯', '🔒', '🔑'
  ];
  
  container.innerHTML = locations.map((location, index) => `
    <div class="p-3 border rounded-md space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3 flex-1">
          <!-- Selector de emoji -->
          <div class="relative">
            <button 
              type="button"
              class="emoji-selector-btn text-2xl border border-gray-300 rounded-md p-1 hover:bg-gray-50"
              data-index="${index}"
            >
              ${location.emoji}
            </button>            <div class="emoji-dropdown absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 w-48 z-10" style="display: none; grid-template-columns: repeat(6, 1fr); gap: 0.25rem;">
              ${availableEmojis.map(emoji => `
                <button 
                  type="button" 
                  class="emoji-option text-lg hover:bg-gray-100 rounded p-1"
                  data-emoji="${emoji}"
                  data-index="${index}"
                >
                  ${emoji}
                </button>
              `).join('')}
            </div>
          </div>
          
          <!-- Input de nombre -->
          <input 
            type="text" 
            value="${location.name}" 
            data-index="${index}"
            class="location-name-input flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm"
            maxlength="20"
            placeholder="Nombre de ubicación"
          />
        </div>
        
        <!-- Checkbox de habilitado -->
        <label class="flex items-center ml-3">
          <input 
            type="checkbox" 
            ${location.enabled ? 'checked' : ''} 
            data-index="${index}"
            class="location-enabled-checkbox mr-2"
          />
          <span class="text-sm text-gray-600">Activa</span>
        </label>
      </div>
    </div>
  `).join('');
  
  // Añadir event listeners para los selectores de emoji
  setupEmojiSelectors();
}

function setupEmojiSelectors() {
  // Event listeners para abrir/cerrar dropdowns de emoji
  document.querySelectorAll('.emoji-selector-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = btn.nextElementSibling;
      
      // Cerrar otros dropdowns
      document.querySelectorAll('.emoji-dropdown').forEach(d => {
        if (d !== dropdown) {
          d.style.display = 'none';
        }
      });
      
      // Toggle del dropdown actual
      if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        dropdown.style.display = 'grid';
      } else {
        dropdown.style.display = 'none';
      }
    });
  });
  
  // Event listeners para seleccionar emoji
  document.querySelectorAll('.emoji-option').forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const emoji = option.dataset.emoji;
      const index = option.dataset.index;
      const btn = document.querySelector(`[data-index="${index}"].emoji-selector-btn`);
      const dropdown = option.closest('.emoji-dropdown');
      
      // Actualizar el botón con el nuevo emoji
      if (btn) btn.textContent = emoji;
      
      // Cerrar el dropdown
      if (dropdown) dropdown.style.display = 'none';
    });
  });
  
  // Cerrar dropdowns al hacer clic fuera
  document.addEventListener('click', () => {
    document.querySelectorAll('.emoji-dropdown').forEach(dropdown => {
      dropdown.style.display = 'none';
    });
  });
}

function openLocationsModal() {
  renderLocationsManager();
  const locationsModal = document.getElementById("locations-modal");
  if (locationsModal) locationsModal.classList.remove("hidden");
}

function closeLocationsModal() {
  const locationsModal = document.getElementById("locations-modal");
  if (locationsModal) locationsModal.classList.add("hidden");
}

function saveLocationsFromModal() {
  const locations = getStoredLocations();
  const nameInputs = document.querySelectorAll('.location-name-input');
  const enabledInputs = document.querySelectorAll('.location-enabled-checkbox');
  const emojiButtons = document.querySelectorAll('.emoji-selector-btn');
  
  nameInputs.forEach((input, index) => {
    locations[index].name = input.value.trim() || locations[index].name;
  });
  
  enabledInputs.forEach((input, index) => {
    locations[index].enabled = input.checked;
  });
  
  emojiButtons.forEach((btn, index) => {
    locations[index].emoji = btn.textContent.trim();
  });
  
  saveLocations(locations);
  closeLocationsModal();
  showToast("Ubicaciones actualizadas correctamente");
}

// Configuración de autenticación
function setupAuth() {
  authService.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = "/";
      return;
    }

    currentUser = user;
    const userEmailEl = document.getElementById("user-email");
    if (userEmailEl) userEmailEl.textContent = user.email;

    store.setUser({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    });

    // Suscribirse a cambios en los alimentos
    unsubscribe = foodService.onFoodsChange(user.uid, (foods) => {
      store.setFoods(foods);
      updateStats(foods);
      renderFoodsList(foods);
    });

    // Verificar alimentos próximos a vencer
    setTimeout(async () => {
      await foodService.checkExpiringFoodsAndShowToast(user.uid);
    }, 1000);
  });

  // Limpiar suscripción al salir
  window.addEventListener("beforeunload", () => {
    if (unsubscribe) {
      unsubscribe();
    }
  });
}
