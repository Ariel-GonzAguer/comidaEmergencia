// enrutador
import { RouterProvider as MichiProvider } from "@arielgonzaguer/michi-router";

// componentes
import Login from "../paginas/Login.jsx";
import Home from "../paginas/Home.jsx";
import Comida from "../paginas/Comida.jsx";
import Recetas from "../paginas/Recetas.jsx";
import FAQs from "../paginas/FAQs.jsx";
import Notas from "../paginas/Notas.jsx";
import Lugares from "../paginas/Lugares.jsx";
import Botiquin from "../paginas/Botiquin.jsx";
import Otros from "../paginas/Otros.jsx";

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
    path: "/comida",
    component: (
      <Protected>
        <Comida />
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
    path: "/notas",
    component: (
      <Protected>
        <Notas />
      </Protected>
    ),
  },
  {
    path: "/lugares",
    component: (
      <Protected>
        <Lugares />
      </Protected>
    ),
  },
  {
    path: "/botiquin",
    component: (
      <Protected>
        <Botiquin />
      </Protected>
    ),
  },
  {
    path: "/otros",
    component: (
      <Protected>
        <Otros />
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
