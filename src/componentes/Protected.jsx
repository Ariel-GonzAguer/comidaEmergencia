import { useEffect } from 'react';
import { useNavigate } from '@arielgonzaguer/michi-router';
import useAuthStore from '../stores/useAuthStore';

/**
 * Un componente que restringe el acceso a sus hijos según el estado de autenticación del usuario.
 *
 * Si el usuario no está autenticado, redirige a la página de landing ("/").
 * De lo contrario, renderiza sus hijos.
 *
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Los nodos React a renderizar si el usuario está autenticado.
 * @returns {JSX.Element|null} Los hijos si está autenticado, de lo contrario loader.
 */
export default function Protected({ children }) {
  const navigate = useNavigate();

  // Leemos el estado directamente desde el store
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    // Redirigir solo cuando haya terminado de cargar y el usuario NO esté autenticado
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    // Loader personalizable mientras está cargando
    return <div className="w-full h-screen flex items-center justify-center">Cargando...</div>;
  }

  return user ? children : null;
}
