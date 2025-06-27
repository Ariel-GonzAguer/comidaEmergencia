/**
 * Gestor centralizado de navegación
 * Maneja el menú móvil, navegación activa y logout
 */

import { authService } from "../firebase/authService.js";
import { showToast } from "./utils.js";

// Variables para evitar duplicación de listeners
let isNavigationInitialized = false;
let astroListenerAdded = false;

/**
 * Configura toda la navegación de la aplicación
 * Incluye menú móvil, enlaces activos y logout
 */
export function setupNavigation() {
  setupMobileMenu();
  highlightActiveNavigation();
  setupLogout();

  // Configurar listeners para navegación de Astro solo una vez
  if (!astroListenerAdded) {
    setupAstroNavigationListeners();
    astroListenerAdded = true;
  }

  isNavigationInitialized = true;
}

/**
 * Limpia los event listeners existentes para evitar duplicación
 */
function cleanupNavigation() {
  if (!isNavigationInitialized) return;

  // Remover listeners del menú móvil si existen
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuBtn) {
    // Clonar el elemento para remover todos los listeners
    const newBtn = mobileMenuBtn.cloneNode(true);
    mobileMenuBtn.parentNode.replaceChild(newBtn, mobileMenuBtn);
  }

  if (mobileMenu) {
    const mobileLinks = mobileMenu.querySelectorAll("a");
    mobileLinks.forEach(link => {
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
    });
  }
}

/**
 * Configura listeners para navegación de Astro
 */
function setupAstroNavigationListeners() {
  // Reinicializar navegación después de cada navegación de Astro
  document.addEventListener("astro:after-swap", () => {
    console.log("🔄 Reinicializando navegación después de navegación SPA");

    // Re-configurar solo las funciones esenciales
    setTimeout(() => {
      setupMobileMenu();
      highlightActiveNavigation();
      setupLogout();
    }, 50); // Delay mínimo para asegurar que el DOM está listo
  });
}

/**
 * Configura el funcionamiento del menú móvil
 */
function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuBtn && mobileMenu) {
    // Remover listeners existentes para evitar duplicación
    const newBtn = mobileMenuBtn.cloneNode(true);
    mobileMenuBtn.parentNode.replaceChild(newBtn, mobileMenuBtn);

    // Toggle del menú móvil
    newBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      mobileMenu.classList.toggle("hidden");
      console.log("🍔 Menú móvil toggled:", !mobileMenu.classList.contains("hidden"));
    });

    // Cerrar menú móvil al hacer clic en cualquier enlace
    const mobileLinks = mobileMenu.querySelectorAll("a");
    mobileLinks.forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        console.log("🔗 Enlace clickeado - menú cerrado");
      });
    });

    // Cerrar menú móvil al hacer clic fuera
    document.addEventListener("click", (e) => {
      const currentBtn = document.getElementById("mobile-menu-btn");
      if (currentBtn && !currentBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add("hidden");
      }
    }, { once: false });
  }
}

/**
 * Resalta la navegación activa según la página actual
 */
function highlightActiveNavigation() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll("[id^='nav-']");

  navLinks.forEach(link => {
    const href = link.getAttribute("href");

    // Limpiar clases anteriores
    link.classList.remove("bg-green-800", "text-white");
    link.classList.add("hover:text-gray-300");

    // Aplicar estilos si es la página actual
    if (href === currentPath) {
      link.classList.add("bg-green-800", "text-white");
      link.classList.remove("hover:text-gray-300");
    }
  });
}

/**
 * Configura el botón de logout
 */
function setupLogout() {
  const logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {
    // Remover listeners anteriores para evitar duplicación
    const newLogoutBtn = logoutBtn.cloneNode(true);
    logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);

    // Agregar nuevo listener
    newLogoutBtn.addEventListener("click", handleLogout);
  }
}

/**
 * Maneja el proceso de logout
 */
async function handleLogout() {
  try {
    await authService.signOut();
    window.location.href = "/";
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    showToast("Error al cerrar sesión", true);
  }
}
