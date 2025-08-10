/**
 * Componente MichiRouter
 * Define las rutas principales de la aplicación usando el enrutador MichiRouter.
 * Cada ruta puede estar protegida por el componente Protected.
 * El layout principal es BaseLayout.
 */

// enrutador
import { RouterProvider as MichiProvider } from "@arielgonzaguer/michi-router";

// componentes de páginas
import Login from "../paginas/Login.jsx";
import Home from "../paginas/Home.jsx";
import Comida from "../paginas/Comida.jsx";
import Recetas from "../paginas/Recetas.jsx";
import FAQs from "../paginas/FAQs.jsx";
import Notas from "../paginas/Notas.jsx";
import Lugares from "../paginas/Lugares.jsx";
import Medicamentos from "../paginas/Medicamentos.jsx";
import Otros from "../paginas/Otros.jsx";

// protector de rutas
import Protected from "../componentes/Protected.jsx";

// layout principal
import BaseLayout from "../layouts/BaseLayout.jsx";

// Definición de rutas de la app
const rutas = [
  // Ruta de login
  { path: "/", component: <Login /> },
  // Rutas protegidas
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
    path: "/medicamentos",
    component: (
      <Protected>
        <Medicamentos />
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

/**
 * Componente principal del enrutador.
 * Renderiza las rutas definidas y el layout.
 * Si la ruta no existe, muestra "Página no encontrada".
 */
export default function MichiRouter() {
  return (
    <MichiProvider routes={rutas} layout={BaseLayout}>
      <span>Página no encontrada</span>
    </MichiProvider>
  );
}
