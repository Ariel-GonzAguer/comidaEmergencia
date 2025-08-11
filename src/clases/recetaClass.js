/**
 * Clase que representa una receta culinaria.
 * 
 * @class
 * @classdesc Permite crear y manipular recetas con nombre, ingredientes, calorías e instrucciones.
 * 
 * @property {string} nombre - Nombre de la receta.
 * @property {Object} ingredientes - Ingredientes de la receta, representados como un objeto.
 * @property {number} calorias - Cantidad de calorías de la receta.
 * @property {string} instrucciones - Instrucciones para preparar la receta.
 * @property {string} id - Identificador único de la receta.
 * 
 * @method getNombre Obtiene el nombre de la receta.
 * @method getIngredientes Obtiene los ingredientes de la receta.
 * @method getInstrucciones Obtiene las instrucciones de la receta.
 * @method setCalorias Establece la cantidad de calorías de la receta.
 * @method getCalorias Obtiene la cantidad de calorías de la receta.
 * @method getReceta Devuelve un objeto con los datos principales de la receta.
 * @static
 * @method crearReceta Crea una nueva instancia de Receta.
 * @param {string} nombre - Nombre de la receta.
 * @param {Object} ingredientes - Ingredientes de la receta.
 * @param {number} calorias - Calorías de la receta.
 * @param {string} instrucciones - Instrucciones de la receta.
 * @returns {Receta} Nueva instancia de Receta.
 */
class Receta {
  constructor(nombre, ingredientes = {}, calorias, instrucciones) {
    this.nombre = nombre;
    this.ingredientes = ingredientes;
    this.calorias = calorias;
    this.instrucciones = instrucciones;
    this.id = `${this.nombre}-${crypto.randomUUID()}`;
  }

  getNombre() {
    return this.nombre;
  }

  getIngredientes() {
    return this.ingredientes;
  }

  getInstrucciones() {
    return this.instrucciones;
  }

  setCalorias(calorias) {
    this.calorias = calorias;
  }

  getCalorias() {
    return this.calorias;
  }

  // con este método estático se puede crear una nueva receta sin usar `new`
  static crearReceta(nombre, ingredientes, calorias, instrucciones) {
    return new Receta(nombre, ingredientes, calorias, instrucciones);
  }

  getReceta() {
    return {
      nombre: this.nombre,
      ingredientes: this.ingredientes,
      calorias: this.calorias,
      instrucciones: this.instrucciones,
      id: this.id
    };
  }
}

export default Receta;
