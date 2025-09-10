// @ts-nocheck
/**
 * Utilidades generales para el dashboard
 */

/**
 * Muestra un toast de notificación
 * @param {string} message - Mensaje a mostrar
 * @param {boolean} isError - Si es un mensaje de error
 */
export function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.className = `fixed top-4 right-4 px-6 py-3 rounded-md shadow-lg transform transition-transform duration-300 ease-in-out ${isError ? "bg-red-500" : "bg-green-500"
    } text-white`;
  toast.style.transform = "translateX(0)";

  setTimeout(() => {
    toast.style.transform = "translateX(calc(100% + 2rem))";
  }, 3000);
}

/**
 * Formatea una fecha a formato día-mes-año (dd/mm/yyyy)
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
export function formatDateToSpanish(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Convierte fecha española a formato ISO
 * @param {string} spanishDate - Fecha en formato dd/mm/yyyy
 * @returns {string} Fecha en formato ISO
 */
export function formatDateToISO(spanishDate) {
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

/**
 * Formatea una fecha para mostrar
 * @param {Date|string|Object} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export function formatDate(date) {
  if (!date) return "";
  const d = new Date(date.seconds ? date.seconds * 1000 : date);
  return d.toLocaleDateString("es-ES");
}

/**
 * Formatea una fecha para input type="date"
 * @param {Date|string|Object} date - Fecha a formatear
 * @returns {string} Fecha en formato yyyy-mm-dd
 */
export function formatDateForInput(date) {
  if (!date) return "";
  const d = new Date(date.seconds ? date.seconds * 1000 : date);
  return d.toISOString().split("T")[0];
}

/**
 * Calcula los días hasta que expira un alimento
 * @param {string|Object} expiryDate - Fecha de vencimiento
 * @returns {number} Días hasta vencer (negativo si ya venció)
 */
export function getDaysUntilExpiry(expiryDate) {
  const expiry = new Date(
    expiryDate.seconds ? expiryDate.seconds * 1000 : expiryDate
  );
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Obtiene la clase CSS según el estado de vencimiento
 * @param {number} days - Días hasta vencer
 * @returns {string} Clase CSS
 */
export function getExpiryStatusClass(days) {
  if (days < 0) return "bg-red-100 text-red-800";
  if (days <= 7) return "bg-orange-100 text-orange-800";
  if (days <= 30) return "bg-yellow-100 text-yellow-800";
  return "bg-green-100 text-green-800";
}

/**
 * Obtiene el texto del estado de vencimiento
 * @param {number} days - Días hasta vencer
 * @returns {string} Texto del estado
 */
export function getExpiryStatusText(days) {
  if (days < 0) return `Vencido hace ${Math.abs(days)} día${Math.abs(days) === 1 ? '' : 's'}`;
  if (days === 0) return "Vence hoy";
  if (days === 1) return "Vence mañana";
  return `Vence en ${days} días`;
}
