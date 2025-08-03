/**
 * Clase que representa un Lugar donde se almacenan alimentos.
 * 
 * @class
 * @property {Object.<string, Object>} alimentos - Diccionario de alimentos almacenados en el lugar, indexados por nombre.
 * @property {string} nombre - Nombre del lugar.
 * @property {string} id - Identificador único del lugar.
 * 
 * @method getNombre Obtiene el nombre del lugar.
 * @returns {string} El nombre del lugar.
 * 
 * @method getAlimentos Obtiene el diccionario de alimentos del lugar.
 * @returns {Object.<string, Object>} Diccionario de alimentos.
 * 
 * @method eliminarAlimento Elimina un alimento del lugar por su nombre.
 * @param {string} nombre - Nombre del alimento a eliminar.
 * 
 * @static
 * @method agregarAlimento Agrega un alimento al lugar.
 * @param {Object} alimento - Instancia del alimento a agregar. Debe tener un método getNombre().
 * 
 * @static
 * @method moverAlimento Mueve un alimento de un lugar a otro.
 * @param {string} nombre - Nombre del alimento a mover.
 * @param {Lugar} nuevoLugar - Instancia del lugar destino.
 * 
 * @static
 * @method crearLugar Crea una nueva instancia de Lugar.
 * @param {string} nombre - Nombre del nuevo lugar.
 * @returns {Lugar} Nueva instancia de Lugar.
 */
class Lugar {
  alimentos = {};

  constructor(nombre) {
    this.nombre = nombre;
    this.id = `${this.nombre}-${crypto.randomUUID()}`;
  }

  getNombre() {
    return this.nombre;
  }

  getAlimentos() {
    return this.alimentos;
  }

  static agregarAlimento(alimento) {
    this.alimentos[alimento.getNombre()] = alimento;
  }

  eliminarAlimento(nombre) {
    delete this.alimentos[nombre];
  }

  static moverAlimento(nombre, nuevoLugar) {
    if (this.alimentos[nombre]) {
      nuevoLugar.agregarAlimento(this.alimentos[nombre]);
      this.eliminarAlimento(nombre);
    } else {
      console.error(`El alimento ${nombre} no existe en el lugar ${this.nombre}`);
    }
  }

  static crearLugar(nombre) {
    return new Lugar(nombre);
  }
}

export default Lugar;
