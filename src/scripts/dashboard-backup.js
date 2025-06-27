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

// Funciones para manejo de fechas en formato español
function formatDateToSpanish(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

function formatDateToISO(spanishDate) {
  if (!spanishDate) return '';
  
  // Espera formato dd/mm/yyyy
  const parts = spanishDate.split('/');
  if (parts.length !== 3) return '';
  
  const day = parts[0];
  const month = parts[1];
  const year = parts[2];
  
  // Retorna formato yyyy-mm-dd para input type="date"
  return `${year}-${month}-${day}`;
}

// Funciones para manejo de calorías diarias
function getDailyCalories() {
  const input = document.getElementById("daily-calories");
  if (!input) return 2000; // Valor por defecto
  
  const value = parseInt(input.value);
  return isNaN(value) || value <= 0 ? 2000 : value;
}

function getNumPeople() {
  const input = document.getElementById("num-people");
  if (!input) return 1; // Valor por defecto
  
  const value = parseInt(input.value);
  return isNaN(value) || value <= 0 ? 1 : value;
}

function saveDailyCalories(calories) {
  try {
    localStorage.setItem('dailyCalories', calories.toString());
  } catch (error) {
    console.error('Error al guardar calorías diarias:', error);
  }
}

function saveNumPeople(numPeople) {
  try {
    localStorage.setItem('numPeople', numPeople.toString());
  } catch (error) {
    console.error('Error al guardar número de personas:', error);
  }
}

function loadDailyCalories() {
  try {
    const stored = localStorage.getItem('dailyCalories');
    if (stored) return parseInt(stored);
    
    // Si no hay en localStorage, usar del store
    const survivalData = store.getSurvivalData();
    return survivalData.dailyNeed > 0 ? Math.floor(survivalData.dailyNeed / Math.max(survivalData.numPeople, 1)) : 2000;
  } catch (error) {
    console.error('Error al cargar calorías diarias:', error);
    return 2000;
  }
}

function loadNumPeople() {
  try {
    const stored = localStorage.getItem('numPeople');
    if (stored) return parseInt(stored);
    
    // Si no hay en localStorage, usar del store
    const survivalData = store.getSurvivalData();
    return survivalData.numPeople || 1;
  } catch (error) {
    console.error('Error al cargar número de personas:', error);
    return 1;
  }
}

// Función de inicialización
export function initializeDashboard() {
  // Obtener elementos del DOM
  const elements = getDOMElements();
  
  // Configurar navegación
  setupNavigation(elements);
  
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
    emptyState: document.getElementById("empty-state")
  };
}

