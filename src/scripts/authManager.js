// @ts-nocheck
/**
 * Módulo para manejo de autenticación y navegación
 */

import { authService } from '../firebase/authService.js';
import { foodService } from '../firebase/foodService.js';
import { logOut } from '../firebase/firebaseConfig.js';
import { showToast } from './utils.js';

/**
 * Configura la autenticación y estado del usuario
 * @param {Object} store - Store principal de la aplicación
 * @param {Function} updateStats - Función para actualizar estadísticas
 * @param {Function} renderFoodsList - Función para renderizar lista de alimentos
 * @param {Function} updateSurvivalCard - Función para actualizar card de supervivencia
 */
export function setupAuth(store, updateStats, renderFoodsList, updateSurvivalCard) {
  let unsubscribe = null;

  authService.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = "/";
      return;
    }

    const userEmail = document.getElementById("user-email");
    if (userEmail) {
      const userName = user.email.split('@')[0];
      userEmail.textContent = userName;
    }

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

  // Limpiar suscripciones al salir o cambiar de página
  window.addEventListener("beforeunload", () => {
    if (unsubscribe) {
      unsubscribe();
    }
  });

  // También limpiar en navegaciones de Astro
  document.addEventListener("astro:before-preparation", () => {
    if (unsubscribe) {
      unsubscribe();
    }
  });
}

/**
 * Configura solo el botón de logout (la navegación se maneja en navigationManager.js)
 * @param {Object} elements - Elementos del DOM
 */
export function setupNavigation(elements) {
  // Configurar botón de logout
  if (elements.logoutBtn) {
    elements.logoutBtn.addEventListener("click", async () => {
      try {
        await authService.signOut();
        window.location.href = "/";
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        showToast("Error al cerrar sesión", true);
      }
    });
  }
}

/**
 * Maneja el cierre de sesión
 * @param {Object} store - Store principal de la aplicación
 */
export async function handleLogout(store) {
  try {
    await logOut();
    store.logout();
    window.location.href = "/";
  } catch (error) {
    showToast("Error al cerrar sesión", true);
  }
}
