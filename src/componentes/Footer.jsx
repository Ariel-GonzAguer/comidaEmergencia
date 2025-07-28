import LogOutButton from "../componentes/LogOutButton";

export default function Footer() {
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
    </footer>
  );
}
