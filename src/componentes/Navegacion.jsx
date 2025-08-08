import { useState } from "react";
import useAuthStore from "../stores/useAuthStore";

/**
 * El componente Navegacion muestra una barra de navegación con enlaces a diferentes secciones de la aplicación.
 * La barra de navegación solo se muestra si el usuario está autenticado y la ruta actual no es la raíz ("/").
 * Cada enlace se resalta al pasar el mouse, y los enlaces no seleccionados se ven semitransparentes para dar retroalimentación visual.
 *
 * @component
 * @returns {JSX.Element|null} El elemento de la barra de navegación, o null si el usuario no está autenticado o está en la ruta raíz.
 */
export default function Navegacion() {
  const [hovered, setHovered] = useState(null);

  const links = [
    { href: "/home", label: "Inicio" },
    { href: "/comida", label: "Comida" },
    { href: "/recetas", label: "Recetas" },
    { href: "/faqs", label: "FAQs" },
    { href: "/notas", label: "Notas" },
    { href: "/lugares", label: "Lugares" },
    { href: "/medicamentos", label: "Medicamentos" },
    { href: "/otros", label: "Otros" },
  ];

  const { user } = useAuthStore();

  if (!user || window.location.pathname === "/") {
    return null;
  }

  return (
    <nav className="border-b-2 border-light-secundary w-full">
      <ul className="flex items-center justify-between flex-wrap px-4 py-2">
        {links.map((link, idx) => (
          <li
            key={link.href}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            className={`
              mx-2 my-2
              ${hovered === null
                ? "hover:text-atencion-secundary hover:font-bold transition-colors duration-200 hover:no-underline"
                : hovered === idx
                ? "text-atencion-secundary font-bold transition-colors duration-200"
                : "opacity-50 transition-opacity duration-200"}`
            }
          >
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
