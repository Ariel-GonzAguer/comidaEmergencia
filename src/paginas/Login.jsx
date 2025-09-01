/**
 * Página Login
 * Permite al usuario autenticarse mediante email y contraseña usando Firebase Auth.
 * Al iniciar sesión correctamente, se obtiene la data de Firestore y se redirige al dashboard principal.
 * Muestra un loader animado durante el proceso de autenticación.
 *
 * Estructura:
 * - Formulario de login con email y contraseña
 * - Loader animado durante el proceso
 * - Manejo de errores y redirección
 *
 * Lógica principal:
 * - Utiliza Firebase Auth para autenticación
 * - Al iniciar sesión, actualiza el store de usuario y obtiene los datos de Firestore
 * - Redirige al usuario a /home
 * - Muestra mensajes de error si la autenticación falla
 *
 * @returns {JSX.Element} Página de inicio de sesión
 */
// hooks
import { useRef, useState } from 'react';

// firebase - autenticación
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

// enrutado
import { useNavigate } from '@arielgonzaguer/michi-router';

// store de autenticación
import useAuthStore from '../stores/useAuthStore';
// store de comida
import useStore from '../stores/useStore';

export default function Login() {
  // refs y estados del formulario
  const emailRef = useRef();
  const passwordRef = useRef();
  const [, setError] = useState(null);

  // hook de navegación
  const navigate = useNavigate();

  // store de autenticación - usando isLoading del store en lugar de estado local
  const { setUser, setLoading, isLoading } = useAuthStore();

  // store de comida
  const { getFirebaseData } = useStore();

  /**
   * Maneja el envío del formulario de login.
   * Autentica al usuario con Firebase Auth y actualiza el estado global.
   * @param {React.FormEvent} e - Evento de envío del formulario
   */
  async function handleSubmit(e) {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      setLoading(true);
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
      setUser({ email }); // Cambio: pasar objeto en lugar de string directo
      getFirebaseData();
      console.log(`"Inicio de sesión exitoso" - ${email} - Data de FB obtenida`);
      // setLoading(false); // No necesario: setUser ya pone isLoading en false
      // redirigir a la página de inicio
      navigate('/home');
    } catch (error) {
      setLoading(false);
      // manejar errores de autenticación
      setError(error.message);
      alert('Error al iniciar sesión: ' + error.message);
      console.log(error.message);
    }
  }

  return (
    <section className="flex flex-col items-center justify-center h-full mt-16">
      <h2 className="text-3xl font-bold mb-4">Comida emergencia</h2>
      {/* Formulario de login */}
      <form
        action=""
        className="text-background flex flex-col items-center justify-center"
        onSubmit={handleSubmit}
      >
        <label className="text-text" htmlFor="email">
          Email:
        </label>
        <input type="email" id="email" name="email" className="mb-6" ref={emailRef} required />

        <label className="text-text" htmlFor="password">
          Contraseña:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="mb-6"
          ref={passwordRef}
          required
          autoComplete="current-password"
        />
        <button
          className="border-2 border-light-secundary p-4 text-text font-bold cursor-pointer hover:bg-light-secundary hover:border-background hover:text-background transition-colors duration-200"
          type="submit"
        >
          Iniciar sesión
        </button>
      </form>
      {/* Loader animado mientras se procesa el login */}
      {isLoading && <img src="/Blocks_loading.io.svg" alt="Cargando..." />}
    </section>
  );
}