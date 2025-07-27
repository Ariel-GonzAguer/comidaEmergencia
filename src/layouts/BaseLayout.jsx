import { Toaster } from "sonner";
import Footer from "../componentes/Footer";
import Navegacion from "../componentes/Navegacion";

export default function BaseLayout({ children }) {
  return (
    <section className="bg-background text-text font-primary flex flex-col text-lg">
      <Toaster />
      <Navegacion />
      {/* la class flex-1 permite que el contenido principal ocupe el espacio restante */}
      <main className="flex-1">{children}</main>
      <Footer />
    </section>
  );
}
