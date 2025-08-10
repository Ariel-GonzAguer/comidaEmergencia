/**
 * Componente ModalAgregar
 * Muestra un modal para agregar un nuevo elemento (alimento, lugar, nota, receta, medicamento, otros).
 * Valida los datos con Zod y utiliza las clases correspondientes para instanciar el elemento.
 * Muestra mensajes de error y éxito mediante el sistema de notificaciones (toast).
 *
 * Props:
 * - tipo: string que indica el tipo de elemento a agregar
 * - closeModal: función para cerrar el modal
 */

// hooks
import { useRef } from "react";

// clases
import Alimento from "../clases/alimentoClass.js";
import Lugar from "../clases/lugarClass.js";
import Nota from "../clases/notaClass.js";
import Receta from "../clases/recetaClass.js";
import Medicamento from "../clases/medicamentoClass.js";
import Otros from "../clases/otrosItemClass.js";

// esquemas validación zod
import {
  alimentoSchema,
  lugarSchema,
  notaSchema,
  recetaSchema,
  medicamentoSchema,
  otrosSchema,
  obtenerMensajesErrorZod,
} from "../servicios/esquemasZod";

// store
import useStore from "../stores/useStore";

// estrategia de toast
import mostrarToastStrategy from "../scripts/strategies/toastStrategy";

