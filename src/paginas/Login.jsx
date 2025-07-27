import { useRef, useState } from "react";

// firebase - autenticación
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

// enrutado
import { useNavigate } from "@arielgonzaguer/michi-router";

// store de autenticación
import useAuthStore from "../stores/useAuthStore";
// store de comida
import useStore from "../stores/useStore";

export default function Login(props) {
  // refs y estados del formulario
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState(null);

  // hook de navegación
  const navigate = useNavigate();

  // store de autenticación
  const { setUser } = useAuthStore();

  // store de comida
  const { getFirebaseData } = useStore();

  async function handleSubmit(e) {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setUser(email);
      getFirebaseData();
      console.log(`"Inicio de sesión exitoso" - ${email} - Data de FB obtenida`);
      navigate("/home");
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  }

  return (
    <section className="flex flex-col items-center justify-center h-full">
      <div>
        <h2 className="text-3xl font-bold mb-4">Comida emergencia</h2>
        <form
          action=""
          className="text-background flex flex-col items-center justify-center"
          onSubmit={handleSubmit}
        >
          <label className="text-text" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mb-6"
            ref={emailRef}
            required
          />

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
          />
          <button
            className="border-2 border-atencion p-4 text-text font-bold cursor-pointer hover:bg-atencion-secundary hover:border-background hover:text-background transition-colors duration-200"
            type="submit"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </section>
  );
}
