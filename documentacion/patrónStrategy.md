# Patrón Strategy en ComidaEmergencia

## ¿Qué es el patrón Strategy?
El patrón Strategy es un patrón de diseño de comportamiento que permite definir una familia de algoritmos, encapsular cada uno de ellos y hacerlos intercambiables. El objeto que usa el algoritmo no necesita conocer los detalles internos de cada estrategia, solo debe saber cómo invocarla.

Esto permite cambiar el comportamiento de un objeto en tiempo de ejecución, simplemente cambiando la estrategia utilizada.

## ¿Por qué se usa?
- Permite separar la lógica de decisión de la lógica de ejecución.
- Facilita la extensión y el mantenimiento del código.
- Hace posible agregar nuevas estrategias sin modificar el código existente que las utiliza.

## Ejemplo general
Suponga que tiene varias formas de mostrar notificaciones (éxito, error, confirmación, etc.). En vez de usar condicionales por todas partes, puede definir una estrategia para cada tipo de notificación y seleccionar la adecuada según el contexto.

## Uso del patrón Strategy en ComidaEmergencia
En este proyecto, el patrón Strategy se utiliza para manejar las notificaciones tipo toast (mensajes emergentes) de manera flexible y extensible.

### ¿Dónde?
- Carpeta: `src/scripts/strategies/toastStrategy/`
  - `toastStrategiesObject.js`: Define las estrategias concretas para cada tipo de toast (éxito, error, eliminar, etc.).
  - `index.js`: Función principal que selecciona y ejecuta la estrategia adecuada según el tipo de notificación.
  - `validacion.js`: Valida que la estrategia y los datos sean correctos antes de ejecutar la acción.

### ¿Cómo funciona?
1. Cuando se necesita mostrar un toast, se llama a la función `mostrarToastStrategy(tipo, payload)`.
2. Esta función valida el tipo y los datos recibidos.
3. Selecciona la estrategia correspondiente del objeto `toastStrategiesObject`.
4. Ejecuta la estrategia, mostrando el toast adecuado (éxito, error, confirmación de eliminación, etc.).

#### Ejemplo de uso en código
```js
import mostrarToastStrategy from "../scripts/strategies/toastStrategy";

// Mostrar un toast de éxito
mostrarToastStrategy("success", { mensaje: "Elemento guardado correctamente" });

// Mostrar un toast de error
mostrarToastStrategy("error", { mensaje: "Ocurrió un error" });

// Mostrar un toast de confirmación para eliminar
mostrarToastStrategy("eliminar", { key: "alimentos", id: "123" });
```

### Ventajas en este proyecto
- Permite agregar nuevos tipos de notificaciones fácilmente.
- El código de los componentes no necesita saber cómo se muestra cada toast, solo qué tipo de notificación necesita.
- Facilita la validación y el control de errores.

---

**En resumen:** El patrón Strategy ayuda a mantener el código limpio, flexible y fácil de extender, especialmente para funcionalidades que pueden variar, como las notificaciones en ComidaEmergencia.
