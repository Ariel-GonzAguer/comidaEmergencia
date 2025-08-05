/**
 * Clase que representa un Medicamento.
 *
 * @class Medicamento
 * @classdesc Representa un Medicamento, incluyendo su nombre, uso, cantidad, fecha de vencimiento y un identificador único.
 *
 * @param {string} nombre - Nombre del ítem.
 * @param {string} uso - Descripción del uso del ítem.
 * @param {number} cantidad - Cantidad disponible del ítem.
 * @param {string|Date} fechaVencimiento - Fecha de vencimiento del ítem (puede ser string o Date).
 * 
 * @property {string} nombre - Nombre del ítem.
 * @property {string} uso - Uso del ítem.
 * @property {number} cantidad - Cantidad disponible.
 * @property {string} fechaVencimiento - Fecha de vencimiento en formato local (es-ES).
 * @property {string} id - Identificador único del ítem.
 * 
 * @method getNombre Obtiene el nombre del ítem.
 * @method getUso Obtiene el uso del ítem.
 * @method getCantidad Obtiene la cantidad disponible del ítem.
 * @method getFechaVencimiento Obtiene la fecha de vencimiento del ítem.
 * @static
 * @method crearMedicamento Crea una nueva instancia de Medicamento.
 * @param {string} nombre - Nombre del ítem.
 * @param {string} uso - Uso del ítem.
 * @param {number} cantidad - Cantidad disponible.
 * @param {string|Date} fechaVencimiento - Fecha de vencimiento.
 * @returns {Medicamento} Nueva instancia de Medicamento.
 */
class Medicamento {
  constructor(nombre, uso, cantidad, fechaVencimiento) {
    this.nombre = nombre;
    this.uso = uso;
    this.cantidad = cantidad;
     this.fechaVencimiento = new Date(fechaVencimiento).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.id = `${this.nombre}-${crypto.randomUUID()}`;
  }

  getNombre() {
    return this.nombre;
  }

  getUso() {
    return this.uso;
  }

  getCantidad() {
    return this.cantidad;
  }

  getFechaVencimiento() {
    return this.fechaVencimiento;
  }

  static crearMedicamento(nombre, uso, cantidad, fechaVencimiento) {
    return new Medicamento(nombre, uso, cantidad, fechaVencimiento);
  }


}
export default Medicamento;
