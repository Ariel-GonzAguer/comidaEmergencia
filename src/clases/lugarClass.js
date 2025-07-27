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

  agregarAlimento(alimento) {
    this.alimentos[alimento.getNombre()] = alimento;
  }

  eliminarAlimento(nombre) {
    delete this.alimentos[nombre];
  }

  moverAlimento(nombre, nuevoLugar) {
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
