class OtrosItem {
  constructor(nombre, uso) {
    this.nombre = nombre;
    this.uso = uso;
    this.id = `${this.nombre}-${crypto.randomUUID()}`;
  }

  getNombre() {
    return this.nombre;
  }

  getUso() {
    return this.uso;
  }

  static crearOtrosItem(nombre, uso) {
    return new OtrosItem(nombre, uso);
  }
}

export default OtrosItem;
