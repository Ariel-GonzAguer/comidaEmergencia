import toastStrategiesObject from "./toastStrategiesObject";
import validaEstrategia from "./validacion";

/**
 * Muestra un toast según la estrategia definida para el tipo especificado.
 *
 * @param {string} tipo - El tipo de toast a mostrar. Debe ser uno de los valores definidos en `tiposValidos`.
 * @param {Object} payload - Objeto con los datos necesarios para mostrar el toast.
 * @param {string} [payload.key] - Clave requerida para el tipo 'eliminar'. Debe estar en `keysArray`.
 * @param {string|number} [payload.id] - ID requerido para el tipo 'eliminar'.
 *
 * @returns {void}
 *
 * @throws {Error} Si el payload no es un objeto, el tipo no es válido, o faltan datos requeridos para el tipo 'eliminar'.
 */
function mostrarToastStrategy(tipo, payload) {
  // Validar la estrategia
  validaEstrategia(tipo, payload);

  const estrategia = toastStrategiesObject[tipo] || toastStrategiesObject.default;
  estrategia(payload);
}


export default mostrarToastStrategy;
