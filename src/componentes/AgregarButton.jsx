// hooks
import { useState } from "react";

// componentes
import AgregarModal from "./AgregarModal";

export default function AgregarButton({ tipo }) {
  // Estado para manejar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para abrir el modal
  function openModal() {
    setIsModalOpen(true);
  }

  // Función para cerrar el modal
  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <>
      <button
        key={tipo}
        onClick={openModal}
        className="w-48 h-18 m-2 bg-light-secundary text-background font-bold py-2 px-4 rounded hover:bg-light-primary transition-all duration-300 cursor-pointer"
      >
        Agregar {tipo}
      </button>
      {isModalOpen && <AgregarModal tipo={tipo} closeModal={closeModal} />}
    </>
  );
}
