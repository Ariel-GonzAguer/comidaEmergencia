class BotiquinItem {
  id = `${this.nombre}-${randomUUID()}`;

  constructor(nombre, uso, cantidad, fechaVencimiento) {
    this.nombre = nombre;
    this.uso = uso;
    this.cantidad = cantidad;
    this.fechaVencimiento = fechaVencimiento;
  }

  getNombre() {
    return this.nombre;
  }

  getUso() {
    return this.uso;
  }

  getCantidad() {
    return this.cantidad;
  }

  getFechaVencimiento() {
    return this.fechaVencimiento;
  }

  static crearBotiquinItem(nombre, uso, cantidad, fechaVencimiento) {
    return new BotiquinItem(nombre, uso, cantidad, fechaVencimiento);
  }


}
export default BotiquinItem;