import LogOutButton from "../componentes/LogOutButton";
import useStore from "../stores/useStore";

export default function Footer() {
  const { getFirebaseData } = useStore();
  return (
    <footer className="border-t-2 border-light-primary text-text flex items-center justify-between p-1 w-full">
      <LogOutButton currentPath={window.location.pathname} />
      <p>
        Licencia AGPL-3.0.{" "}
        <a
          href="https://github.com/Ariel-GonzAguer/comidaEmergencia"
          rel="noreferrer"
          target="_blank"
          className="text-light-primary font-bold hover:text-light-secundary hover:font-extrabold transition-colors duration-300"
        >
          Repositorio
        </a>
      </p>
      <button
        onClick={getFirebaseData}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Actualizar
      </button>
    </footer>
  );
}
