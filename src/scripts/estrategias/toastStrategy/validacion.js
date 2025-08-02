// data
import { keysArray } from '../../../servicios/firebaseService'

const tiposValidos = ['success', 'error', 'eliminar'];

export default function validaEstrategia(tipo, payload) {
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