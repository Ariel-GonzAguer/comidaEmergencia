import { db } from './firebaseConfig.js';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

// 🔒 CONFIGURACIÓN DE FIRESTORE - Variables de entorno
// Configure estos valores en su archivo .env
const COLLECTION_NAME = import.meta.env.PUBLIC_FIRESTORE_COLLECTION_NAME || 'default_collection';
const DOCUMENT_ID = import.meta.env.PUBLIC_FIRESTORE_DOCUMENT_ID || 'default_document';

// ⚠️ IMPORTANTE: 
// 1. Agregue estas variables a su archivo .env
// 2. Actualice las reglas de Firestore con los mismos nombres
// 3. Nunca suba el archivo .env al repositorio

// Referencia al documento principal
const getDocRef = () => doc(db, COLLECTION_NAME, DOCUMENT_ID);

// Categorías disponibles
const CATEGORIES = ['latas', 'paquetes', 'frescos', 'frascos', 'bebidas', 'congelados', 'granos', 'otros', 'condimentos'];

// Función para generar ID único
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Función para limpiar datos y eliminar campos undefined
function cleanFoodData(foodData) {
  const cleanData = {};
  
  // Lista de campos válidos para un alimento
  const validFields = [
    'name', 'category', 'quantity', 'unit', 'calories', 'expiryDate', 'location', 
    'notes', 'dateAdded', 'id', 'createdAt', 'updatedAt'
  ];
  
  // Copiar solo campos válidos que no sean undefined o null
  validFields.forEach(field => {
    if (foodData[field] !== undefined && foodData[field] !== null) {
      // Validación especial para números
      if (field === 'quantity' || field === 'calories') {
        const numValue = Number(foodData[field]);
        if (!isNaN(numValue) && isFinite(numValue)) {
          cleanData[field] = numValue;
        }
      } else {
        cleanData[field] = foodData[field];
      }
    }
  });
  
  // Asegurar que los campos requeridos tengan valores por defecto
  if (!cleanData.name || cleanData.name.trim() === '') cleanData.name = 'Sin nombre';
  if (!cleanData.category) cleanData.category = 'otros';
  if (!cleanData.quantity || cleanData.quantity <= 0) cleanData.quantity = 1;
  if (!cleanData.unit) cleanData.unit = 'unidad';
  if (!cleanData.location) cleanData.location = 'despensa';
  if (!cleanData.notes) cleanData.notes = '';
  if (!cleanData.calories || cleanData.calories < 0) cleanData.calories = 0;
  
  return cleanData;
}

// Función para obtener todos los alimentos
export async function getAllFoods() {
  try {
    const docRef = getDocRef();
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      // Crear documento inicial con categorías vacías
      const initialData = {};
      CATEGORIES.forEach(category => {
        initialData[category] = [];
      });
      await setDoc(docRef, initialData);
      return [];
    }
    
    const data = docSnap.data();
    const allFoods = [];
    
    // Combinar todos los alimentos de todas las categorías
    CATEGORIES.forEach(category => {
      if (data[category] && Array.isArray(data[category])) {
        data[category].forEach(food => {
          allFoods.push({
            ...food,
            category // Asegurar que cada alimento tenga su categoría
          });
        });
      }
    });
    
    return allFoods;
  } catch (error) {
    console.error('Error al obtener alimentos:', error);
    throw error;
  }
}

// Función para agregar un alimento
export async function addFood(userId, foodData) {
  try {
    const docRef = getDocRef();
    
    // Limpiar los datos antes de crear el objeto
    const cleanedData = cleanFoodData(foodData);
    
    const newFood = {
      ...cleanedData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const category = newFood.category;
    if (!CATEGORIES.includes(category)) {
      throw new Error('Categoría no válida');
    }
    
    // Obtener documento actual
    const docSnap = await getDoc(docRef);
    let currentData = {};
    
    if (docSnap.exists()) {
      currentData = docSnap.data();
    } else {
      // Inicializar categorías si no existen
      CATEGORIES.forEach(cat => {
        currentData[cat] = [];
      });
    }
    
    // Asegurar que la categoría existe
    if (!currentData[category]) {
      currentData[category] = [];
    }
    
    // Agregar el nuevo alimento a la categoría correspondiente
    currentData[category].push(newFood);
    
    // Guardar documento actualizado
    await setDoc(docRef, currentData);
    
    return newFood;
  } catch (error) {
    console.error('Error al agregar alimento:', error);
    throw error;
  }
}

// Función para actualizar un alimento
export async function updateFood(userId, foodId, foodData) {
  try {
    const docRef = getDocRef();
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('No se encontró el documento');
    }
    
    const currentData = docSnap.data();
    let foodFound = false;
    let oldCategory = null;
    
    // Buscar el alimento en todas las categorías
    CATEGORIES.forEach(category => {
      if (currentData[category] && Array.isArray(currentData[category])) {
        const foodIndex = currentData[category].findIndex(food => food.id === foodId);
        if (foodIndex !== -1) {
          oldCategory = category;
          // Remover el alimento de su categoría actual
          currentData[category].splice(foodIndex, 1);
          foodFound = true;
        }
      }
    });
    
    if (!foodFound) {
      throw new Error('Alimento no encontrado');
    }
      // Preparar el alimento actualizado
    const cleanedData = cleanFoodData(foodData);
    const updatedFood = {
      ...cleanedData,
      id: foodId,
      updatedAt: new Date()
    };
    
    const newCategory = updatedFood.category;
    if (!CATEGORIES.includes(newCategory)) {
      throw new Error('Categoría no válida');
    }
    
    // Asegurar que la nueva categoría existe
    if (!currentData[newCategory]) {
      currentData[newCategory] = [];
    }
    
    // Agregar el alimento a su nueva categoría
    currentData[newCategory].push(updatedFood);
    
    // Guardar documento actualizado
    await setDoc(docRef, currentData);
    
    return updatedFood;
  } catch (error) {
    console.error('Error al actualizar alimento:', error);
    throw error;
  }
}

