class Alimento {

  constructor(nombre, tipo, calorias, cantidad, fechaVencimiento) {
    this.nombre = nombre;
    this.tipo = tipo;
    this.calorias = calorias;
    this.cantidad = cantidad;
    this.fechaVencimiento = fechaVencimiento;
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

  static crearAlimento(nombre, tipo, calorias, cantidad, fechaVencimiento) {
    return new Alimento(nombre, tipo, calorias, cantidad, fechaVencimiento);
  }

}

export default Alimento;
