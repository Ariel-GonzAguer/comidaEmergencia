// Store simple sin Zustand para Astro 🚀
class EmergencyFoodStore {  constructor() {
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