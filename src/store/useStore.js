// Store simple sin Zustand para Astro 🚀

/**
 * GUÍA: CÓMO CREAR UNA STORE PERSONALIZADA SIN ZUSTAND
 * ====================================================
 * 
 * Esta implementación demuestra cómo crear un store de estado global
 * sin dependencias externas como Zustand, Redux o Context API.
 * 
 * VENTAJAS:
 * - ✅ Sin dependencias externas
 * - ✅ Pequeño tamaño de bundle
 * - ✅ Compatible con cualquier framework (React, Vue, Astro, Vanilla JS)
 * - ✅ Persistencia automática en localStorage
 * - ✅ Patrón Observer para reactividad
 * - ✅ TypeScript friendly (si lo necesitas)
 * 
 * ESTRUCTURA BÁSICA:
 * -----------------
 * 
 * 1. **Clase Store**: Contiene el estado y métodos
 * 2. **Estado interno**: Objeto con propiedades del estado
 * 3. **Listeners**: Set de callbacks para notificar cambios
 * 4. **Persistencia**: Guardar/cargar desde localStorage
 * 5. **Acciones**: Métodos para modificar el estado
 * 6. **Suscripciones**: Sistema de notificaciones
 * 
 * PATRÓN IMPLEMENTADO:
 * -------------------
 * 
 * ```javascript
 * class MyStore {
 *   constructor() {
 *     this.state = { ...initialState };
 *     this.listeners = new Set();
 *     this.loadFromStorage();
 *   }
 * 
 *   // Suscripción (Observer Pattern)
 *   subscribe(callback) {
 *     this.listeners.add(callback);
 *     return () => this.listeners.delete(callback);
 *   }
 * 
 *   // Notificación a listeners
 *   notify() {
 *     this.listeners.forEach(callback => callback(this.state));
 *   }
 * 
 *   // Acciones que modifican estado
 *   setState(newState) {
 *     this.state = { ...this.state, ...newState };
 *     this.saveToStorage();
 *     this.notify();
 *   }
 * 
 *   // Persistencia
 *   saveToStorage() {
 *     localStorage.setItem('myStore', JSON.stringify(this.state));
 *   }
 * 
 *   loadFromStorage() {
 *     const stored = localStorage.getItem('myStore');
 *     if (stored) this.state = JSON.parse(stored);
 *   }
 * }
 * ```
 * 
 * USO EN COMPONENTES:
 * ------------------
 * 
 * ```javascript
 * // Obtener la store
 * const store = useMyStore();
 * 
 * // Suscribirse a cambios
 * useEffect(() => {
 *   const unsubscribe = store.subscribe((state) => {
 *     console.log('Estado actualizado:', state);
 *   });
 *   return unsubscribe;
 * }, []);
 * 
 * // Usar acciones
 * const handleClick = () => {
 *   store.updateUser({ name: 'Juan' });
 * };
 * ```
 * 
 * EJEMPLO MÍNIMO PARA EMPEZAR:
 * ----------------------------
 * 
 * ```javascript
 * class SimpleStore {
 *   constructor() {
 *     this.state = { count: 0, user: null };
 *     this.listeners = new Set();
 *   }
 * 
 *   subscribe(callback) {
 *     this.listeners.add(callback);
 *     return () => this.listeners.delete(callback);
 *   }
 * 
 *   notify() {
 *     this.listeners.forEach(cb => cb(this.state));
 *   }
 * 
 *   increment() {
 *     this.state.count++;
 *     this.notify();
 *   }
 * 
 *   setUser(user) {
 *     this.state.user = user;
 *     this.notify();
 *   }
 * 
 *   getState() {
 *     return this.state;
 *   }
 * }
 * 
 * // Instancia global
 * const useSimpleStore = () => {
 *   if (!window.__simpleStore) {
 *     window.__simpleStore = new SimpleStore();
 *   }
 *   return window.__simpleStore;
 * };
 * ```
 * 
 * FEATURES AVANZADAS QUE PUEDES AGREGAR:
 * -------------------------------------
 * 
 * 1. **Middleware**: Para logging, debugging
 * 2. **Computed values**: Propiedades derivadas
 * 3. **Async actions**: Para llamadas a APIs
 * 4. **Time travel**: Historial de estados
 * 5. **DevTools**: Integración con herramientas de desarrollo
 * 6. **Validación**: Esquemas para el estado
 * 7. **Múltiples stores**: Separar por dominio
 * 
 * RENDIMIENTO:
 * -----------
 * - Usa `Object.freeze()` para immutabilidad
 * - Implementa shallow comparison para evitar re-renders
 * - Considera usar `WeakMap` para listeners por componente
 * 
 * TESTING:
 * -------
 * ```javascript
 * test('store updates state correctly', () => {
 *   const store = new MyStore();
 *   store.setUser({ name: 'Test' });
 *   expect(store.getState().user.name).toBe('Test');
 * });
 * ```
 */

class EmergencyFoodStore {
  constructor() {
    this.state = {
      user: null,
      isLoading: false,
      foods: [],
      survivalData: {
        days: 0,
        totalCalories: 0,
        dailyNeed: 0,
        numPeople: 1,
        lastCalculated: null
      }
    };

    // Cargar estado desde localStorage
    this.loadFromStorage();

    // Listeners para cambios
    this.listeners = new Set();
  }

  // Cargar desde localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('comidaEmergencia-localStorage');
      if (stored) {
        const parsedState = JSON.parse(stored);
        this.state = { ...this.state, ...parsedState };
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }
  // Guardar en localStorage
  saveToStorage() {
    try {
      // Persistir usuario y datos de supervivencia
      const persistState = {
        user: this.state.user,
        survivalData: this.state.survivalData
      };
      localStorage.setItem('comidaEmergencia-localStorage', JSON.stringify(persistState));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  // Suscribirse a cambios
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notificar a los listeners
  notify() {
    this.listeners.forEach(callback => callback(this.state));
  }

  // Obtener estado actual
  getState() {
    return this.state;
  }

  // Acciones
  setUser(user) {
    this.state.user = user;
    this.saveToStorage();
    this.notify();
  }

  setLoading(loading) {
    this.state.isLoading = loading;
    this.notify();
  }

  logout() {
    this.state.user = null;
    this.state.foods = [];
    this.saveToStorage();
    this.notify();
  }

  setFoods(foods) {
    this.state.foods = foods;
    this.notify();
  }

  addFood(food) {
    this.state.foods.push(food);
    this.notify();
  }

  updateFood(id, updatedFood) {
    const index = this.state.foods.findIndex(food => food.id === id);
    if (index !== -1) {
      this.state.foods[index] = { ...this.state.foods[index], ...updatedFood };
      this.notify();
    }
  }

  deleteFood(id) {
    this.state.foods = this.state.foods.filter(food => food.id !== id);
    this.notify();
  }

  setSurvivalData(survivalData) {
    this.state.survivalData = {
      ...this.state.survivalData,
      ...survivalData,
      lastCalculated: new Date().toISOString()
    };
    this.saveToStorage();
    this.notify();
  }

  getSurvivalData() {
    return this.state.survivalData;
  }

  // Obtener usuario actual
  getCurrentUser() {
    return this.state.user;
  }
}

// Crear instancia global
const useEmergencyFoodStore = () => {
  if (typeof window !== 'undefined' && !window.__emergencyFoodStore) {
    window.__emergencyFoodStore = new EmergencyFoodStore();
  }
  return window.__emergencyFoodStore || new EmergencyFoodStore();
};

export default useEmergencyFoodStore;
