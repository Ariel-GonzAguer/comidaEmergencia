// @ts-nocheck
/**
 * Módulo para manejo de inputs personalizados
 */

import { formatDateToSpanish, formatDateToISO } from './utils.js';

/**
 * Configura el input personalizado de fecha
 */
export function setupCustomDateInput() {
  const dateInput = document.getElementById('food-expiry');
  const displayInput = document.getElementById('food-expiry-display');
  
  if (!dateInput || !displayInput) return;
  
  // Cuando cambia el input oculto, actualizar el display
  dateInput.addEventListener('change', function() {
    if (this.value) {
      const spanishDate = formatDateToSpanish(this.value);
      displayInput.value = spanishDate;
      displayInput.classList.remove('border-red-300');
    }
  });
  
  // Validación en tiempo real del input display
  displayInput.addEventListener('input', function() {
    const value = this.value;
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    
    if (dateRegex.test(value)) {
      const [, day, month, year] = value.match(dateRegex);
      
      // Validar fecha
      const date = new Date(year, month - 1, day);
      const isValidDate = date.getFullYear() == year && 
                         date.getMonth() == month - 1 && 
                         date.getDate() == day;
      
      if (isValidDate) {
        // Fecha válida - actualizar input oculto
        const isoDate = formatDateToISO(value);
        dateInput.value = isoDate;
        this.classList.remove('border-red-300');
        this.classList.add('border-green-300');
      } else {
        // Fecha inválida
        this.classList.add('border-red-300');
        this.classList.remove('border-green-300');
      }
    } else if (value.length > 0) {
      this.classList.add('border-red-300');
      this.classList.remove('border-green-300');
    } else {
      this.classList.remove('border-red-300', 'border-green-300');
    }
  });
  
  // Formateo automático mientras escribe
  displayInput.addEventListener('keyup', function(e) {
    let value = this.value.replace(/\D/g, ''); // Solo números
    
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length >= 5) {
      value = value.substring(0, 5) + '/' + value.substring(5, 9);
    }
    
    this.value = value;
  });
  
  // Permitir solo números y barras
  displayInput.addEventListener('keypress', function(e) {
    const char = String.fromCharCode(e.which);
    if (!/[0-9\/]/.test(char)) {
      e.preventDefault();
    }
  });
  
  // Abrir calendario al hacer clic en el input visible
  displayInput.addEventListener('click', function() {
    // Método compatible para abrir el calendario
    dateInput.focus();
    if (dateInput.showPicker) {
      dateInput.showPicker();
    } else {
      // Fallback para navegadores que no soportan showPicker
      dateInput.click();
    }
  });
  
  // También abrir calendario al hacer focus en el input visible
  displayInput.addEventListener('focus', function() {
    // Pequeño delay para evitar conflictos
    setTimeout(() => {
      if (document.activeElement === displayInput) {
        dateInput.focus();
        if (dateInput.showPicker) {
          dateInput.showPicker();
        } else {
          dateInput.click();
        }
      }
    }, 100);
  });
}
