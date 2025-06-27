// @ts-nocheck
// Lógica para la calculadora de supervivencia

import useEmergencyFoodStore from "../store/useStore.js";

const store = useEmergencyFoodStore();

// Funciones para manejo de calorías diarias y número de personas
export function getDailyCalories() {
  const input = document.getElementById("daily-calories");
  if (!input) return 2000; // Valor por defecto

  const value = parseInt(input.value);
  return isNaN(value) || value <= 0 ? 2000 : value;
}

export function getNumPeople() {
  const input = document.getElementById("num-people");
  if (!input) return 1; // Valor por defecto

  const value = parseInt(input.value);
  return isNaN(value) || value <= 0 ? 1 : value;
}

export function saveDailyCalories(calories) {
  try {
    localStorage.setItem('dailyCalories', calories.toString());
  } catch (error) {
    console.error('Error al guardar calorías diarias:', error);
  }
}

export function saveNumPeople(numPeople) {
  try {
    localStorage.setItem('numPeople', numPeople.toString());
  } catch (error) {
    console.error('Error al guardar número de personas:', error);
  }
}

export function loadDailyCalories() {
  try {
    const stored = localStorage.getItem('dailyCalories');
    if (stored) return parseInt(stored);

    // Si no hay en localStorage, usar del store
    const survivalData = store.getSurvivalData();
    return survivalData.dailyNeed > 0 ? Math.floor(survivalData.dailyNeed / Math.max(survivalData.numPeople, 1)) : 2000;
  } catch (error) {
    console.error('Error al cargar calorías diarias:', error);
    return 2000;
  }
}

export function loadNumPeople() {
  try {
    const stored = localStorage.getItem('numPeople');
    if (stored) return parseInt(stored);

    // Si no hay en localStorage, usar del store
    const survivalData = store.getSurvivalData();
    return survivalData.numPeople || 1;
  } catch (error) {
    console.error('Error al cargar número de personas:', error);
    return 1;
  }
}

// Función para calcular días de supervivencia considerando vencimientos y personas
export function calculateSurvivalDays(foods, dailyCaloriesPerPerson, numPeople) {
  if (dailyCaloriesPerPerson <= 0 || numPeople <= 0 || foods.length === 0) {
    return { days: 0, usableCalories: 0, totalDailyNeed: 0 };
  }

  const totalDailyCalories = dailyCaloriesPerPerson * numPeople;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Separar alimentos por fecha de vencimiento y ordenar por fecha
  const foodsByExpiry = foods
    .map(food => {
      const expiryDate = new Date(food.expiryDate.seconds ? food.expiryDate.seconds * 1000 : food.expiryDate);
      expiryDate.setHours(23, 59, 59, 999); // Final del día de vencimiento
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      return {
        ...food,
        expiryDate: expiryDate,
        daysUntilExpiry: daysUntilExpiry,
        calories: Number(food.calories) || 0
      };
    })
    .filter(food => food.daysUntilExpiry >= 0) // Solo alimentos no vencidos
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry); // Ordenar por vencimiento

  let totalDays = 0;
  let remainingDailyCalories = totalDailyCalories;
  let currentDay = 0;
  let usedFoods = new Set();
  let totalUsableCalories = 0;

  // Crear una copia profunda de los alimentos para no modificar los originales
  const workingFoods = foodsByExpiry.map(food => ({ ...food }));

  // Simular día por día
  while (currentDay < 365 && workingFoods.some(food => !usedFoods.has(food.id) && food.daysUntilExpiry >= currentDay && food.calories > 0)) {
    const availableFoods = workingFoods.filter(food =>
      !usedFoods.has(food.id) &&
      food.daysUntilExpiry >= currentDay &&
      food.calories > 0
    );

    if (availableFoods.length === 0) break;

    // Usar alimentos que vencen más pronto primero
    for (const food of availableFoods) {
      if (remainingDailyCalories <= 0) break;

      const caloriesNeeded = Math.min(food.calories, remainingDailyCalories);
      remainingDailyCalories -= caloriesNeeded;
      totalUsableCalories += caloriesNeeded;

      // Reducir las calorías del alimento
      food.calories -= caloriesNeeded;

      // Si el alimento se agotó, marcarlo como usado
      if (food.calories <= 0) {
        usedFoods.add(food.id);
      }
    }

    // Si completamos las calorías del día
    if (remainingDailyCalories <= 0) {
      totalDays++;
      remainingDailyCalories = totalDailyCalories;
    } else {
      // No hay suficientes calorías disponibles para este día
      break;
    }

    currentDay++;
  }

  return {
    days: totalDays,
    usableCalories: totalUsableCalories,
    totalDailyNeed: totalDailyCalories
  };
}