// Configurar event listeners
function setupEventListeners(elements) {
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
  const dailyCaloriesInput = document.getElementById("daily-calories");
  const numPeopleInput = document.getElementById("num-people");
  const calculateBtn = document.getElementById("calculate-survival-btn");
  
  if (dailyCaloriesInput) {
    // Cargar valor guardado
    dailyCaloriesInput.value = loadDailyCalories();
    
    // Guardar cambios
    dailyCaloriesInput.addEventListener("input", () => {
      const value = parseInt(dailyCaloriesInput.value);
      if (!isNaN(value) && value > 0) {
        saveDailyCalories(value);
      }
    });
  }
  
  if (numPeopleInput) {
    // Cargar valor guardado
    numPeopleInput.value = loadNumPeople();
    
    // Guardar cambios
    numPeopleInput.addEventListener("input", () => {
      const value = parseInt(numPeopleInput.value);
      if (!isNaN(value) && value > 0) {
        saveNumPeople(value);
      }
    });
  }
  
  // Botón calcular supervivencia
  if (calculateBtn) {
    calculateBtn.addEventListener("click", () => {
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
  
  // Configurar el input personalizado de fecha
  setupCustomDateInput();
}

// Configurar input personalizado de fecha
function setupCustomDateInput() {
  const dateInput = document.getElementById('food-expiry');
  const displayInput = document.getElementById('food-expiry-display');
  
  if (!dateInput || !displayInput) return;
  
  // Cuando cambia el input oculto, actualizar el display
  dateInput.addEventListener('change', function() {
    if (this.value) {
      const spanishDate = formatDateToSpanish(this.value);
      displayInput.value = spanishDate;
      displayInput.classList.remove('border-red-300');
    }
  });
  
  // Validación en tiempo real del input display
  displayInput.addEventListener('input', function() {
    const value = this.value;
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    
    if (dateRegex.test(value)) {
      const [, day, month, year] = value.match(dateRegex);
      
      // Validar fecha
      const date = new Date(year, month - 1, day);
      const isValidDate = date.getFullYear() == year && 
                         date.getMonth() == month - 1 && 
                         date.getDate() == day;
      
      if (isValidDate) {
        // Fecha válida - actualizar input oculto
        const isoDate = formatDateToISO(value);
        dateInput.value = isoDate;
        this.classList.remove('border-red-300');
        this.classList.add('border-green-300');
      } else {
        // Fecha inválida
        this.classList.add('border-red-300');
        this.classList.remove('border-green-300');
      }
    } else if (value.length > 0) {
      this.classList.add('border-red-300');
      this.classList.remove('border-green-300');
    } else {
      this.classList.remove('border-red-300', 'border-green-300');
    }
  });
  
  // Formateo automático mientras escribe
  displayInput.addEventListener('keyup', function(e) {
    let value = this.value.replace(/\D/g, ''); // Solo números
    
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length >= 5) {
      value = value.substring(0, 5) + '/' + value.substring(5, 9);
    }
    
    this.value = value;
  });
  
  // Permitir solo números y barras
  displayInput.addEventListener('keypress', function(e) {
    const char = String.fromCharCode(e.which);
    if (!/[0-9\/]/.test(char)) {
      e.preventDefault();
    }  });
  
  // Abrir calendario al hacer clic en el input visible
  displayInput.addEventListener('click', function() {
    // Método compatible para abrir el calendario
    dateInput.focus();
    if (dateInput.showPicker) {
      dateInput.showPicker();
    } else {
      // Fallback para navegadores que no soportan showPicker
      dateInput.click();
    }
  });
  
  // También abrir calendario al hacer focus en el input visible
  displayInput.addEventListener('focus', function() {
    // Pequeño delay para evitar conflictos
    setTimeout(() => {
      if (document.activeElement === displayInput) {
        dateInput.focus();
        if (dateInput.showPicker) {
          dateInput.showPicker();
        } else {
          dateInput.click();
        }
      }
    }, 100);
  });
}

// Funciones de utilidad
function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  
  if (!toast || !toastMessage) return;
  
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

// Función para configurar navegación
// Función para configurar navegación
function setupNavigation(elements) {
  // Botón menú móvil
  if (elements.mobileMenuBtn && elements.mobileMenu) {
    elements.mobileMenuBtn.addEventListener("click", () => {
      elements.mobileMenu.classList.toggle("hidden");
    });
  }

  // Resaltar la página actual en la navegación
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll("[id^='nav-']");
  
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath) {
      link.classList.add("bg-green-800", "text-white");
      link.classList.remove("hover:text-gray-300");
    }
  });
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
  
  // Actualizar tarjeta de supervivencia con datos del store
  updateSurvivalCard();
}

// Función para actualizar la tarjeta de supervivencia
function updateSurvivalCard() {
  const survivalData = store.getSurvivalData();
  const survivalDaysCardEl = document.getElementById("survival-days-card");
  const survivalPeopleInfoEl = document.getElementById("survival-people-info");
  
  if (survivalDaysCardEl && survivalPeopleInfoEl) {
    if (survivalData.days > 0 && survivalData.lastCalculated) {
      survivalDaysCardEl.textContent = `${survivalData.days} días`;
      survivalPeopleInfoEl.textContent = `Para ${survivalData.numPeople} persona${survivalData.numPeople > 1 ? 's' : ''}`;
    } else {
      survivalDaysCardEl.textContent = "-";
      survivalPeopleInfoEl.textContent = "Usa la calculadora";
    }
  }
}

