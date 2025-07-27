class Lugar {
    id = `${this.nombre}-${randomUUID()}`;

  constructor(nombre) {
    this.nombre = nombre;
    this.alimentos = [];
  }

  getNombre() {
    return this.nombre;
  }

  getAlimentos() {
    return this.alimentos;
  }

  agregarAlimento(alimento) {
    this.alimentos.push(alimento);
  }


  static crearLugar(nombre) {
    return new Lugar(nombre);
  }
}

export default Lugar;
