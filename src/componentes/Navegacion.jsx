import { useState } from "react";
import useAuthStore from "../stores/useAuthStore";

export default function Navegacion() {
  const [hovered, setHovered] = useState(null);

  const links = [
    { href: "/home", label: "Comida" },
    { href: "/recetas", label: "Recetas" },
    { href: "/faqs", label: "FAQs" },
  ];

  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  return (
    <nav className="border-b-2 border-atencion-secundary w-full">
      <ul className="flex items-center justify-between px-4 py-2">
        {links.map((link, idx) => (
          <li
            key={link.href}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            className={
              hovered === null
                ? "hover:text-atencion-secundary hover:font-bold transition-colors duration-200 hover:no-underline"
                : hovered === idx
                ? "text-atencion-secundary font-bold transition-colors duration-200"
                : "opacity-50 transition-opacity duration-200"
            }
          >
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