function calculateSurvivalDays(foods, dailyCaloriesPerPerson, numPeople) {
  if (dailyCaloriesPerPerson <= 0 || numPeople <= 0 || foods.length === 0) {
    return { days: 0, usableCalories: 0, totalDailyNeed: 0 };
  }

  const totalDailyCalories = dailyCaloriesPerPerson * numPeople;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Separar alimentos por fecha de vencimiento y ordenar por fecha
  const foodsByExpiry = foods
    .map(food => {
      const expiryDate = new Date(food.expiryDate.seconds ? food.expiryDate.seconds * 1000 : food.expiryDate);
      expiryDate.setHours(23, 59, 59, 999); // Final del día de vencimiento
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        ...food,
        expiryDate: expiryDate,
        daysUntilExpiry: daysUntilExpiry,
        calories: Number(food.calories) || 0
      };
    })
    .filter(food => food.daysUntilExpiry >= 0) // Solo alimentos no vencidos
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry); // Ordenar por vencimiento

  let totalDays = 0;
  let remainingDailyCalories = totalDailyCalories;
  let currentDay = 0;
  let usedFoods = new Set();
  let totalUsableCalories = 0;

  // Crear una copia profunda de los alimentos para no modificar los originales
  const workingFoods = foodsByExpiry.map(food => ({ ...food }));

  // Simular día por día
  while (currentDay < 365 && workingFoods.some(food => !usedFoods.has(food.id) && food.daysUntilExpiry >= currentDay && food.calories > 0)) {
    const availableFoods = workingFoods.filter(food => 
      !usedFoods.has(food.id) && 
      food.daysUntilExpiry >= currentDay &&
      food.calories > 0
    );

    if (availableFoods.length === 0) break;

    // Usar alimentos que vencen más pronto primero
    for (const food of availableFoods) {
      if (remainingDailyCalories <= 0) break;
      
      const caloriesNeeded = Math.min(food.calories, remainingDailyCalories);
      remainingDailyCalories -= caloriesNeeded;
      totalUsableCalories += caloriesNeeded;
      
      // Reducir las calorías del alimento
      food.calories -= caloriesNeeded;
      
      // Si el alimento se agotó, marcarlo como usado
      if (food.calories <= 0) {
        usedFoods.add(food.id);
      }
    }

    // Si completamos las calorías del día
    if (remainingDailyCalories <= 0) {
      totalDays++;
      remainingDailyCalories = totalDailyCalories;
    } else {
      // No hay suficientes calorías disponibles para este día
      break;
    }
    
    currentDay++;
  }

  return {
    days: totalDays,
    usableCalories: totalUsableCalories,
    totalDailyNeed: totalDailyCalories
  };
}

