/**
 * Clase que representa una nota con nombre, contenido, fecha e identificador único.
 * 
 * @class
 * @property {string} nombre - El nombre de la nota.
 * @property {string} contenido - El contenido de la nota.
 * @property {string} fecha - La fecha de creación de la nota, formateada en español.
 * @property {string} id - Identificador único de la nota.
 * 
 * @method getNota Obtiene un objeto con los datos de la nota.
 * @returns {{nombre: string, contenido: string, fecha: string}} Objeto con los datos de la nota.
 * 
 * @static
 * @method crearNota Crea una nueva instancia de Nota.
 * @param {string} nombre - El nombre de la nota.
 * @param {string} contenido - El contenido de la nota.
 * @returns {Nota} Nueva instancia de Nota.
 */
class Nota {
  fecha = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  constructor(nombre, contenido) {
    this.nombre = nombre;
    this.contenido = contenido;
    this.id = `${this.nombre}-${crypto.randomUUID()}`;
  }

  getNota() {
    return {
      nombre: this.nombre,
      contenido: this.contenido,
      fecha: this.fecha
    };
  }

  static crearNota(nombre, contenido) {
    return new Nota(nombre, contenido);
  }
}

export default Nota;
