/**
 * Clase que representa un alimento con información relevante para su gestión.
 * 
 * @class
 * @property {string} nombre - Nombre del alimento.
 * @property {string} tipo - Tipo o categoría del alimento.
 * @property {number} calorias - Cantidad de calorías por unidad.
 * @property {number} cantidad - Cantidad disponible del alimento.
 * @property {string} fechaVencimiento - Fecha de vencimiento en formato local (es-ES).
 * @property {string} ubicacion - Ubicación donde se almacena el alimento.
 * @property {string} id - Identificador único del alimento.
 * 
 * @method getNombre Obtiene el nombre del alimento.
 * @method getTipo Obtiene el tipo del alimento.
 * @method getFechaVencimiento Obtiene la fecha de vencimiento del alimento.
 * @method setFechaVencimiento Establece la fecha de vencimiento del alimento.
 * @method getCalorias Obtiene la cantidad de calorías del alimento.
 * @method getCantidad Obtiene la cantidad disponible del alimento.
 * @method getUbicacion Obtiene la ubicación del alimento.
 * @static
 * @method crearAlimento Crea una nueva instancia de Alimento.
 * @param {string} nombre - Nombre del alimento.
 * @param {string} tipo - Tipo o categoría del alimento.
 * @param {number|string} calorias - Cantidad de calorías por unidad.
 * @param {number|string} cantidad - Cantidad disponible del alimento.
 * @param {string|Date} fechaVencimiento - Fecha de vencimiento.
 * @param {string} ubicacion - Ubicación donde se almacena el alimento.
 * @returns {Alimento} Nueva instancia de Alimento.
 */
class Alimento {

  constructor(nombre, tipo, calorias, cantidad, fechaVencimiento, ubicacion) {
    this.nombre = nombre;
    this.tipo = tipo;
    this.calorias = Number(calorias) || 0;
    this.cantidad = Number(cantidad) || 0;
    this.ubicacion = ubicacion;
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

  getTipo() {
    return this.tipo;
  }

  getFechaVencimiento() {
    return this.fechaVencimiento;
  }
  setFechaVencimiento(fechaVencimiento) {
    this.fechaVencimiento = fechaVencimiento;
  }
  getCalorias() {
    return this.calorias;
  }

  getCantidad() {
    return this.cantidad;
  }

  getUbicacion() {
    return this.ubicacion;
  }

  static crearAlimento(nombre, tipo, calorias, cantidad, fechaVencimiento, ubicacion) {
    return new Alimento(nombre, tipo, calorias, cantidad, fechaVencimiento, ubicacion);
  }

}

export default Alimento;
