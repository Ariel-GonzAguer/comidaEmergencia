/**
 * Componente AgregarButton
 * Muestra un botón para agregar un nuevo elemento del tipo indicado.
 * Al hacer clic, abre un modal para ingresar los datos del nuevo elemento.
 *
 * Props:
 * - tipo: string que indica el tipo de elemento a agregar (ej: "alimento", "nota", etc.)
 */

// hooks
import { useState } from "react";

// componentes
import AgregarModal from "./AgregarModal";

export default function AgregarButton({ tipo }) {
  // Estado para manejar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Abre el modal de agregar elemento.
   */
  function openModal() {
    setIsModalOpen(true);
  }

  /**
   * Cierra el modal de agregar elemento.
   */
  function closeModal() {
    setIsModalOpen(false);
  }

  // Renderiza el botón y el modal si corresponde
  return (
    <>
      <button
        key={tipo}
        onClick={openModal}
        className="w-48 h-18 m-2 bg-light-secundary text-background font-bold py-2 px-4 rounded hover:bg-light-primary transition-all duration-300 cursor-pointer"
      >
        Agregar {tipo}
      </button>
      {/* Modal para agregar el elemento */}
      {isModalOpen && <AgregarModal tipo={tipo} closeModal={closeModal} />}
    </>
  );
}