// Función para eliminar un alimento
export async function deleteFood(userId, foodId) {
  try {
    const docRef = getDocRef();
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('No se encontró el documento');
    }
    
    const currentData = docSnap.data();
    let foodFound = false;
    
    // Buscar y eliminar el alimento de la categoría correspondiente
    CATEGORIES.forEach(category => {
      if (currentData[category] && Array.isArray(currentData[category])) {
        const foodIndex = currentData[category].findIndex(food => food.id === foodId);
        if (foodIndex !== -1) {
          currentData[category].splice(foodIndex, 1);
          foodFound = true;
        }
      }
    });
    
    if (!foodFound) {
      throw new Error('Alimento no encontrado');
    }
    
    // Guardar documento actualizado
    await setDoc(docRef, currentData);
    
    return true;
  } catch (error) {
    console.error('Error al eliminar alimento:', error);
    throw error;
  }
}

// Función para escuchar cambios en tiempo real
export function onFoodsChange(userId, callback) {
  const docRef = getDocRef();
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      const allFoods = [];
      
      // Combinar todos los alimentos de todas las categorías
      CATEGORIES.forEach(category => {
        if (data[category] && Array.isArray(data[category])) {
          data[category].forEach(food => {
            allFoods.push({
              ...food,
              category // Asegurar que cada alimento tenga su categoría
            });
          });
        }
      });
      
      callback(allFoods);
    } else {
      callback([]);
    }
  }, (error) => {
    console.error('Error al escuchar cambios:', error);
  });
}

// Función para verificar alimentos próximos a vencer
export async function checkExpiringFoodsAndShowToast(userId) {
  try {
    const foods = await getAllFoods();
    const today = new Date();
    
    foods.forEach(food => {
      const expiryDate = new Date(food.expiryDate.seconds ? food.expiryDate.seconds * 1000 : food.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      // Mostrar toast si el alimento vence en 30 días o menos
      if (daysUntilExpiry <= 30 && daysUntilExpiry >= 0) {
        showExpiryToast(food.name, expiryDate);
      }
    });
  } catch (error) {
    console.error('Error al verificar alimentos próximos a vencer:', error);
  }
}

// Función para mostrar toast de alimento próximo a vencer
function showExpiryToast(foodName, expiryDate) {
  const toast = document.createElement('div');
  const expiryDateFormatted = expiryDate.toLocaleDateString('es-ES');
  
  toast.className = `
    fixed top-4 right-4 bg-yellow-600 text-white px-6 py-4 rounded-lg shadow-lg 
    transform transition-transform duration-500 ease-in-out z-50 max-w-sm
  `;
  toast.innerHTML = `
    <div class="flex items-center space-x-3">
      <span class="text-2xl">⚠️</span>
      <div>
        <p class="font-semibold">¡Alimento próximo a vencer!</p>
        <p class="text-sm">${foodName} vence el ${expiryDateFormatted}</p>
      </div>
      <button class="ml-4 text-yellow-200 hover:text-white text-lg" onclick="this.closest('.fixed').remove()">
        ✕
      </button>
    </div>
  `;

  document.body.appendChild(toast);

  // Animar la entrada
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 100);

  // Auto-ocultar después de 8 segundos
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 500);
  }, 8000);
}

export const foodService = {
  getAllFoods,
  addFood,
  updateFood,
  deleteFood,
  onFoodsChange,
  checkExpiringFoodsAndShowToast
};
