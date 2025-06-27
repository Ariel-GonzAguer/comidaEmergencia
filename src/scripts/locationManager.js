// @ts-nocheck
/**
 * Módulo para manejo de ubicaciones de almacenamiento de alimentos
 */

import { showToast } from './utils.js';

// Ubicaciones predeterminadas
const defaultLocations = [
  { id: "despensa", name: "Despensa", emoji: "🏠", enabled: true },
  { id: "refrigerador", name: "Refrigerador", emoji: "❄️", enabled: true },
  { id: "congelador", name: "Congelador", emoji: "🧊", enabled: true },
  { id: "alacena", name: "Alacena", emoji: "📦", enabled: true }
];

// Lista de emojis disponibles para ubicaciones
const availableEmojis = [
  '🏠', '❄️', '🧊', '📦', '🏪', '🍽️', '🥫', '🚪', 
  '🏘️', '🏔️', '🧺', '📋', '🎒', '🛒', '📱', '💼',
  '🗄️', '🗃️', '📂', '📁', '🏆', '🎯', '🔒', '🔑'
];

/**
 * Obtiene las ubicaciones almacenadas en localStorage
 * @returns {Array} Array de ubicaciones
 */
export function getStoredLocations() {
  const stored = localStorage.getItem('emergency-food-locations');
  return stored ? JSON.parse(stored) : defaultLocations;
}

/**
 * Guarda las ubicaciones en localStorage
 * @param {Array} locations - Array de ubicaciones a guardar
 */
export function saveLocations(locations) {
  localStorage.setItem('emergency-food-locations', JSON.stringify(locations));
}

/**
 * Carga las opciones de ubicación en el select del formulario
 */
export function loadLocationOptions() {
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

/**
 * Renderiza el gestor de ubicaciones en el modal
 */
export function renderLocationsManager() {
  const locations = getStoredLocations();
  const container = document.getElementById('locations-list');
  
  if (!container) return;
  
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
            <div class="emoji-dropdown absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 w-48 z-10 hidden grid-cols-6 gap-1">
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

/**
 * Configura los event listeners para los selectores de emoji
 */
function setupEmojiSelectors() {
  // Event listeners para abrir/cerrar dropdowns de emoji
  document.querySelectorAll('.emoji-selector-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const dropdown = this.nextElementSibling;
      
      // Cerrar otros dropdowns
      document.querySelectorAll('.emoji-dropdown').forEach(d => {
        if (d !== dropdown) {
          d.classList.add('hidden');
          d.classList.remove('grid');
        }
      });
      
      // Toggle del dropdown actual
      if (dropdown.classList.contains('hidden')) {
        dropdown.classList.remove('hidden');
        dropdown.classList.add('grid');
      } else {
        dropdown.classList.add('hidden');
        dropdown.classList.remove('grid');
      }
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
        this.closest('.emoji-dropdown').classList.add('hidden');
        this.closest('.emoji-dropdown').classList.remove('grid');
      }
    });
  });
  
  // Cerrar dropdowns al hacer clic fuera
  document.addEventListener('click', function() {
    document.querySelectorAll('.emoji-dropdown').forEach(dropdown => {
      dropdown.classList.add('hidden');
      dropdown.classList.remove('grid');
    });
  });
}

/**
 * Abre el modal de gestión de ubicaciones
 */
export function openLocationsModal() {
  renderLocationsManager();
  const locationsModal = document.getElementById("locations-modal");
  if (locationsModal) locationsModal.classList.remove("hidden");
}

/**
 * Cierra el modal de gestión de ubicaciones
 */
export function closeLocationsModal() {
  const locationsModal = document.getElementById("locations-modal");
  if (locationsModal) locationsModal.classList.add("hidden");
}

/**
 * Guarda las ubicaciones desde el modal
 */
export function saveLocationsFromModal() {
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
