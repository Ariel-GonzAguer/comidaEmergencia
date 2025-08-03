import { logOut } from "../firebase/firebaseConfig";
import { useNavigate } from "@arielgonzaguer/michi-router";

export default function LogOutButton(currentPath) {
  const navigate = useNavigate();

  if (currentPath === "/") {
    return null;
  }

  // Cerrar sesión
  /**
   * Maneja el proceso de cierre de sesión del usuario.
   * Intenta cerrar la sesión, navega a la página principal si tiene éxito,
   * y muestra una alerta si ocurre un error durante el cierre de sesión.
   *
   * @async
   * @function handleLogOut
   * @returns {Promise<void>} Se resuelve cuando el proceso de cierre de sesión finaliza.
   */
  async function handleLogOut() {
    try {
      await logOut();
      console.log("Sesión cerrada exitosamente");
      navigate("/");
    } catch {
      alert(
        `Parece que hubo un error al cerrar sesión.`
      );
    }
  }

  return (
    <button onClick={handleLogOut}
      className="border-2 border-black bg-atencion px-2 text-background
       hover:bg-red-500 hover:text-black hover:font-bold
       transition-all duration-300 ease-in-out cursor-pointer">
      Cerrar Sesión
    </button>
  )
}