export default function ModalAgregar({ tipo, closeModal }) {
  // store
  const store = useStore();
  const { agregarElemento, lugares } = useStore();

  // refs para los campos del formulario
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

  // Validar tipo para desarrollo
  if (!Object.keys(store).includes(tipo)) {
    console.error(
      `Tipo "${tipo}" no válido. Debe ser uno de: ${Object.keys(store).join(", ")}.`
    );
    return null;
  }

  /**
   * Maneja la lógica para agregar diferentes tipos de elementos al store.
   * Valida los datos usando esquemas Zod específicos para cada tipo.
   * Muestra mensajes de error claros usando los mensajes generados por Zod.
   * Muestra mensajes de éxito mediante el sistema de notificaciones (toast).
   * Limpia el formulario al finalizar.
   * @param {React.FormEvent} e - El evento de envío del formulario.
   * @param {string} tipo - El tipo de elemento a agregar.
   */
  function handleAgregar(e, tipo) {
    e.preventDefault();

    // Prevenir duplicados
    if (store[tipo][nombreRef.current.value]) {
      mostrarToastStrategy("default", {
        mensaje: `El elemento ${nombreRef.current.value} ya existe en ${tipo}. Agregue algún diferenciador para evitar confusiones con las fechas de vencimiento o cantidades.`,
      });
      return;
    }

    try {
      let validacion;
      // Lógica para cada tipo de elemento
      if (tipo === "alimentos") {
        // Prevenir si no hay lugares disponibles
        const lugaresArray = Object.keys(lugares);
        if (lugaresArray.length === 0) {
          mostrarToastStrategy("error", {
            mensaje: "No hay lugares disponibles. Agrega un lugar primero.",
          });
          return;
        }
        // Buscar el objeto lugar correspondiente por id
        const lugarSeleccionado = lugares[lugarRef.current.value];
        if (!lugarSeleccionado) {
          mostrarToastStrategy("error", {
            mensaje: "Selecciona una ubicación válida.",
          });
          return;
        }
        const data = {
          nombre: nombreRef.current.value,
          tipo: tipoRef.current.value,
          calorias: caloriasRef.current.value,
          cantidad: cantidadRef.current.value,
          fechaVencimiento: fechaVencimientoRef.current.value,
          ubicacion: {
            id: lugarSeleccionado.id,
            nombre: lugarSeleccionado.nombre,
          },
        };
        validacion = alimentoSchema.safeParse(data);
        if (!validacion.success) {
          mostrarToastStrategy("error", {
            mensaje:
              "Datos inválidos: " +
              obtenerMensajesErrorZod(validacion.error.format()).join(", "),
          });
          return;
        }
        const nuevoAlimento = Alimento.crearAlimento(
          validacion.data.nombre,
          validacion.data.tipo,
          validacion.data.calorias,
          validacion.data.cantidad,
          validacion.data.fechaVencimiento,
          validacion.data.ubicacion
        );
        agregarElemento(nuevoAlimento, tipo);
        closeModal();
      } else if (tipo === "lugares") {
        const data = { nombre: nombreRef.current.value };
        validacion = lugarSchema.safeParse(data);
        if (!validacion.success) {
          mostrarToastStrategy("error", {
            mensaje:
              "Datos inválidos: " +
              obtenerMensajesErrorZod(validacion.error.format()).join(", "),
          });
          return;
        }
        const nuevoLugar = Lugar.crearLugar(validacion.data.nombre);
        agregarElemento(nuevoLugar, tipo);
        closeModal();
      } else if (tipo === "notas") {
        const data = {
          nombre: nombreRef.current.value,
          contenido: contenidoNotaRef.current.value,
        };
        validacion = notaSchema.safeParse(data);
        if (!validacion.success) {
          mostrarToastStrategy("error", {
            mensaje:
              "Datos inválidos: " +
              obtenerMensajesErrorZod(validacion.error.format()).join(", "),
          });
          return;
        }
        const nuevaNota = Nota.crearNota(
          validacion.data.nombre,
          validacion.data.contenido
        );
        agregarElemento(nuevaNota, tipo);
        closeModal();
      } else if (tipo === "recetas") {
        const data = {
          nombre: nombreRef.current.value,
          ingredientes: ingredientesRecetaRef.current.value,
          calorias: caloriasRef.current.value,
          instrucciones: instruccionesRecetaRef.current.value,
        };
        validacion = recetaSchema.safeParse(data);
        if (!validacion.success) {
          mostrarToastStrategy("error", {
            mensaje:
              "Datos inválidos: " +
              obtenerMensajesErrorZod(validacion.error.format()).join(", "),
          });
          return;
        }
        const nuevaReceta = Receta.crearReceta(
          validacion.data.nombre,
          validacion.data.ingredientes,
          validacion.data.calorias,
          validacion.data.instrucciones
        );
        agregarElemento(nuevaReceta, tipo);
        closeModal();
      } else if (tipo === "medicamentos") {
        const data = {
          nombre: nombreRef.current.value,
          uso: usoRef.current.value,
          cantidad: cantidadRef.current.value,
          fechaVencimiento: fechaVencimientoRef.current.value,
        };
        validacion = medicamentoSchema.safeParse(data);
        if (!validacion.success) {
          mostrarToastStrategy("error", {
            mensaje:
              "Datos inválidos: " +
              obtenerMensajesErrorZod(validacion.error.format()).join(", "),
          });
          return;
        }
        const nuevoMedicamento = Medicamento.crearMedicamento(
          validacion.data.nombre,
          validacion.data.uso,
          validacion.data.cantidad,
          validacion.data.fechaVencimiento
        );
        agregarElemento(nuevoMedicamento, tipo);
        closeModal();
      } else if (tipo === "otros") {
        const data = {
          nombre: nombreRef.current.value,
          uso: usoRef.current.value,
        };
        validacion = otrosSchema.safeParse(data);
        if (!validacion.success) {
          mostrarToastStrategy("error", {
            mensaje:
              "Datos inválidos: " +
              obtenerMensajesErrorZod(validacion.error.format()).join(", "),
          });
          return;
        }
        const nuevoOtro = Otros.crearOtrosItem(
          validacion.data.nombre,
          validacion.data.uso
        );
        agregarElemento(nuevoOtro, tipo);
        closeModal();
      } else {
        console.error(`Tipo "${tipo}" no válido.`);
        return;
      }
      mostrarToastStrategy("success", { mensaje: "Elemento agregado" });
    } catch (error) {
      console.error("Error al agregar elemento:", error);
      mostrarToastStrategy("error", { mensaje: "Error al agregar elemento" });
      return;
    } finally {
      // Limpiar los campos del formulario
      e.target.reset();
    }
  }

  // Renderiza el modal y el formulario según el tipo
  return (
    <dialog
      key={tipo}
      id="agregar-modal"
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center bg-background text-text p-4 rounded-lg shadow-lg"
      onClose={closeModal}
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

        {/* Renderiza campos específicos según el tipo de elemento */}
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

        {(tipo === "alimentos" || tipo === "medicamentos") && (
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

        {(tipo === "medicamentos" || tipo === "alimentos") && (
          <>
            <label htmlFor="fecha-vencimiento-medicamento">
              Fecha de vencimiento
            </label>
            <input
              type="date"
              id="fecha-vencimiento-medicamento"
              placeholder="Fecha de vencimiento"
              className="text-background"
              ref={fechaVencimientoRef}
            />
          </>
        )}

        {(tipo === "otros" || tipo === "medicamentos") && (
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

        {/* Botón para agregar el elemento */}
        <button
          type="submit"
          className="bg-light-secundary text-background font-bold py-2 px-4 rounded hover:bg-atencion transition-all duration-300 cursor-pointer"
        >
          Agregar
        </button>
        {/* Botón para cancelar y cerrar el modal */}
        <button
          type="button"
          id="cancelar-agregar-button"
          className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-warning hover:text-background transition-colors duration-300 cursor-pointer"
          onClick={closeModal}
        >
          Cancelar
        </button>
      </form>
    </dialog>
  );
}
