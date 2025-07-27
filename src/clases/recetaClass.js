class Receta {
  id = `${this.nombre}-${randomUUID()}`;

  constructor(nombre, ingredientes, calorias, instrucciones) {
    this.nombre = nombre;
    this.ingredientes = ingredientes;
    this.calorias = calorias;
    this.instrucciones = instrucciones;
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

  getCalorias() {
    return this.calorias;
  }
  static crearReceta(nombre, ingredientes, calorias, instrucciones) {
    return new Receta(nombre, ingredientes, calorias, instrucciones);
  }

  getReceta() {
    return {
      nombre: this.nombre,
      ingredientes: this.ingredientes,
      calorias: this.calorias,
      instrucciones: this.instrucciones
    };
  }
}

export default Receta;