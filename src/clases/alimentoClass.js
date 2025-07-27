class Alimento {
  id = `${this.nombre}-${randomUUID()}`;

  constructor(nombre, tipo, calorias, cantidad) {
    this.nombre = nombre;
    this.tipo = tipo;
    this.calorias = calorias;
    this.cantidad = cantidad;
  }

  getNombre() {
    return this.nombre;
  }

  getTipo() {
    return this.tipo;
  }

  getCalorias() {
    return this.calorias;
  }

  getCantidad() {
    return this.cantidad;
  }

  static crearAlimento(nombre, tipo, calorias, cantidad) {
    return new Alimento(nombre, tipo, calorias, cantidad);
  }

}

export default Alimento;