import AgregarModal from "./AgregarModal";


export default function AgregarButton({ ...props }) {
  const elemento = props.elemento;

  // Función para manejar el clic en el botón
  function handleClick() {
    openModal(elemento);
  }

  return (
    <>
      <button onClick={handleClick}>Agregar {elemento}</button>
    </>
  );
}
