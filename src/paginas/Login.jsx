import { useRef, useState } from "react";

// firebase - autenticación
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

// enrutado
import { useNavigate } from "@arielgonzaguer/michi-router";

export default function Login(props) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <section className="container  flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Comida emergencia</h2>
      <form
        action=""
        className=" flex flex-col items-center justify-center"
        onSubmit={handleSubmit}
      >
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" className="mb-6" required />
        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          name="password"
          className="mb-6"
          required
        />
        <button type="submit">Iniciar sesión</button>
      </form>
    </section>
  );
}
