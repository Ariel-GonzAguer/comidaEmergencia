class Nota {
  id = `${this.nombre}-${randomUUID()}`;

  constructor(nombre, contenido) {
    this.nombre = nombre;
    this.contenido = contenido;
    this.fecha = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getNota() {
    return {
      nombre: this.nombre,
      contenido: this.contenido,
      fecha: this.fecha
    };
  }

  static crearNota(nombre, contenido, fecha) {
    return new Nota(nombre, contenido, fecha);
  }
}

export default Nota;