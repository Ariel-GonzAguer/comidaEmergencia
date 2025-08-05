// firestore
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const documento = "casa"; // nombre del documento en Firestore
const coleccion = "emergenciaData"; // nombre de la colección en Firestore

// Array de claves válidas para los campos
// agregar más claves según sea necesario
export const keysArray = ['alimentos', 'lugares', 'notas', 'recetas', 'medicamentos', 'otros'];

/**
 * Valida si la clave proporcionada existe en el array de claves permitidas.
 *
 * @param {string} key - La clave a validar.
 * @returns {boolean} Devuelve true si la clave es válida, de lo contrario false.
 */
function validarKey(key) {
  if (!keysArray.includes(key)) {
    console.error("key invalida. Debe ser una de las siguientes:", keysArray.join(", "));
    return false;
  }
  return true;
}

/**
 * Recupera los datos de un documento específico de Firestore.
 *
 * @async
 * @function
 * @returns {Promise<Object|null>} Los datos del documento si existen, de lo contrario null.
 * @throws Mostrará un error y devolverá null si el documento no existe o si ocurre un error durante la obtención.
 */
export async function getData() {
  try {
    const docRef = doc(db, coleccion, documento);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.error("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
}

/**
 * Agrega un elemento a un campo específico de un documento en Firebase Firestore.
 *
 * @async
 * @function agregarElementoFB
 * @param {Object} elemento - El elemento a agregar, debe contener una propiedad `id`.
 * @param {string} key - La clave del campo dentro del documento donde se agregará el elemento.
 * @returns {Promise<Object|null>} El objeto actualizado del campo si la operación fue exitosa, o `null` si hubo un error de validación o el documento/campo no existe.
 * @throws {Error} Si ocurre un error durante la actualización del documento en Firestore.
 */
export async function agregarElementoFB(elemento, key) {
  if (!validarKey(key)) return null;

  try {
    const docRef = doc(db, coleccion, documento);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.error("Ese documento no existe!");
      return null;
    }
    const data = docSnap.data();
    if (!data[key] || typeof data[key] !== 'object') {
      console.error("Ese campo no existe o no es un objeto válido");
      return null;
    }
    const keyActualizada = {
      ...data[key],
      [elemento.id]: { ...elemento }
    };
    await updateDoc(docRef, {
      [key]: keyActualizada
    });
    console.log("Documento actualizado con éxito");
    return keyActualizada;
  } catch (error) {
    console.error("Error actualizando documento:", error);
    throw error;
  }
}

/**
 * Elimina un elemento de un campo objeto dentro de un documento en Firebase Firestore.
 *
 * @async
 * @function eliminarElementoFB
 * @param {string} key - El nombre del campo (key) dentro del documento que contiene el objeto.
 * @param {string} id - El identificador del elemento a eliminar dentro del objeto.
 * @returns {Promise<Object|null>} El objeto actualizado después de eliminar el elemento, o null si no se pudo realizar la operación.
 * @throws {Error} Si ocurre un error al actualizar el documento.
 */
export async function eliminarElementoFB(key, id) {
  if (!validarKey(key)) return null;

  try {
    const docRef = doc(db, coleccion, documento);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.error("Ese documento no existe!");
      return null;
    }
    const data = docSnap.data();
    if (!data[key] || typeof data[key] !== 'object') {
      console.error("Ese campo no existe o no es un objeto válido");
      return null;
    }
    const keyActualizada = {
      ...data[key],
    };
    delete keyActualizada[id];
    await updateDoc(docRef, {
      [key]: keyActualizada
    });
    console.log("Documento actualizado con éxito");
    return keyActualizada;
  } catch (error) {
    console.error("Error actualizando documento:", error);
    throw error;
  }
}

/**
 * Actualiza un elemento específico dentro de un campo objeto en un documento de Firebase.
 *
 * @async
 * @function
 * @param {string} key - El nombre del campo (key) dentro del documento que contiene el objeto a actualizar.
 * @param {string} id - El identificador del elemento dentro del objeto que se va a actualizar o agregar.
 * @param {Object} nuevoElemento - El nuevo valor del elemento que se va a establecer bajo el id especificado.
 * @returns {Promise<Object|null>} Retorna el objeto actualizado bajo la key especificada, o null si la operación falla.
 * @throws Lanza un error si ocurre un problema durante la actualización del documento.
 */
export async function actualizarElementoFB(key, id, nuevoElemento) {
  if (!validarKey(key)) return null;

  try {
    const docRef = doc(db, coleccion, documento);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.error("Ese documento no existe");
      return null;
    }
    const data = docSnap.data();
    if (!data[key] || typeof data[key] !== 'object') {
      console.error("Ese campo no existe o no es un objeto válido");
      return null;
    }
    const keyActualizada = {
      ...data[key],
      [id]: { ...nuevoElemento }
    };
    await updateDoc(docRef, {
      [key]: keyActualizada
    });
    console.log("Documento actualizado con éxito");
    return keyActualizada;
  } catch (error) {
    console.error("Error actualizando documento:", error);
    throw error;
  }
}
