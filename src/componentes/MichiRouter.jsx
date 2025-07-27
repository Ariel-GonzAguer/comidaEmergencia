// enrutador
import { RouterProvider as MichiProvider } from "@arielgonzaguer/michi-router";

// componentes
import Login from "../paginas/Login.jsx";
import Home from "../paginas/Home.jsx";
import Recetas from "../paginas/Recetas.jsx";
import FAQs from "../paginas/FAQs.jsx";

// protector de rutas
import Protected from "../componentes/Protected.jsx";

// layout
import BaseLayout from "../layouts/BaseLayout.jsx";

// rutas
const rutas = [
  { path: "/", component: <Login /> },
  {
    path: "/home",
    component: (
      <Protected>
        <Home />
      </Protected>
    ),
  },
  {
    path: "/recetas",
    component: (
      <Protected>
        <Recetas />
      </Protected>
    ),
  },
  {
    path: "/faqs",
    component: (
      <Protected>
        <FAQs />
      </Protected>
    ),
  },
];

export default function MichiRouter() {
  return (
    <MichiProvider routes={rutas} layout={BaseLayout}>
      <span>Página no encontrada</span>
    </MichiProvider>
  );
}
