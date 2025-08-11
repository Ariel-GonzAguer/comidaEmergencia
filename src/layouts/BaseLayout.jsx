import { Toaster } from 'sonner';
import Footer from '../componentes/Footer';
import Navegacion from '../componentes/Navegacion';

/**
 * Componente BaseLayout
 * Proporciona la estructura principal de la aplicación, incluyendo barra de navegación, contenido principal y pie de página.
 * Además, integra el sistema de notificaciones (Toaster) para mostrar mensajes globales.
 *
 * Estructura:
 * - Navegación superior (Navegacion)
 * - Contenido principal (children)
 * - Pie de página (Footer)
 * - Toaster para notificaciones emergentes
 *
 * @param {Object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Elementos que se renderizan como contenido principal.
 * @returns {JSX.Element} Layout general de la aplicación.
 */

export default function BaseLayout({ children }) {
  return (
    <section className="bg-background min-h-screen text-text font-primary flex flex-col text-lg cursor-default">
      {/* Toaster: sistema de notificaciones globales, aparece arriba a la derecha */}
      <Toaster position="top-right" richColors visibleToasts={1} closeButton={true} />
      {/* Barra de navegación superior */}
      <Navegacion />
      {/* la class flex-1 permite que el contenido principal ocupe el espacio restante */}
      <main className="flex-1">{children}</main>
      {/* Pie de página con botones de actualización y logout */}
      <Footer />
    </section>
  );
}
