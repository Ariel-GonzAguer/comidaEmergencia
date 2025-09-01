import { useEffect } from 'react';
import { useNavigate } from '@arielgonzaguer/michi-router';
import useAuthStore from '../stores/useAuthStore';

/**
 * Hook/estado de autenticación
 * --------------------------------
 * Si tu store expone `isLoading`, úsalo.
 * Si no, podemos inferir el estado de carga con `user === undefined`.
 * (No creamos un hook separado para evitar complejidad innecesaria.)
 */

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

  // Leemos el estado desde el store
  const { user, isLoading: storeIsLoading } = useAuthStore();

  // Determinamos si está cargando: priorizamos `storeIsLoading` si existe; si no, inferimos por `user === undefined`
  const isLoading = typeof storeIsLoading === 'boolean' ? storeIsLoading : user === undefined;

  useEffect(() => {
    // Redirigir solo cuando haya terminado de cargar y el usuario NO esté autenticado
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    // Puedes personalizar el loader
    return <div className="w-full h-screen flex items-center justify-center">Cargando...</div>;
  }

  return user ? children : null;
}
