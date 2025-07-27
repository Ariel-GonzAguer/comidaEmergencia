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
