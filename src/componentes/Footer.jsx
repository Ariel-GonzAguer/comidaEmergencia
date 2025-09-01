/**
 * Componente Footer
 * Muestra el pie de página con botón para actualizar datos desde Firebase y botón de logout.
 */

import LogOutButton from '../componentes/LogOutButton';
import useStore from '../stores/useStore';

export default function Footer() {
  // Obtiene la función para refrescar los datos desde Firebase
  const { getFirebaseData } = useStore();

  /**
   * Actualiza los datos desde Firebase y muestra una alerta.
   */
  function handleActualizar() {
    getFirebaseData();
    alert('Datos actualizados desde Firebase');
  }

  // Renderiza el pie de página con los botones
  return (
    <footer className="border-t-2 border-light-primary text-text flex items-center justify-between p-1 w-full">
      {/* Botón para cerrar sesión */}
      <LogOutButton currentPath={window.location.pathname} />

      {/* Botón para actualizar datos desde Firebase */}
      <button onClick={handleActualizar} className="bg-warning text-background px-2 py-1 rounded cursor-pointer border-2 border-warning hover:border-error font-bold">
        Actualizar
      </button>
    </footer>
  );
}
