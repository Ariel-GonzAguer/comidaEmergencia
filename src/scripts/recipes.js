// @ts-nocheck
// Lógica principal para gestión de recetas

import { authService } from "../firebase/authService.js";
import { foodService } from "../firebase/foodService.js";
import { recipeService } from "../firebase/recipeService.js";
import useEmergencyFoodStore from "../store/useStore.js";

// Variables globales
let currentUser = null;
let currentRecipes = [];
let currentFoods = [];
let editingRecipeId = null;
let unsubscribeRecipes = null;
let unsubscribeFoods = null;
let isInitialized = false;

// Store
const store = useEmergencyFoodStore();

// Función principal de inicialización
export function initializeRecipes() {
  // Evitar inicialización múltiple
  if (isInitialized) {
    console.log('Recetas ya están inicializadas');
    return;
  }
  
  console.log('Inicializando recetas...');
  
  setupAuth();
  setupEventListeners();
  setupNavigation();
  
  // Marcar como inicializado
  isInitialized = true;
  console.log('Recetas inicializadas correctamente');
}

// Configurar autenticación
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

    // Suscribirse a cambios en recetas y alimentos
    unsubscribeRecipes = recipeService.onRecipesChange(user.uid, (recipes) => {
      currentRecipes = recipes;
      updateRecipeStats(recipes);
      renderRecipesList(recipes);
    });

    unsubscribeFoods = foodService.onFoodsChange(user.uid, (foods) => {
      currentFoods = foods;
      // Re-renderizar recetas cuando cambien los alimentos
      if (currentRecipes.length > 0) {
        renderRecipesList(currentRecipes);
      }
    });
  });

  // Limpiar suscripciones al salir o cambiar de página
  window.addEventListener("beforeunload", () => {
    if (unsubscribeRecipes) unsubscribeRecipes();
    if (unsubscribeFoods) unsubscribeFoods();
  });

  // También limpiar en navegaciones de Astro
  document.addEventListener("astro:before-preparation", () => {
    if (unsubscribeRecipes) unsubscribeRecipes();
    if (unsubscribeFoods) unsubscribeFoods();
  });
}

// Configurar event listeners
function setupEventListeners() {
  // Botón agregar receta
  const addRecipeBtn = document.getElementById("add-recipe-btn");
  if (addRecipeBtn) {
    addRecipeBtn.addEventListener("click", () => openRecipeModal());
  }

  // Botones del modal
  const cancelBtn = document.getElementById("recipe-cancel-btn");
  const saveBtn = document.getElementById("recipe-save-btn");
  const modal = document.getElementById("recipe-modal");

  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeRecipeModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeRecipeModal();
    });
  }

  // Formulario de receta
  const recipeForm = document.getElementById("recipe-form");
  if (recipeForm) {
    recipeForm.addEventListener("submit", handleRecipeSubmit);
  }
  // Botones para agregar ingredientes
  const addIngredientBtn = document.getElementById("add-ingredient-btn");

  if (addIngredientBtn) {
    addIngredientBtn.addEventListener("click", addIngredientField);
  }

  // Filtros
  const searchInput = document.getElementById("recipe-search");
  const availabilityFilter = document.getElementById("availability-filter");
  const categoryFilter = document.getElementById("recipe-category-filter");

  if (searchInput) {
    searchInput.addEventListener("input", filterRecipes);
  }

  if (availabilityFilter) {
    availabilityFilter.addEventListener("change", filterRecipes);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterRecipes);
  }
}

