/**
 * Representa un ítem con un nombre y un uso, generando un ID único para cada instancia.
 * 
 * @class OtrosItem
 * @param {string} nombre - El nombre del ítem.
 * @param {string} uso - El uso o propósito del ítem.
 * 
 * @property {string} nombre - El nombre del ítem.
 * @property {string} uso - El uso o propósito del ítem.
 * @property {string} id - Un identificador único para el ítem.
 * 
 * @method getNombre
 * @returns {string} El nombre del ítem.
 * 
 * @method getUso
 * @returns {string} El uso o propósito del ítem.
 * 
 * @static
 * @method crearOtrosItem
 * @param {string} nombre - El nombre del ítem.
 * @param {string} uso - El uso o propósito del ítem.
 * @returns {OtrosItem} Una nueva instancia de OtrosItem.
 */
class OtrosItem {
  constructor(nombre, uso) {
    this.nombre = nombre;
    this.uso = uso;
    this.id = `${this.nombre}-${crypto.randomUUID()}`;
  }

  getNombre() {
    return this.nombre;
  }

  getUso() {
    return this.uso;
  }

  static crearOtrosItem(nombre, uso) {
    return new OtrosItem(nombre, uso);
  }
}

export default OtrosItem;
