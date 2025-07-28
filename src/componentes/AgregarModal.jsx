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

export default function ModalAgregar({ tipo, closeModal }) {
  // store
  const store = useStore();
  const { agregarElemento, lugares } = useStore();

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
  const lugarRef = useRef();

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
      // Prevenir si no hay lugares disponibles
      const lugaresArray = Object.keys(lugares);
      if (lugaresArray.length === 0) {
        alert("Debes agregar al menos un lugar antes de agregar alimentos.");
        return;
      }
      // Buscar el objeto lugar correspondiente por id
      const lugarSeleccionado = lugares[lugarRef.current.value];
      if (!lugarSeleccionado) {
        alert("Selecciona una ubicación válida.");
        return;
      }
      const ubicacionPlano = {
        id: lugarSeleccionado.id,
        nombre: lugarSeleccionado.nombre,
      };
      const nuevoAlimento = Alimento.crearAlimento(
        nombreRef.current.value,
        tipoRef.current.value,
        caloriasRef.current.value,
        cantidadRef.current.value,
        fechaVencimientoRef.current.value,
        ubicacionPlano
      );
      agregarElemento(nuevoAlimento, tipo);
      console.log("Nuevo alimento agregado:", nuevoAlimento);
      closeModal();
    } else if (tipo === "lugares") {
      const nuevoLugar = Lugar.crearLugar(nombreRef.current.value);
      agregarElemento(nuevoLugar, tipo);
      console.log("Nuevo lugar agregado:", nuevoLugar);
      closeModal();
    } else if (tipo === "notas") {
      const nuevaNota = Nota.crearNota(
        nombreRef.current.value,
        contenidoNotaRef.current.value
      );
      agregarElemento(nuevaNota, tipo);
      console.log("Nueva nota agregada:", nuevaNota);
      closeModal();
    } else if (tipo === "recetas") {
      const nuevaReceta = Receta.crearReceta(
        nombreRef.current.value,
        ingredientesRecetaRef.current.value,
        caloriasRef.current.value,
        instruccionesRecetaRef.current.value
      );
      agregarElemento(nuevaReceta, tipo);
      console.log("Nueva receta agregada:", nuevaReceta);
      closeModal();
    } else if (tipo === "botiquin") {
      const nuevoBotiquinItem = BotiquinItem.crearBotiquinItem(
        nombreRef.current.value,
        usoRef.current.value,
        cantidadRef.current.value,
        fechaVencimientoRef.current.value
      );
      agregarElemento(nuevoBotiquinItem, tipo);
      console.log("Nuevo botiquín item agregado:", nuevoBotiquinItem);
      closeModal();
    } else if (tipo === "otros") {
      const nuevoOtro = Otros.crearOtrosItem(
        nombreRef.current.value,
        usoRef.current.value
      );
      agregarElemento(nuevoOtro, tipo);
      console.log("Nuevo otro item agregado:", nuevoOtro);
      closeModal();
    } else {
      console.error(`Tipo "${tipo}" no válido.`);
      return;
    }

    // Limpiar los campos del formulario
    e.target.reset();
  }

  return (
    <dialog
      id="agregar-modal"
      className="flex flex-col items-center justify-center bg-background text-text p-4 rounded-lg shadow-lg"
    >
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
            <label htmlFor="lugar">Ubicación</label>
            <select
              name="lugar"
              id="lugar"
              ref={lugarRef}
              defaultValue={Object.keys(lugares)[0] || ""}
              disabled={Object.keys(lugares).length === 0}
              className="text-background"
            >
              {Object.entries(lugares).map(([id, lugar]) => (
                <option key={id} value={id} className="text-background">
                  {lugar.nombre}
                </option>
              ))}
            </select>
            {Object.keys(lugares).length === 0 && (
              <p className="text-red-500 text-xs">
                Agrega un lugar antes de agregar alimentos.
              </p>
            )}
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
          className="bg-light-secundary text-background font-bold py-2 px-4 rounded hover:font-extrabold hover:scale-101 transition-all duration-300 cursor-pointer"
        >
          Agregar
        </button>
        <button
          type="button"
          id="cancelar-agregar-button"
          className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300"
          onClick={closeModal}
        >
          Cancelar
        </button>
      </form>
    </dialog>
  );
}
