import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// configuración de Firebase
const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_VITE_FIREBASE_API_KEY,
  authDomain: "emergencia-5b0c0.firebaseapp.com",
  projectId: "emergencia-5b0c0",
  storageBucket: "emergencia-5b0c0.firebasestorage.app",
  messagingSenderId: "342709261479",
  appId: "1:342709261479:web:aefd9d0881123ebb993782"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth
const auth = getAuth(app);

// Inicializar Firestore
const db = getFirestore(app);

// Función para cerrar sesión
async function logOut() {
  await signOut(auth);
}

export { auth, db, logOut };
