// firestore
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const documento = "casa"; // nombre del documento en Firestore
const coleccion = "emergenciaData"; // nombre de la colección en Firestore

// Array de claves válidas para los campos
// agregar más claves según sea necesario
const keysArray = ['alimentos', 'lugares', 'notas', 'recetas', 'botiquin', 'otros'];

// verifica si la clave es válida
function validarKey(key) {
  if (!keysArray.includes(key)) {
    console.error("key invalida. Debe ser una de las siguientes:", keysArray.join(", "));
    return false;
  }
  return true;
}

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
      [elemento.nombre]: { ...elemento }
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

export async function eliminarElementoFB(key, nombre) {
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
    delete keyActualizada[nombre];
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

export async function actualizarElementoFB(key, nombre, nuevoElemento) {
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
      [nombre]: { ...nuevoElemento }
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
