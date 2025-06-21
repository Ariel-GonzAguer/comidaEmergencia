import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { db } from "./firebaseConfig.js";

const COLLECTION_NAME = 'emergenciaDataTotal';
const DOCUMENT_NAME = 'comida';

export const foodService = {
  // Obtener referencia al documento comida
  getFoodDocument() {
    return doc(db, COLLECTION_NAME, DOCUMENT_NAME);
  },

  // Obtener colección de alimentos dentro del documento comida
  getFoodsCollection() {
    return collection(db, `${COLLECTION_NAME}/${DOCUMENT_NAME}/foods`);
  },  // Agregar un nuevo alimento
  async addFood(userId, foodData) {
    try {
      const foodsCollection = this.getFoodsCollection();
      const docRef = await addDoc(foodsCollection, {
        ...foodData,
        userId, // Guardamos quién agregó el alimento
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      throw new Error('Error al agregar alimento: ' + error.message);
    }
  },  // Actualizar un alimento
  async updateFood(userId, foodId, updatedData) {
    try {
      const foodDoc = doc(db, `${COLLECTION_NAME}/${DOCUMENT_NAME}/foods`, foodId);
      await updateDoc(foodDoc, {
        ...updatedData,
        updatedBy: userId, // Guardamos quién actualizó el alimento
        updatedAt: new Date()
      });
    } catch (error) {
      throw new Error('Error al actualizar alimento: ' + error.message);
    }
  },

  // Eliminar un alimento
  async deleteFood(userId, foodId) {
    try {
      const foodDoc = doc(db, `${COLLECTION_NAME}/${DOCUMENT_NAME}/foods`, foodId);
      await deleteDoc(foodDoc);
    } catch (error) {
      throw new Error('Error al eliminar alimento: ' + error.message);
    }
  },  // Obtener todos los alimentos (ambos usuarios ven todos los alimentos)
  async getFoods(userId) {
    try {
      const foodsCollection = this.getFoodsCollection();
      const q = query(foodsCollection, orderBy('expiryDate', 'asc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error('Error al obtener alimentos: ' + error.message);
    }
  },

  // Suscribirse a cambios en tiempo real (ambos usuarios ven los mismos datos)
  onFoodsChange(userId, callback) {
    const foodsCollection = this.getFoodsCollection();
    const q = query(foodsCollection, orderBy('expiryDate', 'asc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const foods = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(foods);
    });  },
  // Obtener alimentos próximos a vencer (en los próximos 30 días)
  async getExpiringFoods(userId) {
    try {
      const foodsCollection = this.getFoodsCollection();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const q = query(
        foodsCollection,
        where('expiryDate', '<=', thirtyDaysFromNow),
        orderBy('expiryDate', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error('Error al obtener alimentos próximos a vencer: ' + error.message);
    }
  },
  // Verificar alimentos que vencen en un mes y mostrar toast
  async checkExpiringFoodsAndShowToast(userId) {
    try {
      const now = new Date();
      const oneMonthFromNow = new Date();
      oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
      
      const foodsCollection = this.getFoodsCollection();
      const q = query(
        foodsCollection,
        where('expiryDate', '>=', now),
        where('expiryDate', '<=', oneMonthFromNow),
        orderBy('expiryDate', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      const expiringFoods = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Mostrar toast para cada alimento que vence pronto
      expiringFoods.forEach(food => {
        this.showExpirationToast(food.name, food.expiryDate);
      });

      return expiringFoods;
    } catch (error) {
      console.error('Error al verificar alimentos próximos a vencer:', error);
      return [];
    }
  },

  // Mostrar toast de alerta
  showExpirationToast(foodName, expiryDate) {
    const expiryDateFormatted = new Date(expiryDate.seconds * 1000).toLocaleDateString();
    
    // Crear el toast
    const toast = document.createElement('div');
    toast.className = `
      fixed top-4 right-4 bg-yellow-500 text-white px-6 py-4 rounded-lg shadow-lg z-50
      transform transition-all duration-300 ease-in-out translate-x-full
    `;    toast.innerHTML = `
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
      toast.classList.remove('translate-x-full');
    }, 100);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 5000);
  }
};
