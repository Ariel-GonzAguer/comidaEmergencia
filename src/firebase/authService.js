import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";

import { auth } from "./firebaseConfig.js";

export const authService = {
  // Iniciar sesión
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(this.getErrorMessage(error.code));
    }
  },

  // Registrar usuario
  async signUp(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(this.getErrorMessage(error.code));
    }
  },

  // Escuchar cambios de autenticación
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },

  // Obtener mensajes de error en español
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/email-already-in-use': 'El email ya está en uso',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/invalid-email': 'Email inválido',
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-credential': 'Credenciales inválidas',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
    };

    return errorMessages[errorCode] || 'Error de autenticación';
  }
};
