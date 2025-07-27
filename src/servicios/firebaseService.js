// firestore
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
const documento = "comidaEmergenciaCasa"; // nombre del documento en Firestore
const coleccion = "emergenciaData"; // nombre de la colección en Firestore

export default function firabaseService() {
  getData = async () => {
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
  };

  agregarElemento = async (elemento, key) => {
    // validación de datos
    const keysArray = ['alimentos', 'lugares', 'notas', 'recetas', 'botiquin', 'otros'];
    if (!keysArray.includes(key)) {
      console.error("key invalida. Debe ser una de las siguientes:", keysArray.join(", "));
      return null;
    }

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
      throw error; // Propagar el error para su manejo en el componente
    }
  };

  eliminarElemento = async (key, nombre) => {
    // validación de datos
    const keysArray = ['alimentos', 'lugares', 'notas', 'recetas'];
    if (!keysArray.includes(key)) {
      console.error("key invalida. Debe ser una de las siguientes:", keysArray.join(", "));
      return null;
    }

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
      // Eliminar el elemento por nombre
      delete keyActualizada[nombre];

      await updateDoc(docRef, {
        [key]: keyActualizada
      });

      console.log("Documento actualizado con éxito");
      return keyActualizada;

    } catch (error) {
      console.error("Error actualizando documento:", error);
      throw error; // Propagar el error para su manejo en el componente
    }
  };

  actualizarElemento = async (key, nombre, nuevoElemento) => {
    // validación de datos
    const keysArray = ['alimentos', 'lugares', 'notas', 'recetas', 'botiquin', 'otros'];
    if (!keysArray.includes(key)) {
      console.error("key invalida. Debe ser una de las siguientes:", keysArray.join(", "));
      return null;
    }

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
      throw error; // Propagar el error para su manejo en el componente
    }
  };

  return { getData, agregarElemento, eliminarElemento, actualizarElemento };
}