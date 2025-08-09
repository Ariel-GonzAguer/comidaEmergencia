import LogOutButton from "../componentes/LogOutButton";
import useStore from "../stores/useStore";

export default function Footer() {
  const { getFirebaseData } = useStore();

  function handleActualizar() {
    getFirebaseData();
    alert("Datos actualizados desde Firebase");
  }

  return (
    <footer className="border-t-2 border-light-primary text-text flex items-center justify-between p-1 w-full">
      <LogOutButton currentPath={window.location.pathname} />

      <button
        onClick={handleActualizar}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Actualizar
      </button>
    </footer>
  );
}
