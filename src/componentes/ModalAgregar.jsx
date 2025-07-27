// hooks
import { useState, useRef } from "react";

// clases
import Alimento from "../clases/AlimentoClass";
import Lugar from "../clases/lugarClass";
import Nota from "../clases/notaClass";
import Receta from "../clases/recetaClass";

export default function ModalAgregar(props) {
  // refs
  const nombreComidaRef = useRef();
  const ingredientesComidaRef = useRef();
  const instruccionesComidaRef = useRef();
  const caloriasComidaRef = useRef();
  const nombreLugarRef = useRef();
  const tituloNotaRef = useRef();
  const contenidoNotaRef = useRef();

  // funciones
  function handleAgregar(e) {
    e.preventDefault();

    if (props.tipo === "comida") {
      const nuevoAlimento = Alimento.crearAlimento(
        nombreComidaRef.current.value,
        ingredientesComidaRef.current.value,
        caloriasComidaRef.current.value,
        instruccionesComidaRef.current.value
      );
      props.agregarAlimento(nuevoAlimento);
    } else if (props.tipo === "lugar") {
      const nuevoLugar = Lugar.crearLugar(nombreLugarRef.current.value);
      props.agregarLugar(nuevoLugar);
    } else if (props.tipo === "nota") {
      const nuevaNota = Nota.crearNota(
        tituloNotaRef.current.value,
        contenidoNotaRef.current.value
      );
      props.agregarNota(nuevaNota);
    } else if (props.tipo === "receta") {
      const nuevaReceta = Receta.crearReceta(
        nombreComidaRef.current.value,
        ingredientesComidaRef.current.value,
        caloriasComidaRef.current.value,
        instruccionesComidaRef.current.value
      );
      props.agregarReceta(nuevaReceta);
    }

    // Limpiar los campos del formulario
    e.target.reset();
  }

  return (
    <div className="modal">
      <h2>Agregar {props.tipo}</h2>
      <form>
        {/* Campos del formulario según el tipo */}
        {props.tipo === "comida" && (
          <>
            <label htmlFor="nombre-comida">Nombre de la comida</label>
            <input
              type="text"
              id="nombre-comida"
              placeholder="Nombre de la comida"
            />
            <label htmlFor="ingredientes-comida">Ingredientes</label>
            <input
              type="text"
              id="ingredientes-comida"
              placeholder="Ingredientes"
            />
            <label htmlFor="instrucciones-comida">Instrucciones</label>
            <input
              type="text"
              id="instrucciones-comida"
              placeholder="Instrucciones"
            />
            <label htmlFor="calorias-comida">Calorías</label>
            <input type="number" id="calorias-comida" placeholder="Calorías" />
          </>
        )}
        {props.tipo === "lugar" && (
          <>
            <label htmlFor="nombre-lugar">Nombre del lugar</label>
            <input
              type="text"
              id="nombre-lugar"
              placeholder="Nombre del lugar"
            />
          </>
        )}
        {props.tipo === "nota" && (
          <>
            <label htmlFor="titulo-nota">Título de la nota</label>
            <input
              type="text"
              id="titulo-nota"
              placeholder="Título de la nota"
            />
            <label htmlFor="contenido-nota">Contenido de la nota</label>
            <textarea
              id="contenido-nota"
              placeholder="Contenido de la nota"
            ></textarea>
          </>
        )}
        <button type="submit">Agregar</button>
      </form>
    </div>
  );
}
