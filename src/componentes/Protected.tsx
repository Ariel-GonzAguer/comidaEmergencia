import { useEffect } from 'react';
import { useNavigate } from '@arielgonzaguer/michi-router';
import useAuthStore from '../stores/useAuthStore';

/**
 * Hook para saber si el auth está cargando (puedes ajustar según tu store)
 */
function useAuthStatus() {
  const { user, isLoading } = useAuthStore();
  // Si tu store no tiene isLoading, puedes deducirlo de user === undefined
  // return { user, isLoading: user === undefined };
  return { user, isLoading: typeof isLoading === 'boolean' ? isLoading : user === undefined };
}

/**
 * Un componente que restringe el acceso a sus hijos según el estado de autenticación del usuario.
 *
 * Si el usuario no está autenticado, redirige a la página de landing ("/").
 * De lo contrario, renderiza sus hijos.
 *
 * @param children - Los nodos React a renderizar si el usuario está autenticado.
 * @returns Los hijos si está autenticado, de lo contrario null.
 */
export default function Protected({ children }) {
  const navigate = useNavigate();
  const { user, isLoading } = useAuthStatus();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    // Puedes personalizar el loader
    return <div className="w-full h-screen flex items-center justify-center">Cargando...</div>;
  }

  return user ? children : null;
}
