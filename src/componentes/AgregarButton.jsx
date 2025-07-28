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
      <button onClick={openModal}>Agregar {tipo}</button>
      {isModalOpen && <AgregarModal tipo={tipo} closeModal={closeModal} />}
    </>
  );
}
