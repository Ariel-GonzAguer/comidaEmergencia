class Receta {
  constructor(nombre, ingredientes, calorias, instrucciones) {
    this.nombre = nombre;
    this.ingredientes = ingredientes;
    this.calorias = calorias;
    this.instrucciones = instrucciones;
    this.id = `${this.nombre}-${crypto.randomUUID()}`;
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

  setCalorias(calorias) {
    this.calorias = calorias;
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
