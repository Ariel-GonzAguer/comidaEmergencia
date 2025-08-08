import toastStrategiesObject from "./toastStrategiesObject";
import validarEstrategia from "./validacion";


/**
 * Muestra una notificación tipo "toast" utilizando la estrategia correspondiente según el tipo especificado.
 *
 * @param {string} tipo - El tipo de estrategia de toast a utilizar.
 * @param {Object} payload - Los datos necesarios para la estrategia de toast seleccionada.
 * @throws {Error} Si la estrategia especificada no es válida.
 */
function mostrarToastStrategy(tipo, payload) {
  // Validar la estrategia
  validarEstrategia(tipo, payload);

  const estrategia = toastStrategiesObject[tipo] || toastStrategiesObject.default;
  estrategia(payload);
}


export default mostrarToastStrategy;