// Función para configurar navegación
function setupNavigation() {
  // Botón menú móvil
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
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

// Actualizar estadísticas de recetas
function updateRecipeStats(recipes) {
  const totalRecipes = recipes.length;
  let availableRecipes = 0;
  let totalServings = 0;
  let mostCookedRecipe = "";
  let maxTimesCooked = 0;

  recipes.forEach(recipe => {
    const availableServings = recipeService.calculateAvailableServings(recipe, currentFoods);

    if (availableServings > 0) {
      availableRecipes++;
      totalServings += availableServings;
    }

    if (recipe.timesCooked > maxTimesCooked) {
      maxTimesCooked = recipe.timesCooked;
      mostCookedRecipe = recipe.name;
    }
  });

  // Actualizar elementos en el DOM
  const totalRecipesEl = document.getElementById("total-recipes");
  const availableRecipesEl = document.getElementById("available-recipes");
  const totalServingsEl = document.getElementById("total-servings");
  const mostCookedEl = document.getElementById("most-cooked");

  if (totalRecipesEl) totalRecipesEl.textContent = totalRecipes;
  if (availableRecipesEl) availableRecipesEl.textContent = availableRecipes;
  if (totalServingsEl) totalServingsEl.textContent = totalServings;
  if (mostCookedEl) mostCookedEl.textContent = mostCookedRecipe || "-";
}

// Renderizar lista de recetas
function renderRecipesList(recipes) {
  const loadingEl = document.getElementById("loading-recipes");
  const noRecipesEl = document.getElementById("no-recipes");
  const containerEl = document.getElementById("recipes-container");

  if (loadingEl) loadingEl.classList.add("hidden");

  if (recipes.length === 0) {
    if (noRecipesEl) noRecipesEl.classList.remove("hidden");
    if (containerEl) containerEl.innerHTML = "";
    return;
  }

  if (noRecipesEl) noRecipesEl.classList.add("hidden");

  const recipesHTML = recipes.map(recipe => {
    const availableServings = recipeService.calculateAvailableServings(recipe, currentFoods);
    const missingIngredients = recipeService.getMissingIngredients(recipe, currentFoods);

    // Determinar estado de disponibilidad
    let statusColor = "bg-red-100 text-red-800";
    let statusText = "No disponible";

    if (availableServings >= recipe.servings) {
      statusColor = "bg-green-100 text-green-800";
      statusText = `${availableServings} porciones`;
    } else if (availableServings > 0) {
      statusColor = "bg-yellow-100 text-yellow-800";
      statusText = `${availableServings} porciones (parcial)`;
    }    // Mapear categorías a emojis
    const categoryEmojis = {
      desayunos: "🌅",
      almuerzos: "🍽️",
      cenas: "🌙",
      postres: "🍰",
      bebidas: "🥤",
      snacks: "🥨"
    };

    return `
      <div class="px-4 py-4 border-b border-gray-200 hover:bg-gray-50">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <span class="text-2xl">${categoryEmojis[recipe.category] || "🍞"}</span>
                <div>
                  <h4 class="text-lg font-medium text-gray-900">${recipe.name}</h4>
                  <p class="text-sm text-gray-500">${recipe.description || ""}</p>
                </div>
              </div>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor}">
                ${statusText}
              </span>
            </div>
              <div class="mt-2 flex items-center space-x-6 text-sm text-gray-500">
              <span class="flex items-center">
                <span class="mr-1">👥</span>
                ${recipe.servings} porciones
              </span>
              ${recipe.timesCooked > 0 ? `
                <span class="flex items-center">
                  <span class="mr-1">👨‍🍳</span>
                  Cocinada ${recipe.timesCooked} veces
                </span>
              ` : ""}
            </div>

            ${missingIngredients.length > 0 ? `
              <div class="mt-2">
                <p class="text-xs text-red-600">
                  <span class="font-medium">Ingredientes faltantes:</span>
                  ${missingIngredients.map(ing => ing.foodName).join(", ")}
                </p>
              </div>
            ` : ""}

            ${recipe.tags && recipe.tags.length > 0 ? `
              <div class="mt-2 flex flex-wrap gap-1">
                ${recipe.tags.map(tag => `
                  <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                    ${tag}
                  </span>
                `).join("")}
              </div>
            ` : ""}
          </div>
          
          <div class="flex items-center space-x-2 ml-4">
            ${availableServings > 0 ? `
              <button
                onclick="cookRecipe('${recipe.id}')"
                class="text-green-600 hover:text-green-800 text-sm font-medium cursor-pointer px-2 py-1 rounded border border-green-300 hover:bg-green-50"
                title="Marcar como cocinada"
              >
                🍞 Cocinar
              </button>
            ` : ""}
            <button
              onclick="viewRecipe('${recipe.id}')"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
              title="Ver detalles"
            >
              Ver
            </button>
            <button
              onclick="editRecipe('${recipe.id}')"
              class="text-yellow-600 hover:text-yellow-800 text-sm font-medium cursor-pointer"
              title="Editar receta"
            >
              Editar
            </button>
            <button
              onclick="deleteRecipe('${recipe.id}')"
              class="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer"
              title="Eliminar receta"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  if (containerEl) {
    containerEl.innerHTML = recipesHTML;
  }
}

// Abrir modal de receta
function openRecipeModal(recipe = null) {
  const modal = document.getElementById("recipe-modal");
  const title = document.getElementById("recipe-modal-title");
  const form = document.getElementById("recipe-form");

  if (!modal || !title || !form) return;

  editingRecipeId = recipe?.id || null;
  title.textContent = recipe ? "Editar Receta" : "Agregar Receta";
  if (recipe) {
    // Llenar formulario con datos existentes
    form.name.value = recipe.name || "";
    form.servings.value = recipe.servings || "";
    form.category.value = recipe.category || "";
    form.description.value = recipe.description || "";
    form.tags.value = recipe.tags ? recipe.tags.join(", ") : "";

    // Cargar ingredientes
    loadIngredients(recipe.ingredients || []);
  } else {
    // Limpiar formulario
    form.reset();
    clearIngredients();
    addIngredientField(); // Agregar un campo inicial
  }

  modal.classList.remove("hidden");
}

// Cerrar modal de receta
function closeRecipeModal() {
  const modal = document.getElementById("recipe-modal");
  if (modal) {
    modal.classList.add("hidden");
    editingRecipeId = null;
  }
}

// Manejar envío del formulario
async function handleRecipeSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  // Recopilar ingredientes
  const ingredients = collectIngredients();

  // Procesar tags
  const tagsString = formData.get("tags") || "";
  const tags = tagsString.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);

  const recipeData = {
    name: formData.get("name"),
    servings: parseInt(formData.get("servings")),
    category: formData.get("category"),
    description: formData.get("description"),
    ingredients,
    tags
  };

  // Mostrar loading
  const saveSpinner = document.getElementById("recipe-save-spinner");
  const saveText = document.getElementById("recipe-save-text");
  const saveBtn = document.getElementById("recipe-save-btn");

  if (saveSpinner) saveSpinner.classList.remove("hidden");
  if (saveText) saveText.textContent = "Guardando...";
  if (saveBtn) saveBtn.disabled = true;

  try {
    if (editingRecipeId) {
      await recipeService.updateRecipe(currentUser.uid, editingRecipeId, recipeData);
      showToast("Receta actualizada exitosamente");
    } else {
      await recipeService.addRecipe(currentUser.uid, recipeData);
      showToast("Receta agregada exitosamente");
    }

    closeRecipeModal();
  } catch (error) {
    showToast("Error al guardar receta: " + error.message, true);
  } finally {
    // Ocultar loading
    if (saveSpinner) saveSpinner.classList.add("hidden");
    if (saveText) saveText.textContent = "Guardar Receta";
    if (saveBtn) saveBtn.disabled = false;
  }
}

// Agregar campo de ingrediente
function addIngredientField(ingredient = null) {
  const container = document.getElementById("ingredients-container");
  if (!container) return;

  const index = container.children.length;
  const ingredientDiv = document.createElement("div");
  ingredientDiv.className = "flex gap-3 items-end";

  ingredientDiv.innerHTML = `
    <div class="flex-1">
      <select 
        class="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ingredient-select"
        name="ingredient-food-${index}"
        required
      >
        <option value="">Seleccionar alimento</option>
        ${currentFoods.map(food => `
          <option value="${food.id}" ${ingredient && ingredient.foodId === food.id ? 'selected' : ''}>
            ${food.name}
          </option>
        `).join("")}
      </select>
    </div>
    <div class="w-24">
      <input
        type="number"
        placeholder="Cantidad"
        class="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
        name="ingredient-quantity-${index}"
        min="0"
        step="0.1"
        value="${ingredient ? ingredient.quantity : ""}"
        required
      />
    </div>
    <div class="w-24">
      <select 
        class="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
        name="ingredient-unit-${index}"
        required
      >
        <option value="gramos" ${ingredient && ingredient.unit === 'gramos' ? 'selected' : ''}>g</option>
        <option value="kilogramos" ${ingredient && ingredient.unit === 'kilogramos' ? 'selected' : ''}>kg</option>
        <option value="mililitros" ${ingredient && ingredient.unit === 'mililitros' ? 'selected' : ''}>ml</option>
        <option value="litros" ${ingredient && ingredient.unit === 'litros' ? 'selected' : ''}>L</option>
        <option value="unidades" ${ingredient && ingredient.unit === 'unidades' ? 'selected' : ''}>ud</option>
      </select>
    </div>
    <button
      type="button"
      onclick="this.parentElement.remove()"
      class="text-red-600 hover:text-red-800 px-2 py-2 cursor-pointer"
      title="Eliminar ingrediente"
    >
      🗑️
    </button>
  `;

  container.appendChild(ingredientDiv);
}

// Funciones auxiliares para cargar datos
function loadIngredients(ingredients) {
  clearIngredients();
  ingredients.forEach(ingredient => {
    addIngredientField(ingredient);
  });
}

function clearIngredients() {
  const container = document.getElementById("ingredients-container");
  if (container) container.innerHTML = "";
}

function collectIngredients() {
  const ingredients = [];
  const container = document.getElementById("ingredients-container");

  if (container) {
    const ingredientDivs = container.children;

    for (let i = 0; i < ingredientDivs.length; i++) {
      const foodSelect = ingredientDivs[i].querySelector(`[name="ingredient-food-${i}"]`);
      const quantityInput = ingredientDivs[i].querySelector(`[name="ingredient-quantity-${i}"]`);
      const unitSelect = ingredientDivs[i].querySelector(`[name="ingredient-unit-${i}"]`);

      if (foodSelect && quantityInput && unitSelect && foodSelect.value) {
        const selectedFood = currentFoods.find(food => food.id === foodSelect.value);

        ingredients.push({
          foodId: foodSelect.value,
          foodName: selectedFood ? selectedFood.name : "",
          quantity: parseFloat(quantityInput.value),
          unit: unitSelect.value
        });
      }
    }
  }

  return ingredients;
}

// Filtrar recetas
function filterRecipes() {
  const searchTerm = document.getElementById("recipe-search")?.value.toLowerCase() || "";
  const availabilityFilter = document.getElementById("availability-filter")?.value || "all";
  const categoryFilter = document.getElementById("recipe-category-filter")?.value || "all";

  let filteredRecipes = currentRecipes.filter(recipe => {
    // Filtro de búsqueda
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm) ||
      (recipe.description && recipe.description.toLowerCase().includes(searchTerm)) ||
      (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm)));

    // Filtro de categoría
    const matchesCategory = categoryFilter === "all" || recipe.category === categoryFilter;

    // Filtro de disponibilidad
    let matchesAvailability = true;
    if (availabilityFilter !== "all") {
      const availableServings = recipeService.calculateAvailableServings(recipe, currentFoods);

      switch (availabilityFilter) {
        case "available":
          matchesAvailability = availableServings >= recipe.servings;
          break;
        case "partial":
          matchesAvailability = availableServings > 0 && availableServings < recipe.servings;
          break;
        case "missing":
          matchesAvailability = availableServings === 0;
          break;
      }
    }

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  renderRecipesList(filteredRecipes);
}

// Funciones globales para botones
window.editRecipe = (recipeId) => {
  const recipe = currentRecipes.find(r => r.id === recipeId);
  if (recipe) {
    openRecipeModal(recipe);
  }
};

window.deleteRecipe = async (recipeId) => {
  if (!confirm("¿Estás seguro de que quieres eliminar esta receta?")) {
    return;
  }

  try {
    await recipeService.deleteRecipe(currentUser.uid, recipeId);
    showToast("Receta eliminada exitosamente");
  } catch (error) {
    showToast("Error al eliminar receta: " + error.message, true);
  }
};

window.cookRecipe = async (recipeId) => {
  try {
    await recipeService.incrementTimesCooked(currentUser.uid, recipeId);
    showToast("¡Receta marcada como cocinada! 👨‍🍳");
  } catch (error) {
    showToast("Error al marcar receta: " + error.message, true);
  }
};

window.viewRecipe = (recipeId) => {
  const recipe = currentRecipes.find(r => r.id === recipeId); if (recipe) {
    // Implementar vista detallada de receta
    showRecipeDetails(recipe);
  }
};

// Mostrar detalles de receta
function showRecipeDetails(recipe) {
  const availableServings = recipeService.calculateAvailableServings(recipe, currentFoods);
  const missingIngredients = recipeService.getMissingIngredients(recipe, currentFoods);
  const detailsHTML = `
    <div class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-4">${recipe.name}</h2>
      
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <span class="font-medium">Porciones:</span> ${recipe.servings}
        </div>
        <div>
          <span class="font-medium">Disponibles:</span> 
          <span class="${availableServings > 0 ? 'text-green-600' : 'text-red-600'}">${availableServings} porciones</span>
        </div>
        <div>
          <span class="font-medium">Veces cocinada:</span> ${recipe.timesCooked || 0}
        </div>
        <div>
          <span class="font-medium">Categoría:</span> ${recipe.category || "Sin categoría"}
        </div>
      </div>

      ${recipe.description ? `<div class="mb-4"><h3 class="text-lg font-semibold mb-2">Notas:</h3><p class="text-gray-600">${recipe.description}</p></div>` : ""}

      <h3 class="text-lg font-semibold mb-2">Ingredientes:</h3>
      <ul class="list-disc list-inside mb-4">
        ${recipe.ingredients.map(ing => {
    const available = currentFoods.find(f => f.id === ing.foodId);
    const hasEnough = available && available.quantity >= ing.quantity;

    return `<li class="${hasEnough ? 'text-green-600' : 'text-red-600'}">
            ${ing.quantity} ${ing.unit} de ${ing.foodName}
            ${!hasEnough ? ' (faltante)' : ''}
          </li>`;
  }).join("")}
      </ul>

      ${recipe.tags && recipe.tags.length > 0 ? `
        <div class="mb-4">
          <h3 class="text-lg font-semibold mb-2">Tags:</h3>
          <div class="flex flex-wrap gap-2">
            ${recipe.tags.map(tag => `
              <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                ${tag}
              </span>
            `).join("")}
          </div>
        </div>
      ` : ""}      <div class="flex justify-end mt-6">
        <button 
          id="close-recipe-details"
          class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Cerrar
        </button>
      </div>
    </div>
  `;

  // Crear overlay
  const overlay = document.createElement("div");
  overlay.className = "fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50";
  overlay.innerHTML = detailsHTML;

  // Función para cerrar el modal
  const closeModal = () => {
    overlay.remove();
    document.body.classList.remove("overflow-hidden");
  };

  // Event listener para cerrar al hacer clic en el overlay
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  // Event listener para el botón de cerrar
  overlay.querySelector("#close-recipe-details").addEventListener("click", closeModal);

  document.body.appendChild(overlay);
  document.body.classList.add("overflow-hidden");
}

// Función auxiliar para mostrar toast
function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.className = `fixed top-4 right-4 px-6 py-3 rounded-md shadow-lg transform transition-transform duration-300 ease-in-out ${isError ? "bg-red-500" : "bg-green-500"
    } text-white`;
  toast.style.transform = "translateX(0)";

  setTimeout(() => {
    toast.style.transform = "translateX(100%)";
  }, 3000);
}

/**
 * Función para resetear el estado de recetas (útil para navegaciones)
 */
export function resetRecipes() {
  isInitialized = false;
  console.log('Recetas reseteadas');
}
