/**
 * Función validarEstrategia
 * Valida el tipo y el payload para mostrar notificaciones (toast) en la aplicación.
 * Permite controlar los tipos de notificación y los datos requeridos para cada caso.
 *
 * Tipos válidos:
 * - success: notificación de éxito
 * - error: notificación de error
 * - eliminar: notificación para eliminar un elemento (requiere key e id)
 * - default: notificación genérica
 *
 * Reglas de validación:
 * - El payload debe ser un objeto.
 * - El tipo debe estar en la lista de tipos válidos.
 * - Para 'eliminar', el payload debe incluir 'key' y 'id', y la key debe ser válida.
 *
 * @param {string} tipo - Tipo de notificación a mostrar.
 * @param {Object} payload - Datos asociados a la notificación.
 * @returns {true|undefined} Retorna true si la validación es exitosa, undefined si hay error.
 */
// data
import { keysArray } from '../../../servicios/firebaseService'

const tiposValidos = ['success', 'error', 'eliminar', 'default'];

export default function validarEstrategia(tipo, payload) {
  if (typeof payload !== 'object' || payload === null) {
    console.error("Payload debe ser un objeto");
    return;
  }
  if (!tiposValidos.includes(tipo)) {
    console.error(`Tipo "${tipo}" no válido. Usando toast por defecto. Debe ser uno de: ${tiposValidos.join(", ")}`);
    return;
  }
  if (tipo === 'eliminar' && (!payload.key || !payload.id)) {
    console.error("Para el tipo 'eliminar', se requiere un 'key' y un 'id' en el payload.");
    return;
  } else if (tipo === 'eliminar' && !keysArray.includes(payload.key)) {
    console.error(`La clave "${payload.key}" no es válida. Debe ser una de: ${keysArray.join(", ")}`);
    return;
  }
  return true;
}