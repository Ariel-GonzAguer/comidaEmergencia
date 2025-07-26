import { logOut } from "../firebase/firebaseConfig";
import { useNavigate } from "@arielgonzaguer/michi-router";

export default function LogOutButton(currentPath) {
  const navigate = useNavigate();

  if (currentPath === "/") {
    return null;
  }

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
