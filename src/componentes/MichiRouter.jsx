// enrutador
import { RouterProvider as MichiProvider } from "@arielgonzaguer/michi-router";

// componentes
import Login from "../paginas/Login.jsx";
import Comida from "../paginas/Comida.jsx";
import Recetas from "../paginas/Recetas.jsx";
import FAQs from "../paginas/FAQs.jsx";

// layout
import BaseLayout from "../layouts/BaseLayout.jsx";

// rutas
const rutas = [
  { path: "/", component: <Login /> },
  { path: "/home", component: <Comida /> },
  { path: "/recetas", component: <Recetas /> },
  { path: "/faqs", component: <FAQs /> },
];

export default function MichiRouter() {
  return (
    <MichiProvider routes={rutas} layout={BaseLayout}>
      <span>Página no encontrada</span>
    </MichiProvider>
  );
}
