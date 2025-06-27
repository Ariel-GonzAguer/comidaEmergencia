// @ts-nocheck
// Servicio para gestionar recetas en Firebase

import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  getDoc
} from 'firebase/firestore';
import { db } from './firebaseConfig.js';

// Obtener nombre de colección desde variables de entorno
const COLLECTION_NAME = import.meta.env.PUBLIC_FIRESTORE_COLLECTION_NAME;
const DOCUMENT_ID = import.meta.env.PUBLIC_FIRESTORE_DOCUMENT_ID;

class RecipeService {
  // Agregar nueva receta
  async addRecipe(userId, recipeData) {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);

      // Generar ID único para la receta
      const recipeId = 'recipe_' + Date.now() + '_' + crypto.randomUUID().substring(0, 8);

      const recipe = {
        id: recipeId,
        ...recipeData,
        dateAdded: new Date(),
        timesCooked: 0
      };

      await updateDoc(docRef, {
        recipes: arrayUnion(recipe)
      });

      return recipeId;
    } catch (error) {
      console.error('Error adding recipe:', error);
      throw error;
    }
  }

  // Actualizar receta existente
  async updateRecipe(userId, recipeId, updatedData) {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const recipes = data.recipes || [];

        const updatedRecipes = recipes.map(recipe =>
          recipe.id === recipeId
            ? { ...recipe, ...updatedData }
            : recipe
        );

        await updateDoc(docRef, { recipes: updatedRecipes });
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
      throw error;
    }
  }

  // Eliminar receta
  async deleteRecipe(userId, recipeId) {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const recipes = data.recipes || [];

        const recipeToDelete = recipes.find(r => r.id === recipeId);
        if (recipeToDelete) {
          await updateDoc(docRef, {
            recipes: arrayRemove(recipeToDelete)
          });
        }
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }
  }

  // Incrementar contador de veces cocinada
  async incrementTimesCooked(userId, recipeId) {
    try {
      const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const recipes = data.recipes || [];

        const updatedRecipes = recipes.map(recipe =>
          recipe.id === recipeId
            ? { ...recipe, timesCooked: (recipe.timesCooked || 0) + 1 }
            : recipe
        );

        await updateDoc(docRef, { recipes: updatedRecipes });
      }
    } catch (error) {
      console.error('Error incrementing times cooked:', error);
      throw error;
    }
  }

  // Suscribirse a cambios en las recetas
  onRecipesChange(userId, callback) {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);

    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const recipes = data.recipes || [];
        callback(recipes);
      } else {
        callback([]);
      }
    });
  }
  // Calcular cuántas porciones se pueden hacer de una receta
  calculateAvailableServings(recipe, availableFoods) {
    if (!recipe.ingredients || recipe.ingredients.length === 0) {
      return 0;
    }

    let minServings = Infinity;

    for (const ingredient of recipe.ingredients) {
      // Buscar el alimento en el inventario
      const availableFood = availableFoods.find(food => food.id === ingredient.foodId);

      if (!availableFood) {
        // Si no se encuentra el ingrediente, no se puede hacer la receta
        return 0;
      }

      // Convertir unidades si es necesario (simplificado)
      const availableQuantity = this.convertUnits(
        availableFood.quantity,
        availableFood.unit,
        ingredient.unit
      );

      // Calcular cuántas porciones se pueden hacer con este ingrediente
      // La cantidad disponible dividida por la cantidad necesaria por porción
      const possibleServings = Math.floor(availableQuantity / ingredient.quantity);

      minServings = Math.min(minServings, possibleServings);
    }

    return minServings === Infinity ? 0 : minServings;
  }

  // Conversión básica de unidades (puede expandirse)
  convertUnits(quantity, fromUnit, toUnit) {
    // Conversiones básicas
    const conversions = {
      'gramos_kilogramos': 1000,
      'kilogramos_gramos': 0.001,
      'mililitros_litros': 1000,
      'litros_mililitros': 0.001
    };

    const conversionKey = `${fromUnit}_${toUnit}`;

    if (fromUnit === toUnit) {
      return quantity;
    }

    if (conversions[conversionKey]) {
      return quantity / conversions[conversionKey];
    }

    // Si no hay conversión disponible, asumir que son iguales
    return quantity;
  }

  // Obtener ingredientes faltantes para una receta
  getMissingIngredients(recipe, availableFoods) {
    const missingIngredients = [];

    for (const ingredient of recipe.ingredients) {
      const availableFood = availableFoods.find(food => food.id === ingredient.foodId);

      if (!availableFood) {
        missingIngredients.push({
          ...ingredient,
          status: 'not_available',
          needed: ingredient.quantity,
          available: 0
        });
      } else {
        const availableQuantity = this.convertUnits(
          availableFood.quantity,
          availableFood.unit,
          ingredient.unit
        );

        if (availableQuantity < ingredient.quantity) {
          missingIngredients.push({
            ...ingredient,
            status: 'insufficient',
            needed: ingredient.quantity,
            available: availableQuantity,
            missing: ingredient.quantity - availableQuantity
          });
        }
      }
    }

    return missingIngredients;
  }
}

export const recipeService = new RecipeService();
