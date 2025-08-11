/**
 * Componente LogOutButton
 * Muestra un botón para cerrar sesión, excepto en la página principal.
 */

import { logOut } from '../firebase/firebaseConfig';
import { useNavigate } from '@arielgonzaguer/michi-router';

/**
 * Botón para cerrar sesión del usuario.
 * @param {string} currentPath - Ruta actual de la aplicación.
 * @returns {JSX.Element|null}
 */
export default function LogOutButton(currentPath) {
  const navigate = useNavigate();

  // No mostrar el botón en la página principal
  if (currentPath === '/') {
    return null;
  }

  /**
   * Maneja el proceso de cierre de sesión del usuario.
   * Intenta cerrar la sesión, navega a la página principal si tiene éxito,
   * y muestra una alerta si ocurre un error durante el cierre de sesión.
   * @async
   */
  async function handleLogOut() {
    try {
      await logOut();
      console.log('Sesión cerrada exitosamente');
      navigate('/');
    } catch {
      alert(`Parece que hubo un error al cerrar sesión.`);
    }
  }

  // Renderiza el botón de logout
  return (
    <button
      onClick={handleLogOut}
      className="border-2 border-black bg-error px-2 text-background font-bold
       hover:bg-warning hover:text-black
       transition-all duration-300 ease-in-out cursor-pointer"
    >
      Cerrar Sesión
    </button>
  );
}