// Función para calcular y mostrar supervivencia
function calculateAndShowSurvival() {
  const foods = store.getState().foods || [];
  const dailyCaloriesPerPerson = getDailyCalories();
  const numPeople = getNumPeople();
  
  if (foods.length === 0) {
    showToast("No tienes alimentos registrados para calcular", true);
    return;
  }
  
  // Calcular datos de supervivencia
  const survivalData = calculateSurvivalDays(foods, dailyCaloriesPerPerson, numPeople);
  
  // Preparar datos para el store
  const storeData = {
    days: survivalData.days,
    totalCalories: survivalData.usableCalories,
    dailyNeed: survivalData.totalDailyNeed,
    numPeople: numPeople
  };
  
  // Guardar en el store
  store.setSurvivalData(storeData);
  
  // Mostrar resultado en la calculadora
  const resultContainer = document.getElementById("survival-result");
  const resultDays = document.getElementById("result-days");
  const resultTotalCalories = document.getElementById("result-total-calories");
  const resultDailyNeed = document.getElementById("result-daily-need");
  
  if (resultContainer && resultDays && resultTotalCalories && resultDailyNeed) {
    resultContainer.classList.remove("hidden");
    
    // Formatear y mostrar días
    if (survivalData.days > 0) {
      resultDays.textContent = survivalData.days;
      resultDays.parentElement.className = "text-center p-3 bg-green-50 rounded-md";
      resultDays.className = "text-2xl font-bold text-green-600";
      resultDays.nextElementSibling.className = "text-sm text-green-600";
    } else {
      resultDays.textContent = "0";
      resultDays.parentElement.className = "text-center p-3 bg-red-50 rounded-md";
      resultDays.className = "text-2xl font-bold text-red-600";
      resultDays.nextElementSibling.className = "text-sm text-red-600";
    }
    
    // Mostrar calorías totales
    resultTotalCalories.textContent = survivalData.usableCalories.toLocaleString();
    
    // Mostrar necesidad diaria
    resultDailyNeed.textContent = survivalData.totalDailyNeed.toLocaleString();
    
    // Mensaje detallado
    let message = `Calculado para ${numPeople} persona${numPeople > 1 ? 's' : ''}: `;
    if (survivalData.days > 0) {
      message += `${survivalData.days} día${survivalData.days > 1 ? 's' : ''} de supervivencia`;
    } else {
      message += "No hay suficientes calorías disponibles";
    }
    
    showToast(message, survivalData.days === 0);
  }
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
              </div>              <div class="mt-1 text-sm text-gray-500 ml-7">
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
            </button>
            <div class="emoji-dropdown absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 w-48 z-10" style="display: none; grid-template-columns: repeat(6, 1fr); gap: 0.25rem;">
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
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const dropdown = this.nextElementSibling;
      
      // Cerrar otros dropdowns
      document.querySelectorAll('.emoji-dropdown').forEach(d => {
        if (d !== dropdown) d.style.display = 'none';
      });
      
      // Toggle del dropdown actual
      dropdown.style.display = dropdown.style.display === 'grid' ? 'none' : 'grid';
    });
  });
  
  // Event listeners para seleccionar emoji
  document.querySelectorAll('.emoji-option').forEach(option => {
    option.addEventListener('click', function(e) {
      e.stopPropagation();
      const emoji = this.dataset.emoji;
      const index = this.dataset.index;
      const btn = document.querySelector(`[data-index="${index}"].emoji-selector-btn`);
      
      if (btn) {
        btn.textContent = emoji;
        this.closest('.emoji-dropdown').style.display = 'none';
      }
    });
  });
  
  // Cerrar dropdowns al hacer clic fuera
  document.addEventListener('click', function() {
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
    const userEmail = document.getElementById("user-email");
    if (userEmail) {
      userEmail.textContent = user.email;
    }

    store.setUser({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    });    // Suscribirse a cambios en los alimentos
    unsubscribe = foodService.onFoodsChange(user.uid, (foods) => {
      store.setFoods(foods);
      updateStats(foods);
      renderFoodsList(foods);
    });

    // Suscribirse a cambios en el store para actualizar la UI
    const storeUnsubscribe = store.subscribe((state) => {
      updateSurvivalCard();
    });
    
    // Cargar datos iniciales de supervivencia
    updateSurvivalCard();

    // Verificar alimentos próximos a vencer y mostrar toast
    setTimeout(async () => {
      await foodService.checkExpiringFoodsAndShowToast(user.uid);
    }, 1000); // Esperar 1 segundo para que se cargue la página
  });

  // Limpiar suscripción al salir
  window.addEventListener("beforeunload", () => {
    if (unsubscribe) {
      unsubscribe();
    }
  });
}
