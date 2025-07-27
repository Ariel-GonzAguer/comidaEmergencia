// hooks
import { useRef } from "react";

// clases
import Alimento from "../clases/AlimentoClass";
import Lugar from "../clases/lugarClass";
import Nota from "../clases/notaClass";
import Receta from "../clases/recetaClass";
import BotiquinItem from "../clases/BotiquinItemClass";
import Otros from "../clases/OtrosItemClass";

// store
import useStore from "../stores/useStore";

export default function ModalAgregar({ tipo }) {
  // store
  const store = useStore();
  const { agregarElemento } = useStore();

  // validar tipo para desarrollo
  if (!Object.keys(store).includes(tipo)) {
    console.error(
      `Tipo "${tipo}" no válido. Debe ser uno de: ${Object.keys(store).join(
        ", "
      )}.`
    );
    return null;
  }

  // refs
  const nombreRef = useRef();
  const ingredientesRecetaRef = useRef();
  const instruccionesRecetaRef = useRef();
  const caloriasRef = useRef();
  const contenidoNotaRef = useRef();
  const usoRef = useRef();
  const cantidadRef = useRef();
  const fechaVencimientoRef = useRef();
  const tipoRef = useRef();

  // funciones
  function handleAgregar(e, tipo) {
    e.preventDefault();

    if (store[tipo][nombreRef.current.value]) {
      alert(
        `El elemento ${nombreRef.current.value} ya existe en ${tipo}. Agregue algún diferenciador para evitar confusiones con las fechas de vencimiento o cantidades.`
      );
      return;
    }

    if (tipo === "alimentos") {
      const nuevoAlimento = Alimento.crearAlimento(
        nombreRef.current.value,
        tipoRef.current.value,
        caloriasRef.current.value,
        cantidadRef.current.value,
        fechaVencimientoRef.current.value
      );
      agregarElemento(nuevoAlimento, tipo);
    } else if (tipo === "lugares") {
      const nuevoLugar = Lugar.crearLugar(nombreRef.current.value);
      agregarElemento(nuevoLugar, tipo);
    } else if (tipo === "notas") {
      const nuevaNota = Nota.crearNota(
        nombreRef.current.value,
        contenidoNotaRef.current.value
      );
      agregarElemento(nuevaNota, tipo);
    } else if (tipo === "recetas") {
      const nuevaReceta = Receta.crearReceta(
        nombreRef.current.value,
        ingredientesRecetaRef.current.value,
        caloriasRef.current.value,
        instruccionesRecetaRef.current.value
      );
      agregarElemento(nuevaReceta, tipo);
    } else if (tipo === "botiquin") {
      const nuevoBotiquinItem = BotiquinItem.crearBotiquinItem(
        nombreRef.current.value,
        usoRef.current.value,
        cantidadRef.current.value,
        fechaVencimientoRef.current.value
      );
      agregarElemento(nuevoBotiquinItem, tipo);
    } else if (tipo === "otros") {
      const nuevoOtro = Otros.crearOtrosItem(
        nombreRef.current.value,
        usoRef.current.value
      );
      agregarElemento(nuevoOtro, tipo);
    }

    // Limpiar los campos del formulario
    e.target.reset();
  }

  return (
    <div className="flex flex-col items-center justify-center ">
      <h2>Agregar {tipo}</h2>
      <form
        onSubmit={(e) => handleAgregar(e, tipo)}
        className="flex flex-col gap-2 w-2xs border-4 border-gray-300 p-4 rounded-lg"
      >
        {/* Campos del formulario según el tipo */}

        <label htmlFor="nombre">Nombre</label>
        <input
          type="text"
          id="nombre"
          placeholder="Nombre"
          className="text-background"
          ref={nombreRef}
        />

        {tipo === "alimentos" && (
          <>
            <label htmlFor="tipo">Tipo</label>
            <input
              type="text"
              id="tipo"
              placeholder="Tipo"
              className="text-background"
              ref={tipoRef}
            />
          </>
        )}

        {(tipo === "alimentos" || tipo === "botiquin") && (
          <>
            <label htmlFor="cantidad">Cantidad</label>
            <input
              type="text"
              id="cantidad"
              placeholder="Cantidad"
              ref={cantidadRef}
              className="text-background"
            />
          </>
        )}

        {(tipo === "alimentos" || tipo === "recetas") && (
          <>
            <label htmlFor="calorias-receta">Calorías</label>
            <input
              type="number"
              id="calorias-receta"
              placeholder="Calorías"
              ref={caloriasRef}
              className="text-background"
            />
          </>
        )}

        {tipo === "notas" && (
          <>
            <label htmlFor="contenido-nota">Contenido de la nota</label>
            <textarea
              id="contenido-nota"
              placeholder="Contenido de la nota"
              ref={contenidoNotaRef}
              className="text-background"
            ></textarea>
          </>
        )}

        {tipo === "recetas" && (
          <>
            <label htmlFor="ingredientes-receta">Ingredientes</label>
            <input
              type="text"
              id="ingredientes-receta"
              ref={ingredientesRecetaRef}
              placeholder="Ingredientes"
              className="text-background"
            />
            <label htmlFor="instrucciones-receta">Instrucciones</label>
            <input
              type="text"
              id="instrucciones-receta"
              placeholder="Instrucciones"
              className="text-background"
              ref={instruccionesRecetaRef}
            />
          </>
        )}

        {(tipo === "botiquinItem" || tipo === "alimentos") && (
          <>
            <label htmlFor="fecha-vencimiento-botiquin-item">
              Fecha de vencimiento
            </label>
            <input
              type="date"
              id="fecha-vencimiento-botiquin-item"
              placeholder="Fecha de vencimiento"
              className="text-background"
              ref={fechaVencimientoRef}
            />
          </>
        )}

        {(tipo === "otros" || tipo === "botiquin") && (
          <>
            <label htmlFor="descripcion-otros">Uso</label>
            <textarea
              id="uso-otros"
              ref={usoRef}
              placeholder="Uso"
              className="text-background"
            ></textarea>
          </>
        )}

        <button
          type="submit"
          className="bg-atencion-secundary text-background font-bold py-2 px-4 rounded hover:font-extrabold hover:scale-101 transition-all duration-300 cursor-pointer"
        >
          Agregar
        </button>
      </form>
    </div>
  );
}
