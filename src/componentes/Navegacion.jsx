import { useState } from "react";
import useAuthStore from "../stores/useAuthStore";

export default function Navegacion() {
  const [hovered, setHovered] = useState(null);

  const links = [
    { href: "/home", label: "Inicio" },
    { href: "/comida", label: "Comida" },
    { href: "/recetas", label: "Recetas" },
    { href: "/faqs", label: "FAQs" },
    { href: "/notas", label: "Notas" },
    { href: "/lugares", label: "Lugares" },
    { href: "/botiquin", label: "Botiquín" },
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