// Función para actualizar la tarjeta de supervivencia
export function updateSurvivalCard() {
  const survivalData = store.getSurvivalData();
  const survivalDaysCardEl = document.getElementById("survival-days-card");
  const survivalPeopleInfoEl = document.getElementById("survival-people-info");

  if (survivalDaysCardEl && survivalPeopleInfoEl) {
    if (survivalData.days > 0 && survivalData.lastCalculated) {
      survivalDaysCardEl.textContent = `${survivalData.days} días`;
      survivalPeopleInfoEl.textContent = `Para ${survivalData.numPeople} persona${survivalData.numPeople > 1 ? 's' : ''}`;
    } else {
      survivalDaysCardEl.textContent = "-";
      survivalPeopleInfoEl.textContent = "Usa la calculadora";
    }
  }
}

// Función para calcular y mostrar supervivencia
export function calculateAndShowSurvival() {
  const foods = store.getState().foods || [];
  const dailyCaloriesPerPerson = getDailyCalories();
  const numPeople = getNumPeople();

  if (foods.length === 0) {
    // Importar showToast dinámicamente para evitar dependencias circulares
    import('./utils.js').then(({ showToast }) => {
      showToast("No tienes alimentos registrados para calcular", true);
    });
    return;
  }

  // Calcular datos de supervivencia
  const survivalData = calculateSurvivalDays(foods, dailyCaloriesPerPerson, numPeople);

  // Preparar datos para el store
  const storeData = {
    days: survivalData.days,
    totalCalories: survivalData.usableCalories,
    dailyNeed: survivalData.totalDailyNeed,
    numPeople: numPeople
  };

  // Guardar en el store
  store.setSurvivalData(storeData);

  // Mostrar resultado en la calculadora
  const resultContainer = document.getElementById("survival-result");
  const resultDays = document.getElementById("result-days");
  const resultTotalCalories = document.getElementById("result-total-calories");
  const resultDailyNeed = document.getElementById("result-daily-need");

  if (resultContainer && resultDays && resultTotalCalories && resultDailyNeed) {
    resultContainer.classList.remove("hidden");

    // Formatear y mostrar días
    if (survivalData.days > 0) {
      resultDays.textContent = survivalData.days;
      resultDays.parentElement.className = "text-center p-3 bg-green-50 rounded-md";
      resultDays.className = "text-2xl font-bold text-green-600";
      resultDays.nextElementSibling.className = "text-sm text-green-600";
    } else {
      resultDays.textContent = "0";
      resultDays.parentElement.className = "text-center p-3 bg-red-50 rounded-md";
      resultDays.className = "text-2xl font-bold text-red-600";
      resultDays.nextElementSibling.className = "text-sm text-red-600";
    }

    // Mostrar calorías totales
    resultTotalCalories.textContent = survivalData.usableCalories.toLocaleString();

    // Mostrar necesidad diaria
    resultDailyNeed.textContent = survivalData.totalDailyNeed.toLocaleString();

    // Mensaje detallado
    let message = `Calculado para ${numPeople} persona${numPeople > 1 ? 's' : ''}: `;
    if (survivalData.days > 0) {
      message += `${survivalData.days} día${survivalData.days > 1 ? 's' : ''} de supervivencia`;
    } else {
      message += "No hay suficientes calorías disponibles";
    }

    // Importar showToast dinámicamente
    import('./utils.js').then(({ showToast }) => {
      showToast(message, survivalData.days === 0);
    });
  }
}

// Configurar event listeners para la calculadora
export function setupSurvivalCalculatorEvents() {
  const dailyCaloriesInput = document.getElementById("daily-calories");
  const numPeopleInput = document.getElementById("num-people");
  const calculateBtn = document.getElementById("calculate-survival-btn");

  if (dailyCaloriesInput) {
    // Cargar valor guardado
    dailyCaloriesInput.value = loadDailyCalories();

    // Guardar cambios
    dailyCaloriesInput.addEventListener("input", () => {
      const value = parseInt(dailyCaloriesInput.value);
      if (!isNaN(value) && value > 0) {
        saveDailyCalories(value);
      }
    });
  }

  if (numPeopleInput) {
    // Cargar valor guardado
    numPeopleInput.value = loadNumPeople();

    // Guardar cambios
    numPeopleInput.addEventListener("input", () => {
      const value = parseInt(numPeopleInput.value);
      if (!isNaN(value) && value > 0) {
        saveNumPeople(value);
      }
    });
  }

  // Botón calcular supervivencia
  if (calculateBtn) {
    calculateBtn.addEventListener("click", () => {
      calculateAndShowSurvival();
    });
  }
}
