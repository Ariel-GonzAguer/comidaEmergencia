class BotiquinItem {
  constructor(nombre, uso, cantidad, fechaVencimiento) {
    this.nombre = nombre;
    this.uso = uso;
    this.cantidad = cantidad;
     this.fechaVencimiento = new Date(fechaVencimiento).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.id = `${this.nombre}-${crypto.randomUUID()}`;
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
